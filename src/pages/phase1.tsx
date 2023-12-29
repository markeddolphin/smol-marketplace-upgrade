import { NextPage } from 'next';
import PlayComponent from '../components/PlayComponent';

const Phase1: NextPage = () => {
  return <PlayComponent />;
};

export default Phase1;

export async function getStaticProps() {
  return { props: { title: "Smol Age | Phase1" } };
}