import { Dialog, Transition, Listbox } from '@headlessui/react';
import Image from 'next/image';
import useListingModal from '@hooks/useListingModal';
import { useApproveERC721, useIsApprovedERC721 } from '@hooks/useApprove';
import { TokenType } from '@model/model';
import { Fragment, useState, useMemo, useContext } from 'react';
import {
  ANIMALS,
  CONSUMABLES,
  ARBITRUM,
  NFT_MARKET_PLACE,
  SMOL_AGE_ADDRESS,
  SMOL_AGE_BONES,
  SMOL_AGE_SMOL,
  MAGIC_ADDRESS,
} from '@config';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { BigNumber } from 'ethers';
import { cn } from '@utils';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Phase2Context } from '@context/phase2Context';
import { ListingParamsStruct } from '@typechain/NFTMarketPlace';

export const ListingModal = ({
  tokens,
  tokenType,
  balance,
}: {
  tokens: any[];
  tokenType: any;
  balance: any;
}) => {
  const initialState = 0;
  const initialPayType = 'Bones';
  const initialExpTime = 'Days';
  const [durationType, setDurationType] = useState<string>(initialExpTime);
  const durationTypes = ['Days', 'Months', 'Years'];
  const [payType, setPayType] = useState<string>(initialPayType);
  const payTypes = ['Bones', 'Smol', 'Magic'];

  const listingModal = useListingModal();
  const closeModal = () => listingModal.onClose();

  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
  const nftAddress = SMOL_AGE_ADDRESS[chainId];
  const animalNftAddress = ANIMALS[chainId];
  const consumableNftAddress = CONSUMABLES[chainId];
  const [quantity, setQuantity] = useState<number>(initialState);
  const [pricePerItem, setPricePerItem] = useState<number>(initialState);
  const [expirationTime, setExpirationTime] = useState<number>(initialState);

  const { address } = useAccount();
  const { data: isApproved } =
    tokenType == TokenType.Neander
      ? useIsApprovedERC721(nftAddress, address, NFT_MARKET_PLACE[chainId])
      : tokenType == TokenType.Animal
      ? useIsApprovedERC721(animalNftAddress, address, NFT_MARKET_PLACE[chainId])
      : useIsApprovedERC721(consumableNftAddress, address, NFT_MARKET_PLACE[chainId]);

  const { approve: approveSupply } =
    tokenType == TokenType.Neander
      ? useApproveERC721(nftAddress, NFT_MARKET_PLACE[chainId])
      : tokenType == TokenType.Animal
      ? useApproveERC721(animalNftAddress, NFT_MARKET_PLACE[chainId])
      : useApproveERC721(consumableNftAddress, NFT_MARKET_PLACE[chainId]);

  const paymentToken = useMemo(() => {
    return payType === 'Smol'
      ? SMOL_AGE_SMOL[chainId]
      : payType === 'Magic'
      ? MAGIC_ADDRESS[chainId]
      : SMOL_AGE_BONES[chainId];
  }, [payType, chainId]);

  const finalTime = useMemo(() => {
    const currentTime = Math.floor(new Date().getTime() / 1000);

    return durationType === 'Months'
      ? expirationTime * 86400 * 30 + currentTime
      : durationType === 'Years'
      ? expirationTime * 86400 * 365 + currentTime
      : expirationTime * 86400 + currentTime;
  }, [durationType, expirationTime]);

  const { createListing } = useContext(Phase2Context);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pricePerItem || !expirationTime || (tokenType != TokenType.Neander && !quantity)) {
      toast.warning('Please fill in all required fields.');
    } else {
      const myParams: ListingParamsStruct = {
        nftAddress:
          tokenType == TokenType.Neander
            ? nftAddress
            : tokenType == TokenType.Animal
            ? animalNftAddress
            : consumableNftAddress,
        tokenIds: [15],
        quantity: tokenType == TokenType.Neander ? 1 : quantity,
        price: BigNumber.from(pricePerItem).mul(BigNumber.from(10).pow(18)).toString(),
        expirationTime: BigNumber.from(finalTime).toString(),
        paymentToken: paymentToken,
      };

      if (!isApproved) {
        await approveSupply();
      }

      try {
        await createListing(myParams as any);

        setQuantity(initialState);
        setPricePerItem(initialState);
        setExpirationTime(initialState);
        setDurationType(initialExpTime);
        setPayType(initialPayType);
        closeModal();
      } catch (error) {
        toast('Something went wrong.');
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuantity(value);

    if (parseFloat(value) > balance) {
      toast.warning('Current quantity is not enough! Please recheck the balance.');
      setQuantity(initialState);
    }
  };

  return (
    <Transition appear show={listingModal.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
              <Dialog.Panel className="relative w-full max-w-md overflow-hidden rounded-lg border-8 border-smolBrown bg-smolBrownAlternative p-3 text-gray-200">
                <div className="mx-auto flex h-full flex-col justify-center p-2">
                  <h2 className="my-2 uppercase">Make a new Listing</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="my-3 grid grid-cols-5 gap-3">
                      {tokens.map((token, index) => {
                        return (
                          <div key={'listedToken_' + index} className="flex flex-col">
                            {tokenType == TokenType.Neander ? (
                              <p className="text-center text-[10px] uppercase">#{token.id}</p>
                            ) : (
                              <p className="text-center text-[10px] uppercase">{token.name}</p>
                            )}
                            <Image
                              src={token.image}
                              alt={`smol #${token.id.toString()}`}
                              width={70}
                              height={70}
                              className="rounded-lg"
                            />
                            {tokenType != TokenType.Neander && (
                              <div className="w-full text-left">
                                <span className="mt-6 text-[10px] uppercase">
                                  Balance: {balance}
                                </span>
                                {/* <span className="mt-6 text-[10px] uppercase">Balance: {balance_list}</span> */}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6">
                      <div className="relative mb-2 w-[100%]">
                        {tokenType != TokenType.Neander && (
                          <input
                            type="number"
                            value={quantity}
                            placeholder="Quantity"
                            className="h-[40px] w-full rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[8px] py-[10px] text-xs text-smolBrown shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]"
                            onChange={handleInputChange}
                          ></input>
                        )}
                      </div>

                      <div className="mt-2 flex gap-2">
                        <div className="grow">
                          <input
                            type="number"
                            value={pricePerItem}
                            placeholder="Price"
                            className="h-[40px] w-full rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[8px] py-[10px] text-xs text-smolBrown shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]"
                            onChange={(event) => {
                              setPricePerItem(Number(event.target.value));
                            }}
                          ></input>
                        </div>
                        <Listbox
                          value={payType}
                          onChange={(value) => {
                            setPayType(value);
                          }}
                        >
                          <div className="relative w-[160px]">
                            <Listbox.Button className="relative h-[40px] w-full rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[2px] text-xs text-smolBrown shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
                              <span className="block truncate pl-2 text-left">{payType}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <FaChevronDown className="h-5 w-5" aria-hidden="true" />
                              </span>
                            </Listbox.Button>
                            <Listbox.Options className="over-element-2 relative mt-1 max-h-60 w-[140px] overflow-auto rounded-lg bg-[#ffe3bd] py-1 text-left text-xs">
                              {payTypes.map((ptype) => (
                                <Listbox.Option
                                  key={ptype}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-1.5 pl-3 ${
                                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                  }
                                  value={ptype}
                                >
                                  {({ selected }) => (
                                    <span
                                      className={cn(
                                        selected ? 'font-medium' : 'font-normal',
                                        'block truncate',
                                      )}
                                    >
                                      {ptype}
                                    </span>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </Listbox>
                      </div>
                      <div className="mb-2 mt-2 flex gap-2">
                        <div className="grow">
                          <input
                            type="number"
                            value={expirationTime}
                            placeholder="Exp-Time"
                            className="h-[40px] w-full rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[8px] py-[10px] text-xs text-smolBrown shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]"
                            onChange={(event) => {
                              setExpirationTime(Number(event.target.value));
                            }}
                          ></input>
                        </div>
                        <Listbox
                          value={durationType}
                          onChange={(value) => {
                            setDurationType(value);
                          }}
                        >
                          <div className="relative w-[160px]">
                            <Listbox.Button className="relative h-[40px] w-full rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[2px] text-xs text-smolBrown shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
                              <span className="block truncate pl-2 text-left">{durationType}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <FaChevronDown className="h-5 w-5" aria-hidden="true" />
                              </span>
                            </Listbox.Button>
                            <Listbox.Options className="over-element-1 relative mt-1 max-h-60 w-[140px] overflow-auto rounded-lg bg-[#ffe3bd] py-1 text-left text-xs">
                              {durationTypes.map((type) => (
                                <Listbox.Option
                                  key={type}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-1.5 pl-3 ${
                                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                  }
                                  value={type}
                                >
                                  {({ selected }) => (
                                    <span
                                      className={cn(
                                        selected ? 'font-medium' : 'font-normal',
                                        'block truncate',
                                      )}
                                    >
                                      {type}
                                    </span>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </Listbox>
                      </div>
                      <div className="relative mb-2 w-[100%]">
                        <p className="div-contain text-left text-[10px] uppercase">
                          Payment Token: {paymentToken}
                        </p>
                      </div>
                    </div>

                    <button className="btn mx-auto mt-4 flex px-8 text-white" type="submit">
                      CREATE
                    </button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
