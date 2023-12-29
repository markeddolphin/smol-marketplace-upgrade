import Link from 'next/link';
import { FaDiscord, FaTwitter } from 'react-icons/fa';

import { memo, useState } from 'react';
import { Logo } from './Logo';
import { useLockBodyScroll } from 'react-use';

const navigation: { name: string; href: string; external?: boolean }[] = [
  { name: 'Team', href: '#team' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Road Map', href: '#roadmap' },
  { name: 'PLAY', href: '/play' },
  { name: 'Marketplace', href: '/marketplace' },

];

export const LandingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const genericHamburgerLine = `h-[2px] w-6 my-1 bg-white transition ease transform duration-300`;

  const [locked, setLocked] = useState(false);
  useLockBodyScroll(locked);

  const toggleMenu = () => {
    if (isOpen === false) {
      setIsOpen(true);
      setLocked(true);
    } else {
      setIsOpen(false);
      setLocked(false);
    }
  };

  const Socials = memo(() => (
    <>
      <a
        className="flex items-center gap-2 text-white"
        href="https://discord.gg/8nsF6KbKK7"
        target="_blank"
        rel="noreferrer noopener"
      >
        <FaDiscord color="white" size="24px" className="hover:fill-gray-300" />
        Discord
      </a>
      <a
        className="flex items-center gap-2 text-white"
        href="https://twitter.com/SmolAge_NFT"
        target="_blank"
        rel="noreferrer noopener"
      >
        <FaTwitter color="white" size="24px" className="hover:fill-gray-300" />
        Twitter
      </a>
    </>
  ));

  return (
    <header className="z-20 flex w-full items-center justify-between p-2 px-8 text-xs sm:py-[1rem] sm:px-[3rem] lg:justify-start lg:space-x-10">
      <nav className="relative flex w-full items-center justify-between lg:py-8">
        <div className="hidden gap-8 lg:flex">
          <Socials />
        </div>
        <div className="z-30 flex flex-1 items-center justify-between lg:justify-center">
          <div className="flex items-center lg:absolute lg:left-1/2 lg:w-auto lg:-translate-x-1/2">
            <Logo />
          </div>

          <div
            onClick={toggleMenu}
            className="relative z-10 flex cursor-pointer flex-col items-center justify-center p-2 lg:hidden"
          >
            <div
              className={`${genericHamburgerLine} ${isOpen ? 'translate-y-[5px] rotate-45' : ''}`}
            />
            <div
              className={`${genericHamburgerLine} ${isOpen ? '-translate-y-[5px] -rotate-45' : ''}`}
            />
          </div>
        </div>
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          <div className="hidden text-xs lg:mr-4 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                scroll={false}
                className="items-center px-4 pt-0.5 tracking-wider text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div
        className={`${
          isOpen
            ? 'absolute inset-0 z-[10] h-screen animate-[fadeInSmooth_1s_ease-in-out] bg-gray-900 transition-all md:hidden'
            : 'hidden'
        }`}
      >
        <div className="pt-[8rem] pl-[3rem] pb-6 text-left text-base capitalize">
          <div className="mt-4 space-y-2">
            {navigation.map((item) => (
              <Link
                onClick={() => setIsOpen(false)}
                key={item.name}
                href={item.href}
                scroll={false}
                className="block cursor-pointer py-2"
              >
                {item.name}
              </Link>
            ))}
            <div className="space-y-6 pt-2 lg:hidden">
              <Socials />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
