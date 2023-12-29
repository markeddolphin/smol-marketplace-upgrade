import { CustomizeComponent } from '@components/phase2/customize';
import { NextPage } from 'next';

const Customize: NextPage = () => {
  return (
    <div className="relative min-h-screen bg-[url('/static/images/phase2/caves.gif')] bg-cover bg-center">
      <CustomizeComponent />
    </div>
  );
};

export async function getStaticProps() {
  return { props: { title: 'Smol Age | Customize' } };
}

export default Customize;
