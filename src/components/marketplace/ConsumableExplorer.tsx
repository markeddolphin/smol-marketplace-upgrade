import {
  ANIMALS,
  ARBITRUM,
  CONSUMABLES,
  SHOP,
  SMOL_AGE_ADDRESS,
  SMOL_AGE_BONES,
  SMOL_AGE_SMOL,
  MAGIC_ADDRESS,
  NFT_MARKET_PLACE,
} from '@config';
import { BigNumber, Contract, ethers } from 'ethers';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@utils';
import { Animal, NFTObject, ListingStatus, ConsumableType } from '@model/model';
import { Phase2Context } from '@context/phase2Context';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { useContext, useState, useEffect, useMemo } from 'react';
import useMarketOfferModal from '@hooks/useMarketOfferModal';
import useListingModal from '@hooks/useListingModal';
import { MarketOfferModal } from '@components/modals/MarketOfferModal';
import { ListingModal } from '@components/modals/ListingModal';
import { ERC1155__factory, NeanderSmol__factory } from '@typechain';
import { useEffectOnce } from 'react-use';
import { toast } from 'react-toastify';
import { animals, consumables } from '@components/phase2/labor-grounds/MyStakes';
import { useBalanceERC1155, useBalanceERC20, useBalancesERC1155 } from '@hooks/useBalance';
import { BuyItemParamsStruct } from '@typechain/NFTMarketPlace';
import {
  useApproveERC721,
  useIsApprovedERC721,
  useApproveERC20,
  useAllowance,
} from '@hooks/useApprove';

