import { ARBITRUM, LABOR_GROUNDS, SHOP } from '@config';
import { SMOL_AGE_PHASE2_GAME_GUIDE_LINK } from '@constants';
import { Phase2Context } from '@context/phase2Context';
import { useApproveERC721, useIsApprovedERC721 } from '@hooks/useApprove';
import { useBalanceERC1155 } from '@hooks/useBalance';
import { NFTObject } from '@model/model';
import { cn, min } from '@utils';
import { BigNumber } from 'ethers';
import Image from 'next/image';
import { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useNetwork } from 'wagmi';
import { tools } from '../shop/Shop';

export const Stake = ({ job }) => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { enterLaborGrounds, nfts } = useContext(Phase2Context);
  const [selected, setSelected] = useState<BigNumber[]>();
  const supplyId = useMemo(() => BigNumber.from(job.id + 1), [job]);
  const { data: supplybalance } = useBalanceERC1155(SHOP[chain?.id ?? ARBITRUM], address, supplyId);
  const { data: supplyAllowance, refetch: refetchSupplyAllowance } = useIsApprovedERC721(
    SHOP[chain?.id ?? ARBITRUM],
    address,
    LABOR_GROUNDS[chain?.id ?? ARBITRUM],
  );
  const supplyTokenName = tools.find((tool) => tool.tokenId.eq(supplyId)).name;

  const { approve: approveSupply, success: approvingTxSucceed } = useApproveERC721(
    SHOP[chain?.id ?? ARBITRUM],
    LABOR_GROUNDS[chain?.id ?? ARBITRUM],
  );
  useEffect(() => {
    refetchSupplyAllowance();
  }, [approvingTxSucceed]);

  const stake = async () => {
    if (BigNumber.from(supplybalance).lt(selected.length)) {
      toast.error(`Ser, you need ${selected.length} ${supplyTokenName.toLowerCase()}`);
      return;
    }
    const success = await enterLaborGrounds(
      selected,
      Array(selected.length).fill(supplyId),
      Array(selected.length).fill(job.id),
    );
    if (success) {
    }
  };

  const eligibleSmols: NFTObject[] = useMemo(
    () => nfts?.filter((nft: NFTObject) => nft.commonSense < 100 && !nft.staked),
    [nfts],
  );

  return (
    <>
      {!eligibleSmols || eligibleSmols?.length === 0 ? (
        <p className="my-6 px-4 text-center">
          The Labor Ground is only open to Neandersmols with under 100 Common Sense.
        </p>
      ) : (
        <div>
          <p className="mx-auto max-w-2xl text-xs text-white">
            Jobs take 72 hours, your Neandersmol will be busy until the job is complete! Take an
            animal with you for better outcomes. Read more about job outcomes&nbsp;
            <a href={`${SMOL_AGE_PHASE2_GAME_GUIDE_LINK}`} target="_blank" className="underline">
              here
            </a>
          </p>
          <div className={`grid max-h-[35vh] grid-cols-2 gap-2 overflow-y-scroll xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-[${min(eligibleSmols.length, 5)}]`}>
            {eligibleSmols.map((nft: NFTObject) => {
              const isSelected = selected?.includes(nft.id);
              return (
                <button
                  key={nft.id.toString()}
                  className={cn(
                    isSelected ? 'border-smolBrownLight' : 'border-black',
                    'btn mx-auto mt-4',
                  )}
                  onClick={() => {
                    if (selected?.includes(nft.id)) {
                      setSelected(selected.filter((id) => id !== nft.id));
                    } else {
                      setSelected([...(selected ?? []), nft.id]);
                    }
                  }}
                >
                  <>
                    <Image
                      src={nft.image}
                      alt={`smol #${nft.id.toString()}`}
                      width={110}
                      height={110}
                      className="rounded-lg"
                    />
                    <div className="pt-2 text-center text-xs uppercase">#{nft.id}</div>
                  </>
                </button>
              );
            })}
          </div>

          <p className="mt-4 flex h-[20px] justify-center text-xs uppercase">
            {selected?.length > 0 && `${selected.length} selected`}
          </p>
          {selected?.length > 0 && (
            <button
              disabled={!selected || selected?.length === 0}
              onClick={() => {
                if (!supplyAllowance) approveSupply();
                else stake();
              }}
              className="flex mx-auto btn border-smolBrownLight bg-[#8a0303] px-5 py-3 text-xs uppercase rounded-xl"
            >
              {supplyAllowance ? `Start ${job.name}` : `Approve ${supplyTokenName}`}
            </button>
          )}
        </div>
      )}
    </>
  );
};
