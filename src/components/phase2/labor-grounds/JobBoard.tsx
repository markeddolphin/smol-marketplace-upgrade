import { Tab } from '@headlessui/react';
import { cn } from '@utils';
import { useMemo } from 'react';
import { jobs } from '.';
import Image from 'next/image';
import Link from 'next/link';
import { MyStakes } from './MyStakes';
import { Stake } from './Stake';
import { InventoryIcon } from '../InventoryIcon';
import { useAccount } from 'wagmi';

export const JobBoard = ({ jobUrl }: { jobUrl: string }) => {
  const { address } = useAccount();
  const job = useMemo(() => jobs.find((job) => job.url == jobUrl), [jobs, jobUrl]);
  const tabs = [
    { name: 'Stake', component: <Stake job={job} /> },
    { name: 'My Stakes', component: <MyStakes job={job} /> },
  ];
  return (
    <div className="relative min-h-screen bg-[url('/static/images/phase2/labor-grounds.gif')] bg-cover bg-center">
      <div className="pt-[7.5rem]" />
      {address && (
        <div className="ml-auto mr-8 md:mr-16 flex items-end justify-end gap-6 pb-2">
          <InventoryIcon />
        </div>
      )}
      <div className="mx-auto max-w-4xl px-4 py-6 pt-[40px] max-md:relative sm:px-8">
        <div className="relative w-full bg-black/40 p-4 pb-4 sm:p-6 rounded-xl">
          <Link href="/phase2/labor-grounds">
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
            <Tab.Panels className="mt-2">
              {tabs.map((tab, idx) => (
                <Tab.Panel key={idx} className="p-3 pb-0">
                  {tab.component}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};
