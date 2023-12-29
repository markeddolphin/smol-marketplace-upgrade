import { DevelopmentComponent } from '@components/phase2/development-grounds';
import { NextPage } from 'next';

const DevelopmentGrounds: NextPage = () => {
  return (
    <div className="relative min-h-screen bg-[url('/static/images/phase2/development-grounds.gif')] bg-cover bg-center">
      <DevelopmentComponent />
    </div>
  );
};

export async function getStaticProps() {
  return { props: { title: 'Smol Age | Development Grounds' } };
}

export default DevelopmentGrounds;
