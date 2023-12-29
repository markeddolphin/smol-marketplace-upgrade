import { Dialog, Transition, Listbox } from '@headlessui/react';
import Image from 'next/image';
import useListingModal from '@hooks/useListingModal';
import useUpdateOfferModal from '@hooks/useUpdateOfferModal';
import {
  useApproveERC721,
  useIsApprovedERC721,
  useApproveERC20,
  useAllowance,
} from '@hooks/useApprove';
import { NFTObject, TokenType } from '@model/model';
import { Fragment, useState, useEffect, useMemo, useContext } from 'react';
import {
  ANIMALS,
  ARBITRUM,
  NFT_MARKET_PLACE,
  SMOL_AGE_ADDRESS,
  SMOL_AGE_BONES,
  SMOL_AGE_SMOL,
  MAGIC_ADDRESS,
} from '@config';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { Contract, BigNumber } from 'ethers';
import { cn } from '@utils';
import { FaChevronDown } from 'react-icons/fa';
import { animals, consumables } from '@components/phase2/labor-grounds/MyStakes';
import { useBalanceERC1155, useBalanceERC20, useBalancesERC1155 } from '@hooks/useBalance';
import { toast } from 'react-toastify';
import { Phase2Context } from '@context/phase2Context';
import { execPath } from 'process';
import { ListingParamsStruct, ListingParamsStructOutput } from '@typechain/NFTMarketPlace';

export const UpdateOfferModal = ({
  tokens,
  tokenType,
  offers,
  listId,
  listIds,
}: {
  tokens: any[];
  tokenType: any;
  offers: any[];
  listId: any;
  listIds: any[];
}) => {
  const { address } = useAccount();
  const { listings, updateListing } = useContext(Phase2Context);
  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;

  const temp = offers.filter((offer) => offer.bidder == address)[0];

  const initial =
    temp == null
      ? {
          price: 0,
          expTime: 0,
          quantity: 0,
          payType: 'Bones',
          durationType: 'Days',
        }
      : {
          price: BigNumber.from(temp.tokenId).div(BigNumber.from(10).pow(18)).toString(),
          expTime:
            BigNumber.from(temp.expirationTime).toNumber() >
            BigNumber.from(Math.floor(new Date().getTime() / 1000)).toNumber()
              ? BigNumber.from(temp.expirationTime)
                  .sub(Math.floor(new Date().getTime() / 1000))
                  .div(86400)
                  .toString()
              : 0,
          quantity: tokenType == TokenType.Neander ? 1 : temp.quantity,
          payType:
            temp.paymentToken === SMOL_AGE_SMOL[chainId]
              ? 'Smol'
              : temp.paymentToken === MAGIC_ADDRESS[chainId]
              ? 'Magic'
              : 'Bones',
          durationType: 'Days',
        };

  const [durationType, setDurationType] = useState<string>(initial.durationType);
  const durationTypes = ['Days', 'Months', 'Years'];
  const [payType, setPayType] = useState<string>(initial.payType);
  const payTypes = ['Bones', 'Smol', 'Magic'];

  const updateOfferModal = useUpdateOfferModal();
  const closeModal = () => updateOfferModal.onClose();

  const { data: signerData } = useSigner();
  const nftAddress = SMOL_AGE_ADDRESS[chainId];
  const [quantity, setQuantity] = useState<number>(initial.quantity);
  const [pricePerItem, setPricePerItem] = useState<number>(
    BigNumber.from(initial.price).toNumber(),
  );
  const [expirationTime, setExpirationTime] = useState<number>(Number(initial.expTime));

  const { data: isApproved } = useIsApprovedERC721(nftAddress, address, NFT_MARKET_PLACE[chainId]);
  const { approve: approveSupply } = useApproveERC721(nftAddress, NFT_MARKET_PLACE[chainId]);

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
  }, [durationType]);

  const { createTokenBidForListing } = useContext(Phase2Context);

  const [message, setMessage] = useState('');
  const { approve: approveOfferSupply } = useApproveERC20(
    paymentToken,
    NFT_MARKET_PLACE[chainId],
    BigNumber.from(pricePerItem).mul(BigNumber.from(10).pow(18)),
  );
  const { data: allowance } = useAllowance(paymentToken, address, NFT_MARKET_PLACE[chainId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pricePerItem || !expirationTime || (tokenType != TokenType.Neander && !quantity)) {
      toast.warning('Please fill in all required fields.');
    } else {
      if (allowance.lt(BigNumber.from(pricePerItem).mul(BigNumber.from(10).pow(18)))) {
        await approveOfferSupply();
      }
      await createTokenBidForListing(
        BigNumber.from(pricePerItem).mul(BigNumber.from(10).pow(18)).toString(),
        finalTime.toString(),
        paymentToken,
        listId,
      );
    }
    closeModal();
  };

  const {
    data: animalBalances,
    isRefetching: isRefetchingAnimal,
    refetch: refetchAnimalBalances,
  } = useBalancesERC1155(
    ANIMALS[chainId],
    Array(animals.length).fill(address),
    animals.map((animal) => animal.id),
  );

  const balance_list = 50;
  const [showWarning, setShowWarning] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuantity(value);

    if (parseFloat(value) > balance_list) {
      toast.warning('Current quantity is not enough! Please recheck the balance.');
      setQuantity(initial.quantity);
    }
  };

  return (
    <Transition appear show={updateOfferModal.isOpen} as={Fragment}>
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
                  <h2 className="my-2 uppercase">Update Offer</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="my-3 grid grid-cols-5 gap-3">
                      {tokens
                        .filter((token) => listIds.includes(token.id))
                        .map((token, key) => (
                          <div className="flex flex-col" key={key}>
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
                          </div>
                        ))}
                    </div>
                    {tokenType != TokenType.Neander && (
                      <div className="w-full text-left">
                        {/* <span className="text-[10px] uppercase mt-6">Balance: {animalBalances[key].toString()}</span> */}
                        <span className="mt-6 text-[10px] uppercase">Balance: {balance_list}</span>
                      </div>
                    )}

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
                      UPDATE
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
