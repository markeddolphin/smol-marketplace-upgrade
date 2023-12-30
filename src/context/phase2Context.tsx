import { NFTObject, SelectedItem, UserToken } from '@model/model';
import { LaborGroundFeInfoStructOutput } from '@typechain/LaborGrounds';
import { ListingParamsStruct, ListingParamsStructOutput, BuyItemParamsStruct, AcceptBidParamsStruct } from '@typechain/NFTMarketPlace';
import { BigNumber } from 'ethers';
import React from 'react';
import { Address } from 'wagmi';

export interface WalletContextData {
  isLoading: boolean;
  nfts: NFTObject[];
  stakeBones: (amount: BigNumber) => Promise<boolean>;
  unstakeBones: (amount: BigNumber) => Promise<boolean>;
  enterCaves: (amount: BigNumber[]) => Promise<boolean>;
  leaveCave: (amount: BigNumber[]) => Promise<boolean>;
  claimCaveReward: (amount: BigNumber[]) => Promise<boolean>;
  enterDevelopmentGrounds: (tokens: SelectedItem[]) => Promise<boolean>;
  leaveDevelopmentGrounds: (tokenIds: BigNumber[]) => Promise<void>;
  claimBonesDevelopmentGrounds: (tokenIds: BigNumber[]) => Promise<void>;
  stakeBonesDevelopmentGrounds: (tokenIds: BigNumber[], amounts: BigNumber[]) => Promise<boolean>;
  unstakeSingleBonesDevelopmentGrounds: (tokenId: BigNumber, position: number) => Promise<boolean>;
  mintLaborTools: (tokenIds: BigNumber[], amounts: number[], currencies: number[]) => Promise<boolean>;
  stakedSmolsInLaborGrounds: (address: Address) => Promise<LaborGroundFeInfoStructOutput[]>;
  enterLaborGrounds: (tokenIds: BigNumber[], supplyIds: BigNumber[], jobs: number[]) => Promise<boolean>;
  leaveLaborGrounds: (tokenIds: BigNumber[]) => Promise<boolean>;
  bringInAnimalsToLaborGrounds: (tokenIds: BigNumber[], animalIds: BigNumber[]) => Promise<boolean>;
  removeAnimalsFromLaborGrounds: (tokenIds: BigNumber[]) => Promise<boolean>;
  claimCollectableLaborGrounds: (tokenIds: BigNumber[]) => Promise<boolean>;
  createListing: (params: ListingParamsStruct) => Promise<void>;
  updateListing: (params: ListingParamsStruct, _listId: string) => Promise<void>;
  // createListing: (params: ListingParamsStructOutput) => Promise<void>;
  cancelListing: (listId: string) => Promise<void>;
  createTokenBidForListing: (_price: string, _expirationTime: string, _paymentToken: string, _listingId: string) => Promise<void>;
  buyItems: (params: BuyItemParamsStruct[]) => Promise<void>;
  getListings: () => Promise<void>;
  getOffers: (_listingId: string) => Promise<void>;
  listings: NFTObject[];
  offers: NFTObject[];
  histories: NFTObject[];
  cancelTokenBidForListing: (_listingId: string) => Promise<void>;
  acceptTokenBidForListing: (params: AcceptBidParamsStruct) => Promise<void>;
  refetchNFTs?: () => Promise<void>;
}

export const phase2ContextDefaults: WalletContextData = {
  isLoading: false,
  nfts: [],
  stakeBones: async () => Promise.resolve(false),
  unstakeBones: async () => Promise.resolve(false),
  enterCaves: async () => Promise.resolve(false),
  leaveCave: async () => Promise.resolve(false),
  claimCaveReward: async () => Promise.resolve(false),
  enterDevelopmentGrounds: async () => Promise.resolve(false),
  leaveDevelopmentGrounds: async () => Promise.resolve(),
  claimBonesDevelopmentGrounds: async () => Promise.resolve(),
  stakeBonesDevelopmentGrounds: async () => Promise.resolve(false),
  unstakeSingleBonesDevelopmentGrounds: async () => Promise.resolve(false),
  mintLaborTools: async () => Promise.resolve(false),
  stakedSmolsInLaborGrounds: async () => Promise.resolve([]),
  enterLaborGrounds: async () => Promise.resolve(false),
  leaveLaborGrounds: async () => Promise.resolve(false),
  bringInAnimalsToLaborGrounds: async () => Promise.resolve(false),
  removeAnimalsFromLaborGrounds: async () => Promise.resolve(false),
  claimCollectableLaborGrounds: async () => Promise.resolve(false),
  createListing: async () => Promise.resolve(),
  cancelListing: async () => Promise.resolve(),
  createTokenBidForListing: async () => Promise.resolve(),
  buyItems: async () => Promise.resolve(),
  getListings: async () => Promise.resolve(),
  updateListing: async () => Promise.resolve(),
  getOffers: async () => Promise.resolve(),
  listings: [],
  offers: [],
  histories: [],
  cancelTokenBidForListing: async () => Promise.resolve(),
  acceptTokenBidForListing: async () => Promise.resolve(),
  refetchNFTs: async () => Promise.resolve(),
};

export const Phase2Context = React.createContext<WalletContextData>(phase2ContextDefaults);
