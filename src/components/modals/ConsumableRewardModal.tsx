import { Dialog, Transition } from '@headlessui/react';
import { Phase2Context } from '@context/phase2Context';
import { Fragment, useState, useEffect, useContext } from 'react';
import { BigNumber, Contract, constants } from 'ethers';
import { consumables } from '@components/phase2/labor-grounds/MyStakes';
import { ConsumableType, Tool } from '@model/model';
import Image from 'next/image';
import Link from 'next/link';
import { ARBITRUM, CONSUMABLES, SHOP } from '@config';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { ERC1155__factory } from '@typechain';

export const ConsumableRewardModal = ({
  claimingTxSucceed,
  supplyToken,
}: {
  claimingTxSucceed: any;
  supplyToken: Tool;
}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signerData } = useSigner();

  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;

  const { stakedSmolsInLaborGrounds } = useContext(Phase2Context);

  const [open, setOpen] = useState<boolean>(false);
  const [commonRewards, setCommonRewards] = useState<number>(0);
  const [rareRewards, setRareRewards] = useState<number>(0);
  const [brokenTools, setBrokenTools] = useState<number>(0);
  const [prevConsumableBalances, setPrevConsumableBalances] = useState<BigNumber[]>([]);
  const [prevSupplyBalance, setPrevSupplyBalance] = useState<BigNumber>(constants.MaxUint256);
  const [prevStakedTokenBalance, setPrevStakedTokenBalance] = useState<BigNumber>(
    constants.MaxInt256,
  );

  const getConsumableBalances = async () => {
    const contract = new Contract(CONSUMABLES[chainId], ERC1155__factory.abi, signerData);
    const balances = await contract.balanceOfBatch(
      Array(consumables.length).fill(address),
      consumables.map((consumable) => consumable.id),
    );
    return balances;
  };

  const getSupplyBalance = async () => {
    const contract = new Contract(SHOP[chainId], ERC1155__factory.abi, signerData);
    const balance = await contract.balanceOf(address, supplyToken.tokenId);
    return balance;
  };

  const getStakedTokenBalance = async () => {
    const stakedTokens = await stakedSmolsInLaborGrounds(address);
    const balance = BigNumber.from(
      stakedTokens.filter((token) => token.tokenId.eq(supplyToken.tokenId)).length,
    );
    return balance;
  };

  useEffect(() => {
    (async () => {
      const consumableBalances = await getConsumableBalances();
      const supplyBalance = await getSupplyBalance();
      const stakedTokenBalance = await getStakedTokenBalance();

      if (claimingTxSucceed.value) setOpen(true);

      if (prevConsumableBalances.length != 0) {
        const diffBalances = consumableBalances.map((value, index) =>
          value.sub(prevConsumableBalances[index]),
        );
        if (diffBalances.find((value) => !value.eq(0))) {
          const nonZeroVals = diffBalances
            .map((value, index) => ({ value, index }))
            .filter((x) => !x.value.eq(0));
          setCommonRewards(
            nonZeroVals
              .filter(
                (x) =>
                  consumables.find((token) => token.id.eq(x.index + 1)).type ==
                  ConsumableType.Common,
              )
              .reduce((sum, x) => sum.add(x.value), BigNumber.from(0))
              .toNumber(),
          );
          setRareRewards(
            nonZeroVals
              .filter(
                (x) =>
                  consumables.find((token) => token.id.eq(x.index + 1)).type == ConsumableType.Rare,
              )
              .reduce((sum, x) => sum.add(x.value), BigNumber.from(0))
              .toNumber(),
          );
        } else {
          setCommonRewards(0);
          setRareRewards(0);
        }
      }
      setPrevConsumableBalances([...consumableBalances]);

      if (!prevSupplyBalance.eq(constants.MaxUint256) && !prevStakedTokenBalance.eq(constants.MaxUint256)) {
        const diffSupplyBalance = supplyBalance.sub(prevSupplyBalance);
        const diffStakedTokenBalance = prevStakedTokenBalance.sub(stakedTokenBalance);
        setBrokenTools(diffStakedTokenBalance.sub(diffSupplyBalance).toNumber());
      }
      setPrevSupplyBalance(supplyBalance);
      setPrevStakedTokenBalance(stakedTokenBalance);
    })();
  }, [claimingTxSucceed]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md overflow-hidden border-8 border-smolBrown bg-smolBrownAlternative p-3 text-gray-200">
                <div className="mx-auto flex h-full w-fit flex-col justify-center p-2">
                  {commonRewards + rareRewards > 0 ? (
                    <>
                      <h2 className="mt-2 uppercase">
                        You Gathered:
                        <br />
                        {commonRewards > 0 && (
                          <>
                            <span className="text-black">{commonRewards}</span>
                            {` common consumable(s)`}
                            <br />
                          </>
                        )}
                        {rareRewards > 0 && (
                          <>
                            <span className="text-black">{rareRewards}</span>
                            {` rare consumable(s)`}
                            <br />
                          </>
                        )}
                      </h2>
                      <br />
                      <h2 className="my-4 uppercase">Your tools are still in tact!</h2>
                      <div className="flex justify-center gap-6">
                        {commonRewards > 0 && (
                          <Image
                            src={`/static/images/consumable/common_consumable.png`}
                            alt={`common consumable`}
                            width={100}
                            height={100}
                            className="shadow-[0_0px_8px_1px_rgba(0,0,0,0.8)]"
                          />
                        )}
                        {rareRewards > 0 && (
                          <Image
                            src={`/static/images/consumable/rare_consumable.png`}
                            alt={`rare consumable`}
                            width={100}
                            height={100}
                            className="shadow-[0_0px_8px_1px_rgba(0,0,0,0.8)]"
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="mt-2 uppercase">You weren't able to find any consumables!</h2>
                      <br />
                      {brokenTools > 0 ? (
                        <>
                          <h2 className="my-4 uppercase">
                            <span className="text-black">{brokenTools}</span> of your&nbsp;
                            {supplyToken.name} was broken on the job! Get a new tool&nbsp;
                            <Link href="/phase2/shop" className="underline">
                              here
                            </Link>
                          </h2>
                          <div className="flex justify-center">
                            <Image
                              src={`/static/images/consumable/broken_tool.png`}
                              alt={`broken tool`}
                              width={100}
                              height={100}
                              className="shadow-[0_0px_8px_1px_rgba(0,0,0,0.8)]"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <h2 className="my-4 uppercase">Your tools are still in tact!</h2>
                          <div className="flex justify-center">
                            <Image
                              src={`/static/images/consumable/nothing_failed.png`}
                              alt={`nothing failed`}
                              width={100}
                              height={100}
                              className="shadow-[0_0px_8px_1px_rgba(0,0,0,0.8)]"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                  <button className="btn mx-auto mt-4 flex px-8 text-white" onClick={handleClose}>
                    OK
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
