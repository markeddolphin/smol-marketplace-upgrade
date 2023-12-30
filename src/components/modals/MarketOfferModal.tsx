import { Dialog, Transition, Listbox } from '@headlessui/react';
import Image from 'next/image';
import useMarketOfferModal from '@hooks/useMarketOfferModal';
import useAcceptModal from '@hooks/useAcceptModal';
import useUpdateListModal from '@hooks/useUpdateListModal';
import useUpdateOfferModal from '@hooks/useUpdateOfferModal';
import { BidStatus, TokenType } from '@model/model';
import { Fragment, useState, useContext, useMemo } from 'react';
import { cn } from '@utils';
import { FaChevronDown } from 'react-icons/fa';
import { AcceptModal } from './AcceptModal';
import { UpdateListModal } from './UpdateListModal';
import { UpdateOfferModal } from './UpdateOfferModal';
import { useAccount, useNetwork } from 'wagmi';
import { Phase2Context } from '@context/phase2Context';
import {
  NFT_MARKET_PLACE,
  SMOL_AGE_ADDRESS,
  SMOL_AGE_BONES,
  MAGIC_ADDRESS,
  ANIMALS,
  CONSUMABLES,
  ARBITRUM,
  SMOL_AGE_SMOL,
} from '@config';
import { toast } from 'react-toastify';
import { BigNumber, BigNumberish } from 'ethers';
import {
  useApproveERC721,
  useApproveERC20,
  useAllowance,
} from '@hooks/useApprove';

