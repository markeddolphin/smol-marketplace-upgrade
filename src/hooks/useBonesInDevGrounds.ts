import { ARBITRUM, DEVELOPMENT_GROUNDS } from '@config';
import { DevelopmentGrounds__factory } from '@typechain';
import { BigNumber } from 'ethers';
import { useContractRead, useNetwork } from 'wagmi';

export const useBonesInDevGrounds = (tokenId: BigNumber) => {
  const { chain } = useNetwork();

  const { data, isLoading, refetch } = useContractRead({
    address: DEVELOPMENT_GROUNDS[chain?.id ?? ARBITRUM],
    abi: DevelopmentGrounds__factory.abi,
    functionName: 'bonesToTime',
    args: [tokenId],
  });

  return { data, isLoading, refetch}
};
