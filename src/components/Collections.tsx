import Image from 'next/image';
import Link from 'next/link';

const collections = [
  {
    name: 'Smol Age Neandersmols',
    link: 'https://trove.treasure.lol/collection/neandersmols',
    imageUrl: '/static/images/collections/neandersmol.png',
  },
  {
    name: 'Smol Age Animals',
    link: 'https://trove.treasure.lol/collection/smol-age-animals',
    imageUrl: '/static/images/collections/animal.png',
  },
  {
    name: 'Smol Age Consumables',
    link: 'https://trove.treasure.lol/collection/smol-age-consumables',
    imageUrl: '/static/images/collections/consumable.png',
  }
];

export const Collections = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <h2
        id="collections"
        className="mx-auto mb-16 scroll-mt-20 text-4xl text-smolBrown md:text-6xl"
      >
        COLLECTIONS
      </h2>
      <div className="mx-auto flex flex-col items-center md:flex-row justify-center gap-14 text-smolBrow">
        {collections.map((collection) => (
          <Link key={collection.name} href={collection.link} target="_blank" rel="noopener noreferrer" className='max-w-[200px]'>
            <Image
              width={200}
              height={200}
              className="mx-auto rounded-full"
              src={collection.imageUrl}
              alt={collection.name}
            />
            <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">
              {collection.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};
