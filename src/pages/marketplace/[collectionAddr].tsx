import { NeanderExplorer } from '@components/marketplace/NeanderExplorer';
import { AnimalExplorer } from '@components/marketplace/AnimalExplorer';
import { ConsumableExplorer } from '@components/marketplace/ConsumableExplorer';
import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ANIMALS, ARBITRUM, CONSUMABLES, SMOL_AGE_ADDRESS } from '@config';
import { useNetwork } from 'wagmi';


export default function CollectionAdd() {
    const router = useRouter();
    const {collectionAddr} = router.query;

    const { chain } = useNetwork();
    const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
    // <div className="relative min-h-screen bg-[url('/static/images/marketplace_landing.png')] bg-cover bg-center">
        return collectionAddr == ANIMALS[chainId] ? <AnimalExplorer /> : collectionAddr == CONSUMABLES[chainId] ? <ConsumableExplorer /> : <NeanderExplorer />;
    // </div>
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

  return {
      paths: [], //indicates that no page needs be created at build time
      fallback: 'blocking' //indicates the type of fallback
  }
}

export async function getStaticProps() {
  return { props: { title: 'Smol Age | Job' } };
}