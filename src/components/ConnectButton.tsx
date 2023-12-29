import { WalletModal } from '@/components/WalletModal';
import { ARBITRUM, POLYGON_MUMBAI, POLYGON } from '@config';
import { useIsMounted } from '@hooks/useIsMounted';
import { shortAddr } from '@utils';
import Image from 'next/image';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { polygonMumbai } from 'wagmi/dist/chains';

const ConnectButton = () => {
  const isMounted = useIsMounted();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { disconnect } = useDisconnect();

  if (!isMounted) return null;

  return (
    <>
      {address ? (
        <>
          {chain.unsupported ? (
            <button
              // onClick={() => switchNetwork(POLYGON_MUMBAI)}
              // onClick={() => switchNetwork(ARBITRUM)}
              onClick={() => switchNetwork(POLYGON)}
              className="relative h-[75px] w-[220px] md:h-[90px] md:w-[220px]"
            >
              <Image
                src="/static/images/buttons/connect_btn.png"
                alt="Wrong network"
                width={480}
                height={222}
                className="h-[75px] md:h-[90px]"
              />
              <p className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 uppercase text-gray-200">
                Switch Network
              </p>
            </button>
          ) : (
            <button
              onClick={() => disconnect()}
              className="relative h-[75px] w-[220px] md:h-[90px] md:w-[220px]"
            >
              <Image
                src="/static/images/buttons/connect_btn.png"
                alt="Wrong network"
                width={480}
                height={222}
                className="h-[75px] md:h-[90px]"
              />
              <p className="absolute top-[53%] left-1/2 -translate-x-1/2 -translate-y-1/2 uppercase text-gray-200 max-sm:text-[0.65rem]">
                {shortAddr(address)}
              </p>
            </button>
          )}
        </>
      ) : (
        <WalletModal className="relative h-[75px] w-[220px] md:h-[90px] md:w-[220px]" />
      )}
    </>
  );
};

export default ConnectButton;
