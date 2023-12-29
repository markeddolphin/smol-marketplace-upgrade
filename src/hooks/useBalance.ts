import { BigNumber } from 'ethers';
import {
  Address,
  erc20ABI,
  erc721ABI,
  useContractRead,
} from 'wagmi';
import { ERC1155__factory } from '@typechain';

export const useBalanceERC20 = (
  address: Address,
  ownerAddress: Address,
  enabled?: boolean,
) =>
  useContractRead({
    address,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [ownerAddress],
    enabled: !!address && enabled,
  });

export const useBalanceERC721 = (
  address: Address,
  ownerAddress: Address,
  enabled?: boolean,
) =>
  useContractRead({
    address,
    abi: erc721ABI,
    functionName: 'balanceOf',
    args: [ownerAddress],
    enabled: !!address && enabled,
  });

export const useBalanceERC1155 = (
  address: Address,
  ownerAddress: Address,
  tokenId: BigNumber,
  enabled?: boolean,
) =>
  useContractRead({
    address,
    abi: ERC1155__factory.abi,
    functionName: 'balanceOf',
    args: [ownerAddress, tokenId],
    enabled: !!address && enabled,
  });


export const useBalancesERC1155 = (
  address: Address,
  ownerAddresses: Address[],
  tokenIds: BigNumber[],
  enabled?: boolean,
) =>
  useContractRead({
    address,
    abi: ERC1155__factory.abi,
    functionName: 'balanceOfBatch',
    args: [ownerAddresses, tokenIds],
    enabled: !!address && enabled,
  });