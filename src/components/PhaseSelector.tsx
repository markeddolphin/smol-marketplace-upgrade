import { cn } from '@utils';
import Image from 'next/image';
import Link from 'next/link';

export const PhaseSelector = ({ className }: { className?: string }) => {
  return (
    <div className={cn(className ?? '', 'bg-black/60')}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:gap-x-6 md:space-y-0">
        <Link href="/phase1" key="phase 1" className="relative opacity-75 hover:opacity-100">
          <Image
            src="/static/images/phase1.png"
            alt="Phase I"
            height={300}
            width={300}
            draggable={false}
            className="max-h-[300px] w-full object-cover object-center"
          />
          <p className="absolute top-1 left-1 right-1 leading-[0.6rem] text-[0.47rem] text-black">Earn Common Sense in the Common Sense School and accrue Bones in the Boneyard in Phase I.</p>
          <h3 className="absolute whitespace-nowrap transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm uppercase bg-red-800 border-[6px] border-black text-black p-2">
            Phase I Closed
          </h3>
        </Link>

        <Link href="/play" key="phase 2" className="group relative opacity-75 hover:opacity-100">
          <Image
            src="/static/images/phase2.gif"
            alt="Phase II"
            height={300}
            width={300}
            draggable={false}
            className="max-h-[300px] w-full object-cover object-center"
          />
          <p className='absolute top-1 left-1 right-1 leading-[0.6rem] text-[0.47rem] text-white'>
            Develop a Primary Skill, Complete Jobs for Consumables, and accrue more Bones in Phase II.
          </p>
          <h3 className="absolute whitespace-nowrap transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm uppercase bg-yellow-500 border-[6px] border-black text-black p-2">
            Play Phase II
          </h3>
        </Link>
      </div>
    </div>
  );
};
