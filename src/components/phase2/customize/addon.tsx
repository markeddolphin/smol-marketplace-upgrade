import { ADDONS_CONTROLLER_ADDRESS, MAGIC_ADDRESS, SMOL_AGE_BONES } from '@config';
import { useAllowance, useApproveERC20 } from '@hooks/useApprove';
import { AddonsController__factory } from '@typechain';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { erc20ABI, useAccount, useContractRead, useContractWrite } from 'wagmi';
import { AddonType } from './addons_constants';
import { useHasCouncilPass } from '@hooks/useHasCouncilPass';


const SKILL_ENUM = {
  0: 'mystic',
  1: 'farmer',
  2: 'fighter',
};

export function Addon({
  addon,
  csLevel,
  smolId,
  chainId,
  skills,
  selected,
  onSelected,
}: {
  addon: AddonType;
  smolId: BigNumber;
  skills: {
    mystic: BigNumber;
    farmer: BigNumber;
    fighter: BigNumber;
  };
  csLevel: number;
  chainId: number;
  selected: boolean;
  onSelected: () => void;
}) {
  const { address } = useAccount();
  // check if the addon is purchased by the user
  const {
    data: isPurchased,
    isLoading: isLoadingPurchased,
    refetch: mutateIsPurchased,
    error: errorFetchingIsPurchased,
  } = useContractRead({
    address: ADDONS_CONTROLLER_ADDRESS[chainId],
    abi: AddonsController__factory.abi,
    args: [smolId, addon.id],
    functionName: 'isAddonPurchased',
  });

  const {
    data: addonData,
    isLoading: isLoadingAddonData,
    refetch: mutateAddonData,
    error: errorFetchingAddonData,
  } = useContractRead({
    address: ADDONS_CONTROLLER_ADDRESS[chainId],
    abi: AddonsController__factory.abi,
    args: [addon.id],
    functionName: 'addons',
  });

  // Get the price of the addon
  const { data: addonPrice, isLoading: isLoadingAddonPrice, error: errorFetchingAddonPrice } = useContractRead({
    address: ADDONS_CONTROLLER_ADDRESS[chainId],
    abi: AddonsController__factory.abi,
    args: [addon.id],
    functionName: 'addonPrice',
  });

  const { hasCouncilPass, isLoading: isLoadingHasCouncilPass, error: errorFetchingCouncilPass } = useHasCouncilPass({chainId})

  // Check the allowance for magic and bones
  const {
    data: magicAllowance,
    isLoading: isLoadingMagicAllowance,
    refetch: mutateMagicAllowance,
    error: errorFetchingMagicAllowance,
  } = useAllowance(MAGIC_ADDRESS[chainId], address, ADDONS_CONTROLLER_ADDRESS[chainId]);

  const {
    data: bonesAllowance,
    isLoading: isLoadingBonesAllowance,
    refetch: mutateBonesAllowance,
    error: errorFetchingBonesAllowance,
  } = useAllowance(SMOL_AGE_BONES[chainId], address, ADDONS_CONTROLLER_ADDRESS[chainId]);

  // const {
  //   data: maxReached,
  //   isLoading: isLoadingMaxReached,
  //   refetch: mutateMaxReached,
  // } = useContractRead({
  //   address: ADDONS_CONTROLLER_ADDRESS[chainId],
  //   abi: AddonsController__factory.abi,
  //   args: [id],
  //   functionName: 'hasReachedMax',
  // });

  const { bonesPrice, magicPrice, isMagicTokenB } = useMemo(() => {
    if (addonPrice) {
      const tokenA = addonPrice.tokenA;
      const tokenB = addonPrice.tokenB;
      let magicPrice = BigNumber.from(0);
      let bonesPrice = BigNumber.from(0);

      if (tokenA.toLowerCase() === SMOL_AGE_BONES[chainId].toLowerCase()) {
        bonesPrice = addonPrice.amountA;
      }

      if (tokenB.toLowerCase() === SMOL_AGE_BONES[chainId].toLowerCase()) {
        bonesPrice = addonPrice.amountB;
      }

      if (tokenA.toLowerCase() === MAGIC_ADDRESS[chainId].toLowerCase()) {
        magicPrice = addonPrice.amountA;
      }

      if (tokenB.toLowerCase() === MAGIC_ADDRESS[chainId].toLowerCase()) {
        magicPrice = addonPrice.amountB;
      }

      return { bonesPrice, magicPrice, isMagicTokenB: tokenB.toLowerCase() === MAGIC_ADDRESS[chainId].toLowerCase() };
    }

    return { bonesPrice: BigNumber.from(0), magicPrice: BigNumber.from(0), isMagicTokenB: true };
  }, [addonPrice]);

  // Increase allowance for magic and bones
  const { approve: approveMagic } = useApproveERC20(
    MAGIC_ADDRESS[chainId],
    ADDONS_CONTROLLER_ADDRESS[chainId],
    magicPrice,
    mutateMagicAllowance,
  );

  const { approve: approveBones } = useApproveERC20(
    SMOL_AGE_BONES[chainId],
    ADDONS_CONTROLLER_ADDRESS[chainId],
    bonesPrice,
    mutateBonesAllowance,
  );


  // Token balances
  const { data: magicBalance } = useContractRead({
    address: MAGIC_ADDRESS[chainId],
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  const { data: bonesBalance } = useContractRead({
    address: SMOL_AGE_BONES[chainId],
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  const { writeAsync: purchaseAddon } = useContractWrite({
    address: ADDONS_CONTROLLER_ADDRESS[chainId],
    abi: AddonsController__factory.abi,
    functionName: 'purchaseAddon',
    mode: 'recklesslyUnprepared',
  });

  // Function to purchase the addon with bones
  const purchaseWithBones = () => {
    if (bonesAllowance.lt(bonesPrice)) {
      toast.error('You need to approve the contract to spend your bones');
      return;
    }

    purchaseAddon({
      recklesslySetUnpreparedArgs: [smolId, addon.id, isMagicTokenB ? false : true],
    })
      .then(() => {
        mutateBonesAllowance();
        mutateIsPurchased();
        mutateAddonData();
        toast.success('Addon purchased');
      })
      .catch((err) => {
        toast.error('Error purchasing addon');
      });
  };

  const purchaseWithMagic = () => {
    if (magicAllowance.lt(magicPrice)) {
      toast.error('You need to approve the contract to spend your magic');
      return;
    }

    purchaseAddon({
      recklesslySetUnpreparedArgs: [smolId, addon.id, isMagicTokenB ? true : false],
    })
      .then(() => {
        mutateMagicAllowance();
        mutateIsPurchased();
        toast.success('Addon purchased');
      })
      .catch((err) => {
        toast.error('Error purchasing addon');
      });
  };

  const hasReachedMax = useMemo(() => {
    if (addonData && addonData.hasMax) {
      return addonData.currentCount.gte(addonData.max);
    }
    return false;
  }, [addonData]);


  const isLoading = useMemo(() => {
    return isLoadingPurchased || isLoadingAddonPrice || isLoadingAddonData || isLoadingMagicAllowance || isLoadingBonesAllowance || isLoadingHasCouncilPass

  }, [isLoadingPurchased, isLoadingAddonPrice, isLoadingAddonData, isLoadingMagicAllowance, isLoadingBonesAllowance, isLoadingHasCouncilPass]);

  const canPurchase = useMemo(() => {
    if (
      !addonData ||
      isLoadingPurchased ||
      isLoadingAddonPrice ||
      isLoadingAddonData ||
      isLoadingMagicAllowance ||
      isLoadingBonesAllowance
    ) {
      return false;
    }

    const hasEnoughSkill = addonData.skillLevel.eq(0)
      ? true
      : skills[SKILL_ENUM[addonData.skill]] && skills[SKILL_ENUM[addonData.skill]].gte(addonData.skillLevel);


    const hasEnoughCs = addonData.csLevel.eq(0) ? true : csLevel >= addonData.csLevel.toNumber();

    const meetsPassRequirements = addon.requiresPass ? hasCouncilPass : true;

    return !hasReachedMax && !isPurchased && hasEnoughSkill && hasEnoughCs && meetsPassRequirements;
  }, [
    hasReachedMax,
    isPurchased,
    skills,
    csLevel,
    addonData,
    isLoadingPurchased,
    isLoadingAddonPrice,
    isLoadingAddonData,
    isLoadingMagicAllowance,
    isLoadingBonesAllowance,
  ]);


  return (
    <div
      className={`${
        selected ? 'border-2 border-green-700' : ''
      } m-3 flex w-full flex-col items-center items-center justify-center`}
    >
      <div className="text-lg">{addon.name}</div>
      {errorFetchingAddonData && <div>Error fetching addon data</div>}
      {errorFetchingAddonPrice && <div>Error fetching addon price</div>}
      {errorFetchingBonesAllowance && <div>Error fetching bones allowance</div>}
      {errorFetchingMagicAllowance && <div>Error fetching magic allowance</div>}
      {errorFetchingIsPurchased && <div>Error fetching is purchased</div>}
      {errorFetchingCouncilPass && <div>Error fetching council pass</div>}
      {addonData && (
        <div>
          Total purchased: {addonData.currentCount.toString()}{' '}
          {addonData.hasMax ? ` of ${addonData.max.toString()}` : ''}
        </div>
      )}
      {addonData && (
        <div>
          {addonData.skillLevel.gt(0) && (
            <div>
              Skill level required: {formatEther(addonData.skillLevel)} /{' '}
              {SKILL_ENUM[addonData.skill]}
            </div>
          )}
          {addonData.csLevel.gt(0) && (
            <div>Common Sense level required: {addonData.csLevel.toString()}</div>
          )}
          {addonData.requiresPass && <div>Requires Council Member Pass</div>}
        </div>
      )}
      <div className="w-48">
        <img src={`/static/images/addons/${addon.id}.png`} alt={addon.id} />
      </div>
      <div className="buttons-section flex justify-between">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="buttons-section flex justify-between">
            {hasReachedMax && (
              <button className="btn btn-primary" disabled>
                Max Reached
              </button>
            )}
            {!canPurchase && !isPurchased && (
              <button className="btn btn-primary" disabled>
                Can not be purchased for this smol
              </button>
            )}
            {canPurchase && bonesAllowance && magicAllowance && bonesPrice && magicPrice && bonesBalance && magicBalance && (
              <>
                {bonesAllowance.lt(bonesPrice) && bonesPrice.gt(0) && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      try {
                        approveBones();
                      } catch (error) {
                        toast.error('Error approving bones');
                      }
                    }}
                  >
                    Approve {formatEther(bonesPrice)} Bones
                  </button>
                )}
                {bonesAllowance.gte(bonesPrice) && bonesPrice.gt(0) && bonesBalance.gte(bonesPrice) && (
                  <button className="btn btn-primary" onClick={purchaseWithBones}>
                    Purchase with {formatEther(bonesPrice)} Bones
                  </button>
                )}
                {bonesAllowance.gte(bonesPrice) && bonesPrice.gt(0) && bonesBalance.lt(bonesPrice) && (
                  <button className="btn btn-primary" disabled>
                    You need {formatEther(bonesPrice.sub(bonesBalance))} more Bones
                  </button>
                )}
                {magicAllowance.lt(magicPrice) && magicPrice.gt(0) && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      try {
                        approveMagic();
                      } catch (error) {
                        toast.error('Error approving magic');
                      }
                    }}
                  >
                    Approve {formatEther(magicPrice)} Magic
                  </button>
                )}
                {magicAllowance.gte(magicPrice) && magicPrice.gt(0) && magicBalance.gte(magicPrice) && (
                  <button className="btn btn-primary" onClick={purchaseWithMagic}>
                    Purchase with {formatEther(magicPrice)} Magic
                  </button>
                )}
                {magicAllowance.gte(magicPrice) && magicPrice.gt(0) && magicBalance.lt(magicPrice) && (
                  <button className="btn btn-primary" disabled>
                    You need {formatEther(magicPrice.sub(magicBalance))} more Magic
                  </button>
                )}
                {bonesPrice.eq(0) && magicPrice.eq(0) && !addon.requiresPass && (
                  <button className="btn btn-primary" onClick={purchaseWithMagic}>
                    Purchase for free
                  </button>
                )}

                {bonesPrice.eq(0) && magicPrice.eq(0) && addon.requiresPass && (
                  <button className="btn btn-primary" onClick={purchaseWithMagic}>
                    Get with Council Member Pass
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {isPurchased && (
          <button className="btn btn-primary" onClick={onSelected}>
            {selected ? 'Remove' : 'Select'}
          </button>
        )}
      </div>
    </div>
  );
}