export const ConsumableExplorer = () => {
  const tabs = ['All', 'Listed'];
  const [activeTab, setActiveTab] = useState('All');

  const { address } = useAccount();
  const { chain } = useNetwork();
  const marketOfferModal = useMarketOfferModal();
  const listModal = useListingModal();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;

  const { nfts, listings, getListings, histories } = useContext(Phase2Context);

  const [selected, setSelected] = useState<BigNumber[]>();
  const [clicked, setClicked] = useState<BigNumber[]>();
  const [ownAddress, setOwnAddress] = useState('');
  const [listStatus, setListStatus] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedOfferprice, setSelectedOfferprice] = useState(0);
  const [balance, setBalance] = useState(0);

  const [bone, setBone] = useState(0);
  const [smol, setSmol] = useState(0);
  const [magic, setMagic] = useState(0);
  // const [activeExploreTab, setActiveExplorerTab] = useState<ExploreTab>(ExploreTab.All);

  const { data: signerData } = useSigner();
  const { cancelListing } = useContext(Phase2Context);

  const nftAddress = SMOL_AGE_ADDRESS[chainId];
  const animalNftAddress = ANIMALS[chainId];
  const consumableNftAddress = CONSUMABLES[chainId];

  const getTotalSupply = async () => {
    const contract = await new Contract(
      SMOL_AGE_ADDRESS[chainId],
      ERC1155__factory.abi,
      signerData,
    );
    if (!contract) {
      const balance = await contract.totalSupply();
      return balance.toNumber();
    }
    return 0;
  };

  const tokenType = ['neander', 'animal', 'consumable']; //  0: neander, 1: animal, 2:consumable

  useEffect(() => {
    if (activeTab == 'Listed') {
      getListings();
    }
  }, [activeTab]);

  // useEffect(() => {
  //   const a = async () => {
  //     const totalSupply = await getTotalSupply();
  //     console.log('total supply: => ', totalSupply.toNumber());
  //   };
  //   a();
  // }, []);

  const {
    data: consumableBalances,
    isRefetching: isRefetchingConsumable,
    refetch: refetchConsumableBalances,
  } = useBalancesERC1155(
    CONSUMABLES[chainId],
    Array(consumables.length).fill(address),
    consumables.map((consumable) => consumable.id),
  );

  const handleClick = (
    ids: any,
    owner: any,
    listStatus: any,
    selectedId: any,
    quantity: any,
    price: any,
  ) => {
    setClicked(ids);
    setOwnAddress(owner);
    setListStatus(listStatus);
    setSelectedId(selectedId);
    setSelectedQuantity(quantity);
    setSelectedOfferprice(price);
    marketOfferModal.onOpen();
  };

  const handleCancel = async (id: any) => {
    try {
      await cancelListing(id);
      // const updatedListings = listings2.filter(nft => nft.id !== id);
      // setListings2(updatedListings);
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  const { buyItems } = useContext(Phase2Context);
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const { approve: approveSupply } = useApproveERC20(
    SMOL_AGE_BONES[chainId],
    NFT_MARKET_PLACE[chainId],
    BigNumber.from(price).mul(BigNumber.from(10).pow(18)),
  );
  const { data: allowance } = useAllowance(
    SMOL_AGE_BONES[chainId],
    address,
    NFT_MARKET_PLACE[chainId],
  );

  const handleBuy = async (id: string) => {
    try {
      const myParams: BuyItemParamsStruct = {
        listingId: id,
        paymentToken: SMOL_AGE_BONES[chainId],
        usingEth: false,
      };

      await buyItems([myParams]);
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  const truncateString = (str, maxLength) => {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  };

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
          quantity={selectedQuantity}
          offerprice={selectedOfferprice}
        />
        <ListingModal
          tokens={consumables.filter((nft) => selected?.includes(nft.id))}
          tokenType={tokenType[1]}
          balance={balance}
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
              <p className="my-2 text-center text-2xl">Consumables</p>
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
            
              {histories.length == 0 ?
                <fieldset className="text-center mt-2 field-set">
                  <legend className="text-[12px]">Total Volume</legend>
                  <div className="mt-2 mb-2">
                    <p className="text-left ml-4 text-[10px]">BONES: {0}</p>
                    <p className="text-left ml-4 text-[10px]">SMOL: {0}</p>
                    <p className="text-left ml-4 text-[10px]">MAGIC: {0}</p>
                  </div>
                </fieldset>
                :
                histories.map((history, i) => {
                  <fieldset className="text-center mt-2 field-set">
                    <legend className="text-[12px]">Total Volume</legend>
                    <div className="mt-2 mb-2" key={'history_' + i}>
                      history.paymentToken == SMOL_AGE_BONES[chainId]
                      ? setBone(bone + BigNumber.from(history.price).div(BigNumber.from(10).pow(BigNumber.from(8))).toNumber())
                      : history.paymentToken == SMOL_AGE_SMOL[chainId]
                      ? setSmol(smol + BigNumber.from(history.price).div(BigNumber.from(10).pow(BigNumber.from(8))).toNumber())
                      : setMagic(magic + BigNumber.from(history.price).div(BigNumber.from(10).pow(BigNumber.from(8))).toNumber())
  
                      <p className="text-left ml-4 text-[10px]">BONES: {bone}</p>
                      <p className="text-left ml-4 text-[10px]">SMOL: {smol}</p>
                      <p className="text-left ml-4 text-[10px]">MAGIC: {magic}</p>
                    </div>
                  </fieldset>
              })}
            </div>

            <div className="border-line mb-4 mt-6 grid max-h-[45vh] grid-cols-3 gap-4 overflow-y-auto pb-4 pt-4 sm:grid-cols-4 md:grid-cols-5">
              {activeTab == 'All' &&
                consumableBalances &&
                consumables.map((nft, index) => {
                  const isSelected = selected?.includes(nft.id);
                  return (
                    <div className="mx-auto text-center" key={index}>
                      <p className="text-center text-xs uppercase">{nft.name}</p>
                      <button
                        key={nft.id.toString()}
                        className={cn(
                          isSelected ? 'border-smolBrownLight' : 'border-black',
                          'btn mx-auto mt-2',
                        )}
                        onClick={() => {
                          setBalance(consumableBalances[index].toNumber());
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
                      <p className="text-xs uppercase">
                        {consumableBalances[index]?.toNumber() ?? 0}
                      </p>
                    </div>
                  );
                })}
              {activeTab == 'Listed' &&
                listings
                  .filter((nft) => nft.nftAddress == consumableNftAddress.toLowerCase())
                  .map((nft, index) => {
                    return (
                      <div className="mx-auto text-center" key={index}>
                        <p className="text-center text-xs uppercase">({nft.quantity})</p>
                        <button
                          key={nft.id.toString()}
                          className="btn token-btn mx-auto mt-2 border-black"
                          onClick={() => {
                            // marketOfferModal.onOpen()
                            handleClick(
                              nft.tokenIds,
                              nft.owner,
                              nft.status,
                              nft.id,
                              nft.quantity,
                              BigNumber.from(nft.price).div(BigNumber.from(10).pow(18)).toString(),
                            );
                          }}
                        >
                          <Image
                            src={`/api/neandersmols/image/${
                              nft.tokenIds[0]
                            }?chainId=${chainId}&date=${Date.now()}`}
                            alt={`smol #${nft.id.toString()}`}
                            width={140}
                            height={140}
                            className="rounded-lg"
                          />
                        </button>
                        <p className="py-1 text-xs uppercase">
                          {BigNumber.from(nft.price).div(BigNumber.from(10).pow(18)).toString()}
                        </p>
                        {/* <p className="text-xs uppercase">Offer: 5,000</p> */}

                        {nft.owner == address.toLowerCase() ? (
                          <button
                            className="btn mt-3 rounded-xl text-[10px] outline-none"
                            onClick={() => {
                              handleCancel(String(nft.id));
                            }}
                          >
                            Cancle
                          </button>
                        ) : (
                          <button
                            className="btn mt-3 rounded-xl bg-red-800/90 text-[10px] outline-none"
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
                    selected.length == 1
                      ? listModal.onOpen()
                      : toast.warning('You can create an list for only ONE NFT.');
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

export default ConsumableExplorer;
