import { ShopComponent } from '@components/phase2/shop/Shop';
import { NextPage } from 'next';

const Shop: NextPage = () => {
  return <ShopComponent />;
};

export async function getStaticProps() {
  return { props: { title: 'Smol Age | Shop' } };
}

export default Shop;
