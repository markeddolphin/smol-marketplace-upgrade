import {
  ANIMALS,
  ARBITRUM,
  CONSUMABLES,
  SMOL_AGE_ADDRESS,
  SMOL_AGE_BONES,
  NFT_MARKET_PLACE,
} from '@config';
import { BigNumber, Contract } from 'ethers';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@utils';
import { NFTObject } from '@model/model';
import { Phase2Context } from '@context/phase2Context';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { useContext, useState, useEffect } from 'react';
import useMarketOfferModal from '@hooks/useMarketOfferModal';
import useListingModal from '@hooks/useListingModal';
import { MarketOfferModal } from '@components/modals/MarketOfferModal';
import { ListingModal } from '@components/modals/ListingModal';
import { NeanderSmol__factory } from '@typechain';
import { toast } from 'react-toastify';
import { BuyItemParamsStruct } from '@typechain/NFTMarketPlace';
import { useApproveERC20, useAllowance } from '@hooks/useApprove';

export const NeanderExplorer = () => {
  const tabs = ['All', 'Listed'];
  const tokenType = ['neander', 'animal', 'consumable']; //  0: neander, 1: animal, 2:consumable

  const [activeTab, setActiveTab] = useState('All');

  const { address } = useAccount();
  const { chain } = useNetwork();
  const marketOfferModal = useMarketOfferModal();
  const listModal = useListingModal();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;

  const { nfts, listings, getListings } = useContext(Phase2Context);
  const { data: signerData } = useSigner();
  const { cancelListing } = useContext(Phase2Context);

  const nftAddress = SMOL_AGE_ADDRESS[chainId];

  const [selected, setSelected] = useState<BigNumber[]>();
  const [clicked, setClicked] = useState<BigNumber[]>();
  const [ownAddress, setOwnAddress] = useState('');
  const [listStatus, setListStatus] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [selectedOfferprice, setSelectedOfferprice] = useState(0);
  // const [activeExploreTab, setActiveExplorerTab] = useState<ExploreTab>(ExploreTab.All);

  const getTotalSupply = async () => {
    const contract = await new Contract(
      SMOL_AGE_ADDRESS[chainId],
      NeanderSmol__factory.abi,
      signerData,
    );

    if (!contract) {
      const balance = await contract.totalSupply();
      return balance.toNumber();
    }
    return 0;
  };

  useEffect(() => {
    if (activeTab == 'Listed') {
      getListings();
    }
  }, [activeTab]);

  const handleClick = (ids: any, owner: any, listStatus: any, selectedId: any, price: any) => {
    setClicked(ids);
    setOwnAddress(owner);
    setListStatus(listStatus);
    setSelectedId(selectedId);
    setSelectedOfferprice(price);
    marketOfferModal.onOpen();
  };

  const handleCancel = async (id: any) => {
    try {
      await cancelListing(id);
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const { approve: approveSupply } = useApproveERC20(
    address,
    NFT_MARKET_PLACE[chainId],
    BigNumber.from(price).mul(BigNumber.from(10).pow(18)),
  );
  const { data: allowance } = useAllowance(
    SMOL_AGE_BONES[chainId],
    address,
    NFT_MARKET_PLACE[chainId],
  );

  const { buyItems } = useContext(Phase2Context);

  const handleBuy = async (id: string) => {
    try {
      const myParams: BuyItemParamsStruct = {
        listingId: id,
        paymentToken: SMOL_AGE_BONES[chainId],
        usingEth: false,
      };

      if (allowance.lt(BigNumber.from(price).mul(BigNumber.from(10).pow(18)))) {
        await approveSupply();
      }
      await buyItems([myParams]);
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  useEffect(() => {
    const a = async () => {
      const totalSupply = await getTotalSupply();
    };
    a();
  }, []);

  return (
    <>
      <div className="relative min-h-screen bg-[url('/static/images/marketplace_landing.png')] bg-cover bg-center">
        <MarketOfferModal
          tokens={nfts.filter((nft) => nft.id)}
          listStatus={listStatus}
          manType={ownAddress}
          tokenType={tokenType[0]}
          clickedId={selectedId}
          listIds={clicked}
          quantity={0}
          offerprice={selectedOfferprice}
        />
        <ListingModal
          tokens={nfts.filter((nft) => selected?.includes(nft.id))}
          tokenType={tokenType[0]}
          balance={0}
        />
        <div className="mx-auto max-w-6xl px-4 py-6 pt-[140px] max-md:relative sm:px-8">
          <div className="relative w-full bg-black/40 p-4 pb-4 sm:p-6">
            <Link href="/marketplace">
              <Image
                src="/static/images/back.png"
                height={200}
                width={200}
                alt="Back Button"
                className="absolute left-[-20px] top-1/2 w-[60px] -translate-y-1/2"
              />
            </Link>

            <div className="head-line mb-6">
              <p className="my-2 text-center text-2xl">Neandersmols</p>
              <div className="over-right relative mb-6 w-full text-center">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`btn btn--primary ml-1 w-[150px] ${
                      activeTab === tab
                        ? 'border-smolBrow bg-smolBrownAlternative outline-none'
                        : ''
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <p className="text-center text-[10px]">All pricing is in $BONES</p>
            </div>

            <div className="border-line mb-4 mt-6 grid max-h-[45vh] grid-cols-3 gap-4 overflow-y-auto pb-4 pt-4 sm:grid-cols-4 md:grid-cols-5">
              {activeTab == 'All' &&
                nfts
                  ?.filter((nft) => !nft.staked)
                  .map((nft: NFTObject, index: number) => {
                    const isSelected = selected?.includes(nft.id);
                    return (
                      <div
                        className="mx-auto text-center"
                        key={index}
                        id={`smol${index.toString()}`}
                      >
                        <p className="text-center text-xs uppercase">#{nft.id}</p>
                        <button
                          key={nft.id.toString()}
                          className={cn(
                            isSelected ? 'border-smolBrownLight' : 'border-black',
                            'btn mx-auto mt-2',
                          )}
                          onClick={() => {
                            // If NFT is being on a listed, then it can't be selected.
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
                              width={140}
                              height={140}
                              className="rounded-lg"
                            />
                          </>
                        </button>
                      </div>
                    );
                  })}
              {activeTab == 'Listed' &&
                listings
                  ?.filter((nft) => nft.nftAddress == nftAddress.toLowerCase())
                  .map((nft, index) => {
                    return (
                      <div className="mx-auto text-center" key={index}>
                        <p className="text-center text-xs uppercase">
                          ({nft.tokenIds.length} NFTS)
                        </p>
                        <button
                          key={nft.id.toString()}
                          className="btn token-btn mx-auto mt-2 border-black"
                          onClick={() => {
                            handleClick(
                              nft.tokenIds,
                              nft.owner,
                              nft.status,
                              nft.id,
                              BigNumber.from(nft.price).div(BigNumber.from(10).pow(18)).toNumber(),
                            );
                          }}
                        >
                          <>
                            <Image
                              src={`/api/neandersmols/image/${
                                nft.tokenIds[0]
                              }?chainId=${chainId}&date=${Date.now()}`}
                              alt={`smol #${nft.id.toString()}`}
                              width={140}
                              height={140}
                              className="rounded-lg"
                            />
                          </>
                        </button>
                        <p className="text-xs uppercase">
                          Offer:{' '}
                          {BigNumber.from(nft.price).div(BigNumber.from(10).pow(18)).toNumber()}
                        </p>
                        {nft.owner == address.toLowerCase() ? (
                          <button
                            className="btn close-bt mx-auto mt-3 rounded-xl text-[10px]"
                            onClick={() => {
                              handleCancel(String(nft.id));
                            }}
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            className="btn buy-bt mx-auto mt-3 rounded-xl bg-red-800/90 text-[10px] outline-none"
                            onClick={() => {
                              setPrice(nft.price);
                              handleBuy(String(nft.id));
                            }}
                          >
                            BUY NOW
                          </button>
                        )}
                      </div>
                    );
                  })}
            </div>

            {selected?.length > 0 && (
              <div className="text-right">
                <p className="mb-2">{selected.length} SELECTED</p>
                <button
                  className="btn ml-[10px] w-[180px] bg-smolBrown outline-none"
                  onClick={() => {
                    listModal.onOpen();
                  }}
                >
                  CREATE LISTING
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
