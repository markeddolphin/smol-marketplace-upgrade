import Link from 'next/link';
import { useState } from 'react';
import { useLockBodyScroll } from 'react-use';
import ConnectButton from './ConnectButton';
import { Logo } from './Logo';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const genericHamburgerLine = `h-[2px] w-6 my-1 bg-white transition ease transform duration-300`;

  const navigation: { name: string; href: string; external?: boolean }[] = [
    {
      name: 'Docs',
      href: 'https://smol-age.notion.site/Smol-Age-Wiki-8fe6785c45bf4d5cab2eed57759e6d27',
      external: true,
    },
    { name: 'Trove', href: 'https://trove.treasure.lol/collection/neandersmols', external: true },
  ];

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

  return (
    <header className="absolute z-20 flex w-full items-center justify-between p-2 px-8 text-xs sm:py-[1rem] sm:px-[3rem] md:justify-start md:space-x-10">
      <nav className="relative flex w-full items-center justify-between">
        <div className="z-30 flex flex-1 items-center justify-between">
          <Logo />

          <div
            onClick={toggleMenu}
            className="relative z-10 flex cursor-pointer flex-col items-center justify-center p-2 md:hidden"
          >
            <div
              className={`${genericHamburgerLine} ${isOpen ? 'translate-y-[5px] rotate-45' : ''}`}
            />
            <div
              className={`${genericHamburgerLine} ${isOpen ? '-translate-y-[5px] -rotate-45' : ''}`}
            />
          </div>
        </div>
        <div className="hidden md:flex md:items-center md:space-x-8">
          <div className="hidden text-xs md:mr-4 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                scroll={false}
                target={item.external ? '_blank' : ''}
                rel={item.external ? 'noopener noreferrer' : ''}
                onClick={() => setLocked(false)}
                className="items-center px-4 pt-0.5 tracking-wider text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <ConnectButton />
        </div>
      </nav>

      <div
        className={`${isOpen
            ? 'absolute inset-0 z-[10] h-screen animate-[fadeInSmooth_1s_ease-in-out] bg-gray-900 transition-all md:hidden'
            : 'hidden'
          }`}
      >
        <div className="pt-[8rem] pl-[3rem] pb-6 text-left text-base capitalize">
          <div className="mt-4 space-y-2">
            {navigation.map((item) => (
              <Link
                onClick={() => {
                  setLocked(false);
                  setIsOpen(false);
                }}
                key={item.name}
                href={item.href}
                scroll={false}
                className="block cursor-pointer py-2"
              >
                {item.name}
              </Link>
            ))}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};
