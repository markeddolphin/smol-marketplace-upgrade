import { LABOR_GROUNDS } from '@config';
import {
  ARBITRUM,
  CAVES,
  DEVELOPMENT_GROUNDS,
  SHOP,
  SMOL_AGE_ADDRESS,
  SMOL_AGE_BONES,
  THE_GRAPH_API_URL,
  SUBGRAPH_OF_MARKETPLACE,
  THE_PITS,
  NFT_MARKET_PLACE,
} from '@config';
import { Phase2Context } from '@context/phase2Context';
import { useStakedNFTs } from '@hooks/useStakedNFTs';
import { ListingStatus, NFTObject, SelectedItem, UserToken } from '@model/model';
import {
  Bones__factory,
  Caves__factory,
  DevelopmentGrounds__factory,
  LaborGrounds__factory,
  NeanderSmol__factory,
  Pits__factory,
  Shop__factory,
  NFTMarketPlace__factory,
} from '@typechain';
import { LaborGroundFeInfoStructOutput } from '@typechain/LaborGrounds';
import {
  BuyItemParamsStruct,
  ListingParamsStruct,
  AcceptBidParamsStruct,
  ListingParamsStructOutput,
} from '@typechain/NFTMarketPlace';
import { BigNumber, BigNumberish, Contract, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from 'urql';
import { Address, useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import useListingModal from '@hooks/useListingModal';

type Props = {
  children?: ReactNode;
};

const client = (chainId: number) =>
  createClient({
    url: THE_GRAPH_API_URL[chainId],
  });

const userTokensQuery = `query ($account: String!) {
  user(id: $account) {
    tokens(first: 500) {
      tokenID
      name
      staked
      stakeLocation
      owner {
        id
        tokens
      }
    }
   }
  }`;

const allTokensQuery = `query {
  tokens(first: 500) {
    tokenID
    name
    staked
    stakeLocation
    owner {
      id
    }
  }
}`;

const clientOfMarketplace = (chainId: number) =>
  createClient({
    url: SUBGRAPH_OF_MARKETPLACE[chainId],
  });

const listingQuery = `query($status: String!) {
  listings(where: {status: $status}) {
    id
    owner
    quantity
    price
    tokenIds
    expirationTime
    paymentToken
    nftAddress
    status
  }
}`;

const offerQuery = `query($status: String!) {
  bids(where: {listingId: $status}) {
    id
    nftAddress
    listingId
    bidder
    quantity
    price
    expirationTime
    paymentToken
    status
  }
}`;

const WithWalletPhase2 = ({ children }: Props) => {
  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
  const { address } = useAccount();
  const provider = useProvider();
  const { data: signerData } = useSigner();
  const { data: stakedNfs } = useStakedNFTs();
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState<NFTObject[]>([]);
  const [listings, setListings] = useState<NFTObject[]>([]);
  const [offers, setOffers] = useState<NFTObject[]>([]);
  const listingModal = useListingModal();

  useEffect(() => {
    const onAddress = async () => {
      await getNfts();
    };
    if (!address || !chain) {
      setNfts([]);
    } else {
      onAddress();
    }
  }, [address, chain, stakedNfs]);

  useEffect(() => {
    const fetchListings = async () => {
      await getListings();
    };
    if (address && chain) {
      fetchListings();
    }
  }, [address, chain, listingModal.isOpen]);

  const getNfts = async () => {
    const address = '0xd411c5C70339F15bCE20dD033B5FfAa3F8d2806f';
    // const address = "0xfB40CDF865A64558bdD4bc5bF87927254fDe1D20";
    const { data, error } = await client(chainId)
      // .query(userTokensQuery, { account: address.toLowerCase() })
      .query(allTokensQuery, {})
      .toPromise();

    if (error) {
      toast.error('Something went wrong with fetching your account info.');
      return;
    }

    // if (!data?.user?.tokens || data?.user?.tokens?.length == 0) {
    //   setNfts([]);
    //   return;
    // }
    const nfts: NFTObject[] = await Promise.all(
      // data.user?.tokens?.map(async (token: UserToken) => {
      data.tokens?.map(async (token) => {
        // const sense = await smolContract.commonSense(BigNumber.from(token.tokenID));
        return {
          id: token.tokenID,
          name: token.name,
          image: `/api/neandersmols/image/${token.tokenID}?chainId=${chainId}&date=${Date.now()}`,
          staked: token.staked,
          stakedLocation: token.stakedLocation,
          // commonSense: Number(formatUnits(sense, 9)),
          owner: token.owner,
        };
      }),
    );

    setNfts(nfts);
  };

  // ------------------------------- PITS ------------------------------- //

  const stakeBones = async (amount: BigNumber): Promise<boolean> => {
    setIsLoading(true);

    let success = false;
    try {
      const pitsContract = new Contract(THE_PITS[chainId], Pits__factory.abi, signerData);

      await handleBoneApproval(amount, THE_PITS[chainId]);

      const txRes = await pitsContract.stakeBonesInYard(amount);
      const receipt = await txRes.wait(1);
      if (receipt.status) {
        toast.success('Your Bones have been staked!');
        success = true;
      } else {
        toast.error('Something went wrong.');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    }
    setIsLoading(false);
    return success;
  };

  const unstakeBones = async (amount: BigNumber): Promise<boolean> => {
    setIsLoading(true);

    let success = false;
    try {
      const pitsContract = new Contract(THE_PITS[chainId], Pits__factory.abi, signerData);

      const txRes = await pitsContract.removeBonesFromYard(amount);
      const receipt = await txRes.wait(1);

      if (receipt.status) {
        toast.success('Your Bones have been unstaked!');
        success = true;
      } else {
        toast.error('Something went wrong with claiming rewards. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  // ------------------------------- CAVES ------------------------------- //

  const enterCaves = async (tokenIds: BigNumber[]): Promise<boolean> => {
    setIsLoading(true);

    let success = false;
    try {
      const phase2Contract = new Contract(CAVES[chainId], Caves__factory.abi, signerData);
      const txRes = await phase2Contract.enterCaves(tokenIds);
      const receipt = await txRes.wait(1);

      if (receipt.status) {
        toast.success('Your Smols entered the caves!');
        success = true;
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  const leaveCave = async (tokenIds: BigNumber[]): Promise<boolean> => {
    setIsLoading(true);

    let success = false;
    try {
      const phase2Contract = new Contract(CAVES[chainId], Caves__factory.abi, signerData);

      const txRes = await phase2Contract.leaveCave(tokenIds);
      const receipt = await txRes.wait(1);

      if (receipt.status) {
        toast.success('Your Smols left the cave!');
        success = true;
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  const claimCaveReward = async (tokenIds: BigNumber[]): Promise<boolean> => {
    setIsLoading(true);

    let success = false;
    try {
      const phase2Contract = new Contract(CAVES[chainId], Caves__factory.abi, signerData);

      const txRes = await phase2Contract.claimCaveReward(tokenIds);
      const receipt = await txRes.wait(1);

      if (receipt.status) {
        toast.success('$BONES claimed!');
        success = true;
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  // ------------------------ DEVELOPMENT GROUNDS ------------------------ //

  const enterDevelopmentGrounds = async (tokens: SelectedItem[]): Promise<boolean> => {
    setIsLoading(true);

    let success = false;
    try {
      const devGroundsContract = new Contract(
        DEVELOPMENT_GROUNDS[chainId],
        DevelopmentGrounds__factory.abi,
        signerData,
      );

      const tx = await devGroundsContract.enterDevelopmentGround(
        tokens.map((t) => t.tokenId),
        tokens.map((t) => t.lock),
        tokens.map((t) => t.ground),
      );
      const receipt = await tx.wait(1);

      if (receipt.status) {
        toast.success('Your Smols entered the Development Grounds!');
        success = true;
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  const leaveDevelopmentGrounds = async (tokenIds: BigNumber[]) => {
    setIsLoading(true);

    try {
      const devGroundsContract = new Contract(
        DEVELOPMENT_GROUNDS[chainId],
        DevelopmentGrounds__factory.abi,
        signerData,
      );

      const tx = await devGroundsContract.leaveDevelopmentGround(tokenIds);
      const receipt = await tx.wait(1);

      if (receipt.status) {
        toast.success('Your Smols left the Development Grounds!');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
  };

  const claimBonesDevelopmentGrounds = async (tokenIds: BigNumber[]) => {
    setIsLoading(true);

    try {
      const devGroundsContract = new Contract(
        DEVELOPMENT_GROUNDS[chainId],
        DevelopmentGrounds__factory.abi,
        signerData,
      );

      const tx = await devGroundsContract.claimDevelopmentGroundBonesReward(
        tokenIds,
        tokenIds.map(() => false),
      );
      const receipt = await tx.wait(1);

      receipt.status
        ? toast.success('Bones Claimed!')
        : toast.error('Something went wrong. Please try again.');
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
  };

  const stakeBonesDevelopmentGrounds = async (
    tokenIds: BigNumber[],
    amounts: BigNumber[],
  ): Promise<boolean> => {
    setIsLoading(true);

    let success = false;
    try {
      const devGroundsContract = new Contract(
        DEVELOPMENT_GROUNDS[chainId],
        DevelopmentGrounds__factory.abi,
        signerData,
      );

      const totalAmount = amounts.reduce((a, b) => a.add(b), BigNumber.from(0));
      await handleBoneApproval(totalAmount, DEVELOPMENT_GROUNDS[chainId]);

      const tx = await devGroundsContract.stakeBonesInDevelopmentGround(amounts, tokenIds);
      const receipt = await tx.wait(1);

      receipt.status
        ? toast.success('Bones Staked!')
        : toast.error('Something went wrong. Please try again.');
      success = true;
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  const unstakeSingleBonesDevelopmentGrounds = async (
    tokenId: BigNumber,
    position: number,
  ): Promise<boolean> => {
    setIsLoading(true);

    let success = false;
    try {
      const devGroundsContract = new Contract(
        DEVELOPMENT_GROUNDS[chainId],
        DevelopmentGrounds__factory.abi,
        signerData,
      );

      const tx = await devGroundsContract.removeSingleBones(tokenId, position);
      const receipt = await tx.wait(1);

      receipt.status
        ? toast.success('Bones Removed!')
        : toast.error('Something went wrong. Please try again.');
      success = true;
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  // ------------------------------ SHOP --------------------------------- //

  const mintLaborTools = async (tokenIds: BigNumber[], amounts: number[], currencies: number[]) => {
    setIsLoading(true);

    let success = false;
    try {
      const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
      const shopContract = new Contract(SHOP[chainId], Shop__factory.abi, signerData);
      const tx = await shopContract.mint(tokenIds, amounts, currencies);
      const receipt = await tx.wait(1);

      if (receipt.status) {
        toast.success('Successfully purchased tools!');
        success = true;
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  // ------------------------------ LABOR GROUNDS --------------------------------- //

  const enterLaborGrounds = async (
    tokenIds: BigNumber[],
    supplyIds: BigNumber[],
    jobs: number[],
  ) => {
    setIsLoading(true);

    let success = false;
    try {
      const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
      const laborGroundsContract = new Contract(
        LABOR_GROUNDS[chainId],
        LaborGrounds__factory.abi,
        signerData,
      );
      const tx = await laborGroundsContract.enterLaborGround(tokenIds, supplyIds, jobs);
      const receipt = await tx.wait(1);

      if (receipt.status) {
        toast.success('You Smols entered the labor ground!');
        success = true;
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  const leaveLaborGrounds = async (tokenIds: BigNumber[]) => {
    setIsLoading(true);

    let success = false;
    try {
      const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
      const laborGroundsContract = new Contract(
        LABOR_GROUNDS[chainId],
        LaborGrounds__factory.abi,
        signerData,
      );
      const tx = await laborGroundsContract.leaveLaborGround(tokenIds);
      const receipt = await tx.wait(1);

      if (receipt.status) {
        toast.success('Your Smols left the labor ground!');
        success = true;
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  const bringInAnimalsToLaborGrounds = async (tokenIds: BigNumber[], animalIds: BigNumber[]) => {
    setIsLoading(true);

    let success = false;
    try {
      const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
      const laborGroundsContract = new Contract(
        LABOR_GROUNDS[chainId],
        LaborGrounds__factory.abi,
        signerData,
      );
      const tx = await laborGroundsContract.bringInAnimalsToLaborGround(tokenIds, animalIds);
      const receipt = await tx.wait(1);

      if (receipt.status) {
        toast.success('Your Animals have been put in labor grounds!');
        success = true;
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  const removeAnimalsFromLaborGrounds = async (tokenIds: BigNumber[]) => {
    setIsLoading(true);

    let success = false;
    try {
      const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
      const laborGroundsContract = new Contract(
        LABOR_GROUNDS[chainId],
        LaborGrounds__factory.abi,
        signerData,
      );
      const tx = await laborGroundsContract.removeAnimalsFromLaborGround(tokenIds);
      const receipt = await tx.wait(1);

      if (receipt.status) {
        toast.success('Your Animals have been removed from labor grounds!');
        success = true;
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  const claimCollectableLaborGrounds = async (tokenIds: BigNumber[]): Promise<boolean> => {
    setIsLoading(true);

    let success = false;
    try {
      const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
      const laborGroundsContract = new Contract(
        LABOR_GROUNDS[chainId],
        LaborGrounds__factory.abi,
        signerData,
      );
      const txRes = await laborGroundsContract.claimCollectables(tokenIds);
      const receipt = await txRes.wait(1);

      if (receipt.status) {
        success = true;
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
    return success;
  };

  const stakedSmolsInLaborGrounds = async (
    address: Address,
  ): Promise<LaborGroundFeInfoStructOutput[]> => {
    const stakedTokens = await LaborGrounds__factory.connect(
      LABOR_GROUNDS[chainId],
      provider,
    ).getLaborGroundFeInfo(address);
    return stakedTokens;
  };
  // ------------------------------ UTILITY ---------------------------------- //

  const handleBoneApproval = async (amount: BigNumber, contractAddress: string) => {
    const bonesContract = new Contract(SMOL_AGE_BONES[chainId], Bones__factory.abi, signerData);
    const balance: BigNumber = await bonesContract.balanceOf(address);
    if (balance.lt(amount)) {
      toast.error('Not enough Bones!');
      return;
    }

    const allowance = await bonesContract.allowance(address, contractAddress);
    if (allowance.lt(amount)) {
      const approveTx = await bonesContract.approve(contractAddress, ethers.constants.MaxUint256);
      const allowanceRes = await approveTx.wait(1);
      if (allowanceRes.status) {
        toast.success('Allowance set!');
      } else {
        toast.error('Allowance failed!');
        return;
      }
    }
  };
  // ---------------------------- MarketPlace -------------------------------- //

  const setNftApprove = async (to: string, tokenId: BigNumber) => {
    const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
    const nftMarketContract = new Contract(
      NFT_MARKET_PLACE[chainId],
      NeanderSmol__factory.abi,
      signerData,
    );

    try {
      const createlistTx = await nftMarketContract.approve(to, tokenId);
      const createlistRes = await createlistTx.wait(1);

      if (createlistRes.status) {
        toast.success('Successfully create list');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    return;
  };

  const createListing = async (params: ListingParamsStruct) => {
    // const createListing = async (params: ListingParamsStructOutput) => {
    const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
    const nftMarketContract = new Contract(
      NFT_MARKET_PLACE[chainId],
      NFTMarketPlace__factory.abi,
      signerData,
    );

    try {
      const tx = await nftMarketContract.createListing(params);
      const createlistRes = await tx.wait(1);

      if (createlistRes.status) {
        toast.success('Successfully create list');
      } else {
        toast.error('Something went wrong. Please try again1.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again2.');
    }
    return;
  };

  const updateListing = async (params: ListingParamsStruct, _listId: string) => {
    setIsLoading(true);
    const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
    const nftMarketContract = new Contract(
      NFT_MARKET_PLACE[chainId],
      NFTMarketPlace__factory.abi,
      signerData,
    );

    try {
      const updatelistTx = await nftMarketContract.updateListing(params, _listId);
      const updatelistRes = await updatelistTx.wait(1);

      if (updatelistRes.status) {
        toast.success('Successfully update list');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    setIsLoading(false);
    return;
  };

  const cancelListing = async (listId: string) => {
    const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
    const nftMarketContract = new Contract(
      NFT_MARKET_PLACE[chainId],
      NFTMarketPlace__factory.abi,
      signerData,
    );

    try {
      const cancellistTx = await nftMarketContract.cancelListing(listId);
      const cancellistRes = await cancellistTx.wait(1);

      if (cancellistRes.status) {
        toast.success('Successfully cancel list');
      } else {
        toast.error('Something went wrong. Please try again1.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again2.');
    }
    getListings();
    return;
  };

  const createTokenBidForListing = async (
    _price: string,
    _expirationTime: string,
    _paymentToken: string,
    _listingId: string,
  ) => {
    const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
    const nftMarketContract = new Contract(
      NFT_MARKET_PLACE[chainId],
      NFTMarketPlace__factory.abi,
      signerData,
    );

    try {
      const createTokenBidTx = await nftMarketContract.createTokenBidForListing(
        _price,
        _expirationTime,
        _paymentToken,
        _listingId,
      );
      const createTokenBidRes = await createTokenBidTx.wait(1);

      if (createTokenBidRes.status) {
        toast.success('Successfully offer');
      } else {
        toast.error('Something went wrong. Please try again1.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again2.');
    }
    return;
  };

  const setApprove = async (to: Address, amount: BigNumber) => {
    const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
    const nftMarketContract = new Contract(
      NFT_MARKET_PLACE[chainId],
      Bones__factory.abi,
      signerData,
    );

    try {
      const createlistTx = await nftMarketContract.approve(to, amount);
      const createlistRes = await createlistTx.wait(1);

      if (createlistRes.status) {
        toast.success('Successfully create list');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    return;
  };

  const cancelTokenBidForListing = async (_listingId: string) => {
    const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
    const nftMarketContract = new Contract(
      NFT_MARKET_PLACE[chainId],
      NFTMarketPlace__factory.abi,
      signerData,
    );

    try {
      const cancelTokenBidTx = await nftMarketContract.cancelTokenBidForListing(_listingId);
      const cancelTokenBidRes = await cancelTokenBidTx.wait(1);

      if (cancelTokenBidRes.status) {
        toast.success('Successfully cancel offer');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    return;
  };

  const acceptTokenBidForListing = async (params: AcceptBidParamsStruct) => {
    const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
    const nftMarketContract = new Contract(
      NFT_MARKET_PLACE[chainId],
      NFTMarketPlace__factory.abi,
      signerData,
    );

    try {
      const acceptTokenBidTx = await nftMarketContract.acceptTokenBidForListing(params);
      const acceptTokenBidRes = await acceptTokenBidTx.wait(1);

      if (acceptTokenBidRes.status) {
        toast.success('Successfully offer');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    return;
  };

  const buyItems = async (params: BuyItemParamsStruct[]) => {
    const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
    const nftMarketContract = new Contract(
      NFT_MARKET_PLACE[chainId],
      NFTMarketPlace__factory.abi,
      signerData,
    );

    try {
      const acceptTokenBidTx = await nftMarketContract.buyItems(params);
      const acceptTokenBidRes = await acceptTokenBidTx.wait(1);

      if (acceptTokenBidRes.status) {
        toast.success('Successfully buy Items');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    return;
  };

  const getListings = async () => {
    try {
      const { data, error } = await clientOfMarketplace(chainId)
        .query(listingQuery, { status: ListingStatus.Opened })
        .toPromise();

      if (error) {
        toast.error('Something went wrong with fetching your account info.');
        return;
      }
      // return data;

      const listings: NFTObject[] = await Promise.all(
        data.listings?.map(async (list) => {
          return {
            expirationTime: list.expirationTime,
            id: list.id,
            owner: list.owner,
            paymentToken: list.paymentToken,
            price: list.price,
            quantity: list.quantity,
            status: list.status,
            tokenIds: list.tokenIds,
            nftAddress: list.nftAddress,
          };
        }),
      );
      setListings(listings);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      return;
    }
  };

  const getOffers = async (_listingId: string) => {
    try {
      const { data, error } = await clientOfMarketplace(chainId)
        .query(offerQuery, { status: _listingId })
        .toPromise();

      if (error) {
        toast.error('Something went wrong with fetching your account info.');
        return;
      }
      // return data;

      const offers: NFTObject[] = await Promise.all(
        data.offers?.map(async (offer) => {
          return {
            id: offer.id,
            nftAddress: offer.nftAddress,
            listingId: offer.listingId,
            bidder: offer.bidder,
            quantity: offer.quantity,
            price: offer.price,
            expirationTime: offer.expirationTime,
            paymentToken: offer.paymentToken,
            status: offer.status,
          };
        }),
      );
      setOffers(offers);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      return;
    }
  };

  return (
    <Phase2Context.Provider
      value={{
        nfts,
        isLoading,
        stakeBones,
        unstakeBones,
        enterCaves,
        leaveCave,
        claimCaveReward,
        enterDevelopmentGrounds,
        leaveDevelopmentGrounds,
        claimBonesDevelopmentGrounds,
        stakeBonesDevelopmentGrounds,
        unstakeSingleBonesDevelopmentGrounds,
        mintLaborTools,
        stakedSmolsInLaborGrounds,
        enterLaborGrounds,
        leaveLaborGrounds,
        bringInAnimalsToLaborGrounds,
        removeAnimalsFromLaborGrounds,
        claimCollectableLaborGrounds,
        createListing,
        createTokenBidForListing,
        cancelListing,
        cancelTokenBidForListing,
        acceptTokenBidForListing,
        getListings,
        updateListing,
        getOffers,
        listings,
        offers,
        // setNftApprove,
        buyItems,
        // setApprove,
        refetchNFTs: async () => {
          await getNfts();
        },
      }}
    >
      {children}
    </Phase2Context.Provider>
  );
};

export default WithWalletPhase2;
