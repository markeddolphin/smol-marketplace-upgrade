import { Dialog, Transition, Listbox } from '@headlessui/react';
import Image from 'next/image';
import useAcceptModal from '@hooks/useAcceptModal';
import useMarketOfferModal from '@hooks/useMarketOfferModal';
import { NFTObject } from '@model/model';
import { Fragment, useState, useEffect, useMemo, useContext } from 'react';
import {
  ARBITRUM,
  NFT_MARKET_PLACE,
  SMOL_AGE_ADDRESS,
  SMOL_AGE_BONES,
  SMOL_AGE_SMOL,
  MAGIC_ADDRESS,
} from '@config';
import { useNetwork, useSigner } from 'wagmi';
import { Contract } from 'ethers';
import { cn } from '@utils';
import { FaChevronDown } from 'react-icons/fa';
import { Phase2Context } from '@context/phase2Context';
import {
  ListingParamsStruct,
  ListingParamsStructOutput,
  AcceptBidParamsStruct,
  
} from '@typechain/NFTMarketPlace';

export const AcceptModal = ({
  bidder,
  nftaddress,
  quantity,
  tokenId,
  listingId,
}: {
  bidder: any;
  nftaddress: any;
  quantity: any;
  tokenId: any;
  listingId: any;
}) => {
  const acceptModal = useAcceptModal();
  const marketModal = useMarketOfferModal();

  const { acceptTokenBidForListing } = useContext(Phase2Context);
  const handleAccept = () => {
    const myParams: AcceptBidParamsStruct = {
      bidder: bidder,
      nftAddress: nftaddress,
      quantity: quantity,
      tokenId: tokenId,
      listingId: listingId,
    };

    acceptTokenBidForListing(myParams as any);

    acceptModal.onClose();
    marketModal.onClose();
  };

  const closeAcceptModal = () => acceptModal.onClose();

  return (
    <Transition appear show={acceptModal.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeAcceptModal}>
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
              <Dialog.Panel className="relative max-w-md overflow-hidden rounded-lg border-8 border-smolBrown bg-smolBrownAlternative p-3 text-gray-200">
                <div className="mx-auto flex h-full flex-col justify-center p-2">
                  <h2 className="my-2 uppercase">Do you really want to accept this offer?</h2>
                  <button className="btn mx-auto mt-4 flex px-8 text-white" onClick={handleAccept}>
                    Accept
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
