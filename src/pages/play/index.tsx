
import { Tooltip } from 'react-tooltip';
import { GroundsState } from '@components/BonesStaked';
import ClientOnly from '@components/ClientOnly';
import useBreakPoint, { WindowSize } from '@hooks/useBreakpoint';
import { useStakedInPits } from '@hooks/useStakedInPits';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const Play: NextPage = () => {
  const { percentage, open } = useStakedInPits();
  const breakPoint = useBreakPoint();

  return (
    <div className="relative min-h-screen bg-[url('/static/images/phase2/landing.gif')] bg-cover bg-center">
      <ClientOnly>
        <GroundsState percentage={percentage} open={open} />
      </ClientOnly>
      <div className="space-y-6 pt-10 max-md:relative sm:pt-[260px]">
        {breakPoint < WindowSize.MD ? (
          <>
            <Link
              href="/phase2/caves"
              id="btn-caves"
              className="mx-auto flex max-w-[350px] items-center justify-center border-[6px] border-smolBrownLight bg-smolBrown px-8 py-3 md:absolute md:left-[5%] md:top-[25%]"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white">The Caves</p>
            </Link>
            <Link
              href="/phase2/development-grounds"
              id="btn-dev-grounds"
              className="mx-auto flex max-w-[350px] items-center justify-center border-[6px] border-smolBrownLight bg-smolBrown px-8 py-3 md:absolute md:bottom-[32%] md:left-[10%]"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white">
                Development Grounds
              </p>
            </Link>
            <Link
              href="/phase2/labor-grounds"
              id="btn-labor-grounds"
              className="mx-auto flex max-w-[350px] items-center justify-center border-[6px] border-smolBrownLight bg-smolBrown px-8 py-3 md:absolute md:bottom-[30%] md:right-[10%]"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white">
                Labor Grounds
              </p>
            </Link>
            <Link
              href="/phase2/pits"
              id="btn-pits"
              className="mx-auto flex max-w-[350px] items-center justify-center border-[6px] border-smolBrownLight bg-smolBrown px-8 py-3 md:absolute md:bottom-[10%] md:left-[40%]"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white">The Pits</p>
            </Link>
            <Link
                href="/phase2/customize"
                id="btn-custom"
                className="mx-auto flex max-w-[350px] items-center justify-center border-[6px] border-smolBrownLight bg-smolBrown px-8 py-3 md:absolute md:right-[10%] md:top-[40%]"
              >
              <p className="text-xs font-bold uppercase tracking-widest text-white">Customize</p>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/phase2/caves"
              id="btn-caves"
              className="mx-auto flex max-w-[350px] items-center justify-center md:absolute md:left-[5%] md:top-[25%]"
            >
              <Image
                className="hover:drop-shadow-[0_0px_25px_rgba(255,255,255,0.8)]"
                src="/static/images/buttons/caves.png"
                alt="caves"
                width={210}
                height={100}
              />
            </Link>
            <Link
              href="/phase2/development-grounds"
              id="btn-dev-grounds"
              className="mx-auto flex max-w-[350px] items-center justify-center md:absolute md:bottom-[32%] md:left-[10%]"
            >
              <Image
                className="hover:drop-shadow-[0_0px_25px_rgba(255,255,255,0.8)]"
                src="/static/images/buttons/dev_grounds.png"
                alt="caves"
                width={250}
                height={100}
              />
            </Link>
            <Link
              href="/phase2/labor-grounds"
              id="btn-labor-grounds"
              className="mx-auto flex max-w-[350px] items-center justify-center md:absolute md:bottom-[30%] md:right-[10%]"
            >
              <Image
                className="hover:drop-shadow-[0_0px_25px_rgba(255,255,255,0.8)]"
                src="/static/images/buttons/labor_grounds.png"
                alt="caves"
                width={250}
                height={100}
              />
            </Link>
            <Link
              href="/phase2/pits"
              id="btn-pits"
              className="mx-auto flex max-w-[350px] items-center justify-center md:absolute md:bottom-[10%] md:left-[40%]"
            >
              <Image
                className="hover:drop-shadow-[0_0px_25px_rgba(255,255,255,0.8)]"
                src="/static/images/buttons/pits.png"
                alt="caves"
                width={170}
                height={100}
              />
            </Link>
            <Link
              href="/phase2/customize"
              id="btn-custom"
              className="mx-auto flex max-w-[350px] items-center justify-center md:absolute md:bottom-[50%] md:right-[8%]"
            >
              <Image
                className="hover:drop-shadow-[0_0px_25px_rgba(255,255,255,0.8)]"
                src="/static/images/buttons/custom.png"
                alt="customize"
                width={170}
                height={100}
              />
            </Link>

          </>
        )}
        <Tooltip
          anchorSelect="#btn-caves"
          place="top"
          className="max-w-[350px] leading-6"
        >
          Hibernate in the Caves for 100 days, Neandersmols collect 10 bones per day
        </Tooltip>
        <Tooltip
          anchorSelect="#btn-dev-grounds"
          place="top"
          className="max-w-[350px] leading-6"
        >
          Enter the development grounds to learn a skill.
          <br /> With great skill comes great responsibility!
        </Tooltip>
        <Tooltip
          anchorSelect="#btn-pits"
          place="top"
          className="max-w-[350px] leading-6"
        >
          Provide your bones to the Pits.
          <br /> 30% of bones must be staked to keep the grounds open.
        </Tooltip>
        <Tooltip
          anchorSelect="#btn-labor-grounds"
          place="top"
          className="max-w-[350px] leading-6"
        >
          Enter the labour grounds to look for rare items.
          <br /> Take an animal for better outcomes!
        </Tooltip>
        <Tooltip
          anchorSelect="#btn-custom"
          place="top"
          className="max-w-[350px] leading-6"
        >
          Customize your smol with addons and accessories.
        </Tooltip>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return { props: { title: 'Smol Age | Play' } };
}

export default Play;
