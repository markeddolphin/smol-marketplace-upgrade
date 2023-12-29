import Image from 'next/image';
import Link from 'next/link';

import { Job } from '@model/model';

export const jobs: Job[] = [
  { name: 'Digging', url: 'digging', image: '/static/images/phase2/jobs/digging.png', id: 0 },
  { name: 'Foraging', url: 'foraging', image: '/static/images/phase2/jobs/foraging.png', id: 1 },
  { name: 'Mining', url: 'mining', image: '/static/images/phase2/jobs/mining.png', id: 2 },
];

export const LaborComponent = () => {
  return (
    <div className="relative flex min-h-screen bg-[url('/static/images/phase2/labor-grounds.gif')] bg-cover bg-center max-xs:overflow-x-scroll">
      <div className="absolute left-1/2 top-[55%] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2">
        <div className="mb-10 bg-black/60 p-12 rounded-2xl">
          <Link href="/phase2">
            <Image
              src="/static/images/back.png"
              height={200}
              width={200}
              alt="Back Button"
              className="absolute left-[-30px] top-1/2 w-[60px] -translate-y-1/2"
            />
          </Link>
          <h2 className="pb-6 text-center text-base font-bold uppercase tracking-widest text-white">
            Choose a job
          </h2>
          <div className="grid max-h-[45vh] w-full grid-cols-1 overflow-y-scroll xs:grid-cols-2 sm:grid-cols-3 sm:overflow-hidden">
            {jobs.map((job) => (
              <Link
                href={`/phase2/labor-grounds/${job.url}`}
                key={job.name}
                className="flex flex-col items-center gap-2 p-2"
              >
                <>
                  <Image
                    src={job.image}
                    height={200}
                    width={200}
                    alt={job.name}
                    className="aspect-square"
                  />
                  <div className="mt-2 w-full max-w-[180px] border-4 rounded-xl border-smolBrownLight bg-smolBrown px-6 py-3 text-center text-xs uppercase">
                    {job.name}
                  </div>
                </>
              </Link>
            ))}
          </div>
        </div>
        <Link href="/phase2/shop" className="mx-auto flex justify-center text-xs uppercase">
          <Image
            src={'/static/images/phase2/go-to-shop.png'}
            height={200}
            width={256}
            alt={'Go to shop'}
            className="hover:drop-shadow-[0_0px_25px_rgba(255,255,255,0.8)]"
          />
        </Link>
      </div>
    </div>
  );
};
