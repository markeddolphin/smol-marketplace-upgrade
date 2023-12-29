import { NFTObject } from '@model/model';
import React from 'react';

export interface WalletContextData {
  isLoading: boolean;
  unStake: (e: any) => Promise<boolean>;
  nfts: Array<NFTObject> | NFTObject[];
  unstakeBones: (e: any, b: any) => Promise<boolean>;
  claimCommonSense: (e: any) => void;

  unstakeAllBones: () => Promise<any>;
  unstakeAllSmols: () => Promise<any>;
}

export const walletContextDefaultValue: WalletContextData = {
  isLoading: false,
  unStake: async () => Promise.resolve(false),
  nfts: [],
  unstakeBones: async () => Promise.resolve(false),
  claimCommonSense: async () => Promise.resolve(),

  unstakeAllBones: async () => Promise.resolve(),
  unstakeAllSmols: async () => Promise.resolve(),
};

export const WalletContext = React.createContext<WalletContextData>(walletContextDefaultValue);
