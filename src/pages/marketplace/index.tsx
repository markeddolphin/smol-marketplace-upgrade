
import { NextPage } from 'next';
import { CollectionBoard } from '@components/marketplace/CollectionBoard';

const Marketplace: NextPage = () => {
  return (
    <div className="relative min-h-screen bg-[url('/static/images/marketplace_landing.png')] bg-cover bg-center">
      <CollectionBoard />
    </div>
  );
};

export async function getStaticProps() {
  return { props: { title: 'Smol Age | Marketplace' } };
}

export default Marketplace;
