import { client } from '@/client';
import Layout from '@components/Layout';
import { GroundsModal } from '@components/modals/GroundsModal';
import { InventoryBox } from '@components/modals/InventoryBox';
import { Navigation } from '@components/Navigation';
import WithWallet from '@components/WithWallet';
import WithWalletPhase2 from '@components/WithWalletPhase2';
import Header from '@header';
import '@styles/index.css';
import { type AppType } from 'next/app';
import { useRouter } from 'next/router';
import { WagmiConfig } from 'wagmi';

const MyApp: AppType<{ title?: string }> = ({ Component, pageProps: { title, ...pageProps } }) => {
  const { pathname } = useRouter();
  const isHome = pathname === '/';
  const phase2 = pathname.includes('/play') || pathname.includes('/marketplace');

  return (
    <>
      <Header title={title} />
      <WagmiConfig client={client}>
        {isHome ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Navigation />
            {phase2 ? (
              <WithWalletPhase2>
                <GroundsModal />
                <InventoryBox />
                <Component {...pageProps} />
              </WithWalletPhase2>
            ) : (
              <WithWallet>
                <Component {...pageProps} />
              </WithWallet>
            )}
          </Layout>
        )}
      </WagmiConfig>
    </>
  );
};

export default MyApp;
