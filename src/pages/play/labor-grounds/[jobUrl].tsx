
import { JobBoard } from '@components/phase2/labor-grounds/JobBoard';
import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';

const Job: NextPage = () => {
  const router = useRouter();
  const {jobUrl} = router.query;
  return <JobBoard jobUrl={jobUrl as string} />;
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

export default Job;
