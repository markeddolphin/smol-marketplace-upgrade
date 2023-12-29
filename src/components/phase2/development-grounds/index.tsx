import ClientOnly from '@components/ClientOnly';
import { ARBITRUM } from '@config';
import { Tab } from '@headlessui/react';
import { cn } from '@utils';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';
import Image from 'next/image';
import Link from 'next/link';
import { useAccount, useNetwork, useQuery } from 'wagmi';
import { MyStakes } from './MyStakes';
import { Stake } from './Stake';

const tabs = [
  { name: 'Stake', component: (props) => <Stake {...props} /> },
  { name: 'My Stakes', component: (props) => <MyStakes {...props} /> },
];

export const DevelopmentComponent = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pt-[140px] max-md:relative sm:px-8">
      <div className="relative w-full bg-black/40 p-4 pb-4 sm:p-6">
        <Link href="/phase2">
          <Image
            src="/static/images/back.png"
            height={200}
            width={200}
            alt="Back Button"
            className="absolute left-[-20px] top-1/2 w-[60px] -translate-y-1/2"
          />
        </Link>
        <Tab.Group>
          <Tab.List className="flex justify-center space-x-6 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  cn(
                    'btn w-[150px]',
                    selected
                      ? 'border-smolBrown bg-smolBrownAlternative outline-none'
                      : 'bg-smolBrown',
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <div className="ml-1 pt-1 text-xs text-center tracking-tight">
            <ClientOnly fallback={<p>$BONES: ... $BONES</p>}>
              $BONES: {parseFloat(formatEther(data?.bonesBalance ?? '0')).toFixed(0)} $BONES
            </ClientOnly>
          </div>
          <Tab.Panels className="mt-2">
            {tabs.map((tab, idx) => (
              <Tab.Panel key={idx} className="p-3 pb-0">
                {tab.component({
                  bonesBalance: data?.bonesBalance,
                  bonesStaked: data?.bonesStaked,
                  refetchUserStake,
                })}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};
