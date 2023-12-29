import { ARBITRUM } from '@config';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';
import { useMemo } from 'react';
import { useNetwork, useQuery } from 'wagmi';

export const useStakedInPits = () => {
  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;

  const { data, refetch } = useQuery<{
    totalSupply: BigNumber;
    totalStaked: BigNumber;
    open: boolean;
    threshold: number;
  }>(['pits'], () => fetch(`/api/pits/staked?chainId=${chainId}`).then((res) => res.json()));

  const percentage = useMemo(() => {
    if (data && BigNumber.from(data?.totalSupply).gt(0)) {
      return (
        (parseFloat(formatEther(data?.totalStaked)) / parseFloat(formatEther(data?.totalSupply))) *
        100
      ).toFixed(1);
    }
    return "0";
  }, [chain, data]);

  const threshold = BigNumber.from(data?.threshold ?? 0).toNumber();

  return {
    percentage,
    threshold,
    open: threshold && +percentage >= threshold,
    refetch
  };
};
