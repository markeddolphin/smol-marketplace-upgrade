import { CavesComponent } from '@components/phase2/caves';
import { NextPage } from 'next';

const Caves: NextPage = () => {
  return (
    <div className="relative min-h-screen bg-[url('/static/images/phase2/caves.gif')] bg-cover bg-center">
      <CavesComponent />
    </div>
  );
};

export async function getStaticProps() {
  return { props: { title: 'Smol Age | Caves' } };
}

export default Caves;
