import { Dialog, Transition } from '@headlessui/react';
import { useIsMounted } from '@hooks/useIsMounted';
import { cn } from '@utils';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { useConnect } from 'wagmi';

const getWalletUrl = (wallet: string) => {
  if (wallet === 'injected' || wallet === "metaMask") {
    return {
      image: '/static/images/wallets/metamask.svg',
      title: 'MetaMask',
      description: 'Connect to your MetaMask Wallet',
    };
  }
  if (wallet === 'walletConnect' || wallet === "walletConnectLegacy") {
    return {
      image: '/static/images/wallets/walletconnect.svg',
      title: 'WalletConnect',
      description: 'Scan with WalletConnect to connect',
    };
  }
  if (wallet === 'coinbaseWallet') {
    return {
      image: '/static/images/wallets/coinbase.svg',
      title: 'Coinbase Wallet',
      description: 'Scan with Coinbase Wallet to connect',
    };
  }
};

export const WalletModal = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { connect, connectors } = useConnect();
  const isMounted = useIsMounted();

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <>
      <button onClick={openModal} className={cn(className, "relative")}>
        <Image
          src={'/static/images/buttons/connect_btn.png'}
          alt="Connect"
          width={480}
          height={222}
          className="h-[75px] md:h-[90px]"
        />
        <Image
          src={'/static/images/buttons/connect_txt.png'}
          alt="<connect>"
          className='absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 uppercase text-black max-xs:text-xs'
          width={130}
          height={200}
        />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-xl bg-white p-3">
                  <div className="flex w-full flex-col justify-center gap-3">
                    {connectors.map((connector) => {
                      const { image, title, description } = getWalletUrl(connector.id);
                      return (
                        <div
                          className="mx-auto w-full border-t-2 border-opacity-70 pt-3 first:border-none first:pt-0"
                          key={connector.id}
                        >
                          <button
                            disabled={isMounted ? !connector.ready : false}
                            onClick={() => connect({ connector })}
                            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl py-2 hover:bg-gray-200"
                          >
                            <Image
                              src={image}
                              width={45}
                              height={45}
                              alt={connector.name}
                              className="object-contain py-2"
                            />
                            <h3 className="text-xl text-black">{title}</h3>
                            <p className="max-w-[380px] py-1 text-center text-gray-500">
                              {description}
                            </p>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
