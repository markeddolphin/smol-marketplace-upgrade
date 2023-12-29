import Image from 'next/image';
import Link from 'next/link';

import { Collection } from '@model/model';
import { ANIMALS, ARBITRUM, CONSUMABLES, SMOL_AGE_ADDRESS } from '@config';
import { useNetwork } from 'wagmi';
import { useMemo } from 'react';

// export const collections: Collection[] = [
//   { name: 'Smol Age Neandersmols', url: 'neandersmol', image: '/static/images/collections/neandersmol.png', id: 0 },
//   { name: 'Smol Age Animals', url: 'animal', image: '/static/images/collections/animal.png', id: 1 },
//   { name: 'Smol Age Consumables', url: 'consumable', image: '/static/images/collections/consumable.png', id: 2 },
// ];

export const CollectionBoard = () => {
  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;

  const collections = [
    {
      name: 'Smol Age Neandersmols',
      image: '/static/images/collections/neandersmol.png',
      address: SMOL_AGE_ADDRESS[chainId],
    },
    {
      name: 'Smol Age Animals',
      image: '/static/images/collections/animal.png',
      address: ANIMALS[chainId],
    },
    {
      name: 'Smol Age Consumables',
      image: '/static/images/collections/consumable.png',
      address: CONSUMABLES[chainId],
    },
  ];

  return (
    <div className="relative flex min-h-screen bg-[url('/static/images/marketplace_landing.png')] bg-cover bg-center max-xs:overflow-x-scroll">
      <div className="collection-board absolute left-1/2 top-[55%] max-w-4xl -translate-x-1/2 -translate-y-1/2">
        <div className="mb-10 rounded-2xl bg-black/60 p-12">
          <Link href="/">
            <Image
              src="/static/images/back.png"
              height={200}
              width={200}
              alt="Back Button"
              className="absolute left-[-30px] top-1/2 w-[60px] -translate-y-1/2"
            />
          </Link>
          <h2 className="pb-6 text-center text-base font-bold uppercase tracking-widest text-white">
            Choose a collection
          </h2>
          <div className="grid max-h-[45vh] w-full grid-cols-1 overflow-y-scroll xs:grid-cols-2 sm:grid-cols-3 sm:overflow-hidden">
            {collections.map((collection) => (
              <Link
                href={`/marketplace/${collection.address}`}
                key={collection.address}
                className="flex flex-col items-center gap-2 p-2"
              >
                <div className="div-contain rounded-xl border-4 border-smolBrownLight">
                  <Image
                    src={collection.image}
                    height={200}
                    width={200}
                    alt={collection.name}
                    className="aspect-square"
                  />
                </div>
                {/* <div className="mt-2 w-full max-w-[180px] border-4 rounded-xl border-smolBrownLight bg-smolBrown px-6 py-3 text-center text-xs uppercase">
                    <span>{collection.name}</span>
                </div> */}
                <span className="collection-name text-center text-xs">{collection.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
