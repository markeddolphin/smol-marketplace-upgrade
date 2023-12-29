import { GroundsState } from '@components/BonesStaked';
import { StakeComponent } from '@components/phase2/pits/StakeComponent';
import { ARBITRUM } from '@config';
import { useIsMounted } from '@hooks/useIsMounted';
import { useStakedInPits } from '@hooks/useStakedInPits';
import { cn } from '@utils';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';
import { NextPage } from 'next';
import { useCallback } from 'react';
import { useAccount, useNetwork, useQuery } from 'wagmi';

const Pits: NextPage = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
  const isMounted = useIsMounted();
  const { percentage, open, refetch } = useStakedInPits();

  const { data, refetch: refetchUserStake } = useQuery<{
    bonesBalance: BigNumber;
    bonesStaked: BigNumber;
  }>(
    ['bonesStaked', chainId, address],
    () => fetch(`/api/pits/${address}?chainId=${chainId}`).then((res) => res.json()),
    {
      enabled: !!address,
      staleTime: 1 * 60 * 1000,
      cacheTime: 5 * 60 * 1000, // 5 min
    },
  );

  const refetchAll = useCallback(() => {
    refetch();
    refetchUserStake();
  }, [refetch, refetchUserStake]);

  if (!isMounted) return null;

  return (
    <div className="relative h-screen bg-[url('/static/images/phase2/pits.gif')] bg-cover bg-center max-xs:overflow-x-scroll">
      <GroundsState percentage={percentage} open={open} />
      <h4 className="mt-8 text-center uppercase text-white sm:mt-12">Your Current Stake</h4>
      <div
        className={cn(
          open ? 'bg-green-600/90' : 'bg-red-800/90',
          'mx-auto my-4 flex w-fit rounded-2xl border-4 border-black px-8 py-1.5 text-center text-white',
        )}
      >
        {parseFloat(formatEther(data?.bonesStaked ?? '0')).toFixed(0)} $BONES
      </div>
      <StakeComponent
        balance={data?.bonesBalance}
        staked={data?.bonesStaked}
        refetch={refetchAll}
      />
    </div>
  );
};

export async function getStaticProps() {
  return { props: { title: 'Smol Age | Pits' } };
}

export default Pits;
