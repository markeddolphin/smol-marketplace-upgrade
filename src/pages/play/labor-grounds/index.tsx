import ClientOnly from '@components/ClientOnly';
import { LaborComponent } from '@components/phase2/labor-grounds';
import { NextPage } from 'next';

const LaborGrounds: NextPage = () => {
  return (
    <ClientOnly>
      <LaborComponent />
    </ClientOnly>
  );
};

export async function getStaticProps() {
  return { props: { title: 'Smol Age | Labor Grounds' } };
}

export default LaborGrounds;