export const MarketOfferModal = ({
  tokens,
  listStatus,
  manType,
  tokenType,
  clickedId,
  listIds,
  quantity,
  offerprice,
}: {
  tokens: any[];
  listStatus: any;
  manType: string;
  tokenType: any;
  clickedId: any;
  listIds: any;
  quantity: any;
  offerprice: any;
}) => {
  const { offers } = useContext(Phase2Context);

  const finalOffers = offers.filter((item) => item.listingId === clickedId);

  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;

  const marketOfferModal = useMarketOfferModal();

  const closeModal = () => marketOfferModal.onClose();
  const truncateString = (str, maxLength) => {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  };

  const acceptModal = useAcceptModal();
  const updateListModal = useUpdateListModal();
  const updateOfferModal = useUpdateOfferModal();
  const { address } = useAccount();
  const { createTokenBidForListing, cancelTokenBidForListing } = useContext(Phase2Context);

  const initialState = 0;
  const initialPayType = 'Bones';
  const initialExpTime = 'Days';
  const [offerPrice, setOfferPrice] = useState<number>(initialState);
  const [expirationOfferTime, setExpirationOfferTime] = useState<number>(initialState);
  const [durationOfferType, setDurationOfferType] = useState<string>(initialExpTime);
  const durationOfferTypes = ['Days', 'Months', 'Years'];
  const [payOfferType, setPayOfferType] = useState<string>(initialPayType);
  const payOfferTypes = ['Bones', 'Smol', 'Magic'];
  // const { chain } = useNetwork();
  // const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
  const nftAddress = SMOL_AGE_ADDRESS[chainId];
  const animalNftAddress = ANIMALS[chainId];
  const consumableNftAddress = CONSUMABLES[chainId];

  // const { data: isApproved } = useIsApprovedERC721(nftAddress, address, NFT_MARKET_PLACE[chainId]);
  const { approve: approveSupply } = useApproveERC721(nftAddress, NFT_MARKET_PLACE[chainId]);

  const paymentOfferToken = useMemo(() => {
    return payOfferType === 'Smol'
      ? SMOL_AGE_SMOL[chainId]
      : payOfferType === 'Magic'
      ? MAGIC_ADDRESS[chainId]
      : SMOL_AGE_BONES[chainId];
  }, [payOfferType, chainId]);

  const finalOfferTime = useMemo(() => {
    const currentTime = Math.floor(new Date().getTime() / 1000);

    return durationOfferType === 'Months'
      ? expirationOfferTime * 86400 * 30 + currentTime
      : durationOfferType === 'Years'
      ? expirationOfferTime * 86400 * 365 + currentTime
      : expirationOfferTime * 86400 + currentTime;
  }, [durationOfferType, expirationOfferTime]);

  const { approve: approveOfferSupply } = useApproveERC20(
    paymentOfferToken,
    NFT_MARKET_PLACE[chainId],
    BigNumber.from(offerPrice).mul(BigNumber.from(10).pow(18)),
  );
  const { data: allowance } = useAllowance(paymentOfferToken, address, NFT_MARKET_PLACE[chainId]);

  const handleCreateOffer = async () => {
    try {
      if (!offerPrice || !expirationOfferTime) {
        toast.warning('Please fill in all required fields.');
      } else {
        if (allowance.lt(BigNumber.from(offerPrice).mul(BigNumber.from(10).pow(18)))) {
          await approveOfferSupply();
        }

        await createTokenBidForListing(
          BigNumber.from(offerPrice).mul(BigNumber.from(10).pow(18)).toString(),
          BigNumber.from(finalOfferTime).toString(),
          paymentOfferToken,
          clickedId,
        );
        setOfferPrice(initialState);
        setExpirationOfferTime(initialState);
        setDurationOfferType(initialExpTime);
        setPayOfferType(initialPayType);
        closeModal();
      }
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  const handleRemoveOffer = async () => {
    try {
      await cancelTokenBidForListing(clickedId);
      closeModal();
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  const [acceptBidder, setAcceptBidder] = useState('');
  const [acceptListingId, setAcceptListingId] = useState('');
  const [acceptNftAddress, setAcceptNftAddress] = useState('');
  const [acceptQuantity, setAcceptQuantity] = useState('');
  const [acceptTokenId, setAcceptTokenId] = useState('');

  const handleSelectOffer = (
    selBidder: any,
    selListingId: any,
    selNftAddress: any,
    selQuantity: any,
    selTokenId: any,
  ) => {
    setAcceptBidder(selBidder);
    setAcceptListingId(selListingId);
    setAcceptNftAddress(selNftAddress);
    setAcceptQuantity(selQuantity);
    setAcceptTokenId(selTokenId);
    acceptModal.onOpen();
  };

  const handleUpdateList = () => {
    updateListModal.onOpen();
  };

  const handleUpdateOffer = () => {
    updateOfferModal.onOpen();
  };

  return (
    <Transition appear show={marketOfferModal.isOpen} as={Fragment}>
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
            <AcceptModal
              bidder={acceptBidder}
              nftaddress={acceptNftAddress}
              quantity={acceptQuantity}
              tokenId={acceptTokenId}
              listingId={acceptListingId}
            />
            <UpdateListModal
              tokens={tokens}
              tokenType={tokenType}
              listId={clickedId}
              listIds={listIds}
            />
            <UpdateOfferModal
              tokens={tokens}
              tokenType={tokenType}
              offers={offers}
              listId={clickedId}
              listIds={listIds}
            />
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
                  {address != undefined && manType == address.toLowerCase() ? (
                    <h2 className="my-2 uppercase">Offers to accept</h2>
                  ) : listStatus == BidStatus.Opened ? (
                    <h2 className="my-2 uppercase">Make an offer</h2>
                  ) : (
                    <h2 className="my-2 uppercase">Your offer</h2>
                  )}
                  <div>
                    <div className="my-3 grid grid-cols-5 gap-3">
                      {tokenType == TokenType.Neander
                        ? tokens.map(
                            (token, index) =>
                              listIds != null &&
                              listIds.includes(token.id) && (
                                <div className="flex flex-col" key={'tokenImg__' + index}>
                                  {tokenType != TokenType.Neander ? (
                                    <p className="text-center text-[10px] uppercase">
                                      {token.name}
                                    </p>
                                  ) : (
                                    <p className="text-center text-[10px] uppercase">
                                      #{token.id.toString()}
                                    </p>
                                  )}
                                  <Image
                                    src={token.image}
                                    alt={`smol #${token.id.toString()}`}
                                    width={70}
                                    height={70}
                                    className="rounded-lg"
                                  />
                                </div>
                              ),
                          )
                        : tokens.map(
                            (token, index) =>
                              listIds != null &&
                              listIds.includes(BigNumber.from(token.id).toString()) && (
                                <div className="flex flex-col" key={'tokenImg__' + index}>
                                  {tokenType != TokenType.Neander ? (
                                    <p className="text-center text-[10px] uppercase">
                                      {token.name}
                                    </p>
                                  ) : (
                                    <p className="text-center text-[10px] uppercase">
                                      #{token.id.toString()}
                                    </p>
                                  )}
                                  <Image
                                    src={token.image}
                                    alt={`animal #${token.id.toString()}`}
                                    width={70}
                                    height={70}
                                    className="rounded-lg"
                                  />
                                </div>
                              ),
                          )}
                    </div>
                    {tokenType != TokenType.Neander && (
                      <div className="mt-4 flex flex-col gap-2">
                        <div className="flex">
                          <p className="text-xs">Listed Count: {quantity}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex">
                      <p className="text-xs">Offer Price: {offerprice}</p>
                    </div>
                  </div>
                  {address != undefined && manType == address.toLowerCase() ? (
                    <>
                      <div className="table-border-line mt-4 h-[40vh] overflow-auto">
                        <table className="w-full overflow-auto p-4">
                          <thead className="sticky top-0 py-2 text-xs text-black">
                            <tr className="py-2">
                              <th className="py-3.5 pl-4 pr-3 text-center text-xs sm:pl-6">
                                Bidder
                              </th>
                              <th className="px-3 py-3.5 text-center text-xs">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {finalOffers.map(
                              (offer, index) =>
                                offer.status == BidStatus.Opened &&
                                offer.listingId == clickedId && (
                                  <tr
                                    className="offer-remove-bt"
                                    onClick={() => {
                                      handleSelectOffer(
                                        offer.bidder,
                                        offer.listingId,
                                        offer.nftAddress,
                                        offer.quantity,
                                        BigNumber.from(offer.tokenId)
                                          .mul(BigNumber.from(10).pow(18))
                                          .toString(),
                                      );
                                    }}
                                    key={'offer___' + index}
                                  >
                                    <td className="flex flex-col items-center justify-center whitespace-nowrap py-2 text-xs">
                                      {truncateString(offer.bidder, 20)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2 text-center text-xs">
                                      {BigNumber.from(offer.tokenId)
                                        .div(BigNumber.from(10).pow(18))
                                        .toString()}
                                    </td>
                                  </tr>
                                ),
                            )}
                          </tbody>
                        </table>
                      </div>
                      <button
                        className="btn mx-auto mt-4 flex px-8 text-white"
                        onClick={() => {
                          handleUpdateList();
                        }}
                      >
                        UPDATE LISTING
                      </button>
                    </>
                  ) : finalOffers.findIndex((offer) => offer.bidder == address) < 0 ? (
                    <>
                      <div className="mt-6 flex gap-2">
                        <div className="grow">
                          <input
                            type="number"
                            placeholder="Offer Price"
                            className="h-[40px] w-full rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[8px] py-[10px] text-xs text-smolBrown shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]"
                            value={offerPrice}
                            onChange={(event) => {
                              setOfferPrice(Number(event.target.value));
                            }}
                          ></input>
                        </div>
                        <Listbox
                          value={payOfferType}
                          onChange={(value) => {
                            setPayOfferType(value);
                          }}
                        >
                          <div className="relative w-[160px]">
                            <Listbox.Button className="relative h-[40px] w-full rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[2px] text-xs text-smolBrown shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
                              <span className="block truncate pl-2 text-left">{payOfferType}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <FaChevronDown className="h-5 w-5" aria-hidden="true" />
                              </span>
                            </Listbox.Button>
                            <Listbox.Options className="over-element-2 relative mt-1 max-h-60 w-[140px] overflow-auto rounded-lg bg-[#ffe3bd] py-1 text-left text-xs">
                              {payOfferTypes.map((ptype) => (
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
                        {/* <p className="py-1 pl-2 text-left text-xs">Available 10,000 $BONES</p> */}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <div className="grow">
                          <input
                            type="number"
                            placeholder="Duration"
                            className="h-[40px] w-full rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[8px] py-[10px] text-xs text-smolBrown shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]"
                            value={expirationOfferTime}
                            onChange={(event) => {
                              setExpirationOfferTime(Number(event.target.value));
                            }}
                          ></input>
                        </div>
                        <Listbox
                          value={durationOfferType}
                          onChange={(value) => {
                            setDurationOfferType(value);
                          }}
                        >
                          <div className="relative w-[160px]">
                            <Listbox.Button className="relative h-[40px] w-full rounded-lg border-4 border-smolBrown bg-[#ffe3bd] px-[2px] text-xs text-smolBrown shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
                              <span className="block truncate pl-2 text-left">
                                {durationOfferType}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <FaChevronDown className="h-5 w-5" aria-hidden="true" />
                              </span>
                            </Listbox.Button>
                            <Listbox.Options className="relative mt-1 max-h-60 w-[140px] overflow-auto rounded-lg bg-[#ffe3bd] py-1 text-left text-xs ">
                              {durationOfferTypes.map((type) => (
                                <Listbox.Option
                                  key={'duration____' + type}
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
                      <button
                        className="btn mx-auto mt-4 flex px-8 text-white"
                        onClick={() => {
                          handleCreateOffer();
                        }}
                      >
                        CREATE OFFER
                      </button>
                    </>
                  ) : (
                    <>
                      {finalOffers.map(
                        (offer, index) =>
                          offer.bidder == address && (
                            <>
                              <div className="mt-6">
                                <div className="relative w-[100%]">
                                  <p className="py-1/2 absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-smolBrown">
                                    {BigNumber.from(offer.tokenId)
                                      .div(BigNumber.from(10).pow(18))
                                      .toString()
                                      .concat(
                                        offer.paymentToken.toString() === SMOL_AGE_SMOL[chainId]
                                          ? ' Smol'
                                          : offer.paymentToken.toString() === MAGIC_ADDRESS[chainId]
                                          ? ' Magic'
                                          : ' Bones',
                                      )}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-6">
                                <div className="relative w-[100%]">
                                  <p className="py-1/2 absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-smolBrown">
                                    {BigNumber.from(offer.expirationTime)
                                      .sub(Math.floor(new Date().getTime() / 1000))
                                      .div(86400)
                                      .toString()}{' '}
                                    Days
                                  </p>
                                </div>
                              </div>
                            </>
                          ),
                      )}
                      <div className="mt-4 flex">
                        <button
                          className="btn mx-auto mt-4 flex text-white"
                          onClick={() => {
                            handleUpdateOffer();
                          }}
                        >
                          UPDATE OFFER
                        </button>
                        <button
                          className="btn mx-auto mt-4 flex text-white"
                          onClick={() => {
                            handleRemoveOffer();
                          }}
                        >
                          REMOVE OFFER
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
