import {
  ANIMALS,
  ARBITRUM,
  CONSUMABLES,
  MAGIC_ADDRESS,
  SHOP,
  SMOL_AGE_BONES,
  SMOL_AGE_TREASURE,
} from '@config';
import { Dialog, Transition } from '@headlessui/react';
import { useBalanceERC1155, useBalanceERC20, useBalancesERC1155 } from '@hooks/useBalance';
import useInventoryBox from '@hooks/useInventoryBox';
import { Fragment, useMemo } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { animals, consumables } from '@components/phase2/labor-grounds/MyStakes';
import { tools } from '@components/phase2/shop/Shop';
import { BigNumber, ethers } from 'ethers';
import Image from 'next/image';

export const InventoryBox = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;

  const inventoryBox = useInventoryBox();
  const closeWindow = () => inventoryBox.onClose();

  const {
    data: animalBalances,
    isRefetching: isRefetchingAnimal,
    refetch: refetchAnimalBalances,
  } = useBalancesERC1155(
    ANIMALS[chainId],
    Array(animals.length).fill(address),
    animals.map((animal) => animal.id),
  );
  const {
    data: consumableBalances,
    isRefetching: isRefetchingConsumable,
    refetch: refetchConsumableBalances,
  } = useBalancesERC1155(
    CONSUMABLES[chainId],
    Array(consumables.length).fill(address),
    consumables.map((consumable) => consumable.id),
  );
  const {
    data: supplyBalances,
    isRefetching: isRefetchingSupply,
    refetch: refetchSupplyBalances,
  } = useBalancesERC1155(
    SHOP[chainId],
    Array(tools.length).fill(address),
    tools.map((tool) => tool.tokenId),
  );
  const {
    data: magicBalance,
    isRefetching: isRefetchingMagic,
    refetch: refetchMagicBalance,
  } = useBalanceERC20(MAGIC_ADDRESS[chainId], address);
  const {
    data: bonesBalance,
    isRefetching: isRefetchingBones,
    refetch: refetchBonesBalance,
  } = useBalanceERC20(SMOL_AGE_BONES[chainId], address);
  const {
    data: moonrocksBalance,
    isRefetching: isRefetchingMoonrocks,
    refetch: refetchMoonRocksBalance,
  } = useBalanceERC1155(SMOL_AGE_TREASURE[chainId], address, BigNumber.from(1));

  const refetchAll = async () => {
    refetchAnimalBalances();
    refetchConsumableBalances();
    refetchSupplyBalances();
    refetchMagicBalance();
    refetchBonesBalance();
    refetchMoonRocksBalance();
  };

  const isRefetching = useMemo(
    () =>
      isRefetchingAnimal &&
      isRefetchingBones &&
      isRefetchingConsumable &&
      isRefetchingMagic &&
      isRefetchingSupply &&
      isRefetchingMoonrocks,
    [
      isRefetchingAnimal,
      isRefetchingBones,
      isRefetchingConsumable,
      isRefetchingMagic,
      isRefetchingSupply,
      isRefetchingMoonrocks,
    ],
  );

  return (
    <Transition appear show={inventoryBox.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeWindow}>
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
              <Dialog.Panel className="relative w-full max-w-[600px] overflow-hidden rounded-lg border-8 border-smolBrown bg-smolBrownAlternative px-7 pt-7 pb-10 text-gray-200">
                <div className="mx-auto flex h-full w-fit flex-col justify-center p-2">
                  <div className="m-auto">
                    <h2 className="my-2 ml-[30px] flex items-center gap-2 uppercase">
                      Inventory
                      <Image
                        src="/static/images/refreshIcon.png"
                        className={`${isRefetching ? 'animate-spin' : 'cursor-pointer'} `}
                        width={30}
                        height={30}
                        alt="refresh"
                        onClick={refetchAll}
                      />
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-3 pt-[20px] xxs:grid-cols-2 xxs:gap-6 xs:grid-cols-3">
                    <div className="flex h-[40px] w-full justify-between rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[8px] py-[10px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] xxs:w-[150px]">
                      <Image
                        src="/static/images/tokens/magic.webp"
                        width={28}
                        height={28}
                        alt="magic_token"
                        className="-my-[8px] -ml-[20px] rounded-full"
                      />
                      <p className="text-xs text-smolBrown">
                        {Number(ethers.utils.formatUnits(magicBalance ?? 0)).toFixed(0)}
                      </p>
                    </div>
                    <div className="flex h-[40px] w-full justify-between rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[8px] py-[10px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] xxs:w-[150px]">
                      <Image
                        src="/static/images/tokens/bones.png"
                        width={30}
                        height={30}
                        alt="magic_token"
                        className="-my-[9px] -ml-[20px] rounded-full"
                      />
                      <p className="text-xs text-smolBrown">
                        {Number(ethers.utils.formatUnits(bonesBalance ?? 0)).toFixed(0)}
                      </p>
                    </div>
                    <div className="flex h-[40px] w-full justify-between rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[8px] py-[10px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] xxs:w-[150px]">
                      <Image
                        src="/static/images/tokens/moonrocks.png"
                        width={28}
                        height={28}
                        alt="magic_token"
                        className="-my-[8px] -ml-[20px] rounded-full"
                      />
                      <p className="text-xs text-smolBrown">{moonrocksBalance?.toNumber() ?? 0}</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 pt-[40px]">
                    <div className="grid grid-cols-1 gap-10 xs:grid-cols-3 xs:gap-6">
                      <div>
                        <p className="text-sm">Animals</p>
                        <div className="grid grid-cols-3 gap-6 px-3 pt-[15px] xs:grid-cols-2 xs:gap-4">
                          {animalBalances &&
                            animals.map((token, index) => (
                              <div
                                className="relative flex flex-col items-center"
                                key={JSON.stringify({ ...token, balance: animalBalances[index] })}
                              >
                                <Image
                                  src={token.image}
                                  height={50}
                                  width={50}
                                  alt={token.name}
                                  className="aspect-square border-4 border-smolBrownLight"
                                />
                                <span className="absolute -bottom-[6px] -right-[3px] mt-2 text-sm xs:-right-[1px]">
                                  {animalBalances[index]?.toNumber() ?? 0}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">Consumables</p>
                        <div className="grid grid-cols-3 gap-6 px-3 pt-[15px] xs:grid-cols-2 xs:gap-4">
                          {consumableBalances &&
                            consumables.map((token, index) => (
                              <div
                                className="relative flex flex-col items-center"
                                key={JSON.stringify({
                                  ...token,
                                  balance: consumableBalances[index],
                                })}
                              >
                                <Image
                                  src={token.image}
                                  height={50}
                                  width={50}
                                  alt={token.name}
                                  className="aspect-square border-4 border-smolBrownLight"
                                />
                                <span className="absolute -bottom-[6px] -right-[3px] mt-2 text-sm xs:-right-[1px]">
                                  {consumableBalances[index]?.toNumber() ?? 0}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">Tools</p>
                        <div className="grid grid-cols-3 gap-6 px-3    pt-[15px] xs:grid-cols-2 xs:gap-4">
                          {supplyBalances &&
                            tools.map((tool, index) => (
                              <div
                                className="relative flex flex-col items-center"
                                key={JSON.stringify({ ...tool, balance: supplyBalances[index] })}
                              >
                                <Image
                                  src={tool.image}
                                  height={50}
                                  width={50}
                                  alt={tool.name}
                                  className="aspect-square border-4 border-smolBrownLight"
                                />
                                <span className="absolute -bottom-[6px] -right-[3px] mt-2 text-sm xs:-right-[1px]">
                                  {supplyBalances[index]?.toNumber() ?? 0}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="absolute right-[0px] -top-[6px] flex rounded-full p-2 text-lg text-white"
                    onClick={closeWindow}
                  >
                    x
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
