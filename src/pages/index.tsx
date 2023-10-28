import Head from 'next/head';

import { useAuth } from '~/contexts/auth';

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <>
      <Head>
        <title>Home - Conduit</title>
      </Head>
      {!currentUser && (
        <div className="bg-green-550 py-8 text-center text-white shadow-[inset_0_8px_8px_-8px_rgba(0,0,0,0.3),inset_0_-8px_8px_-8px_rgba(0,0,0,0.3)]">
          <h1 className="font-titilium text-[56px] font-bold [text-shadow:0px_1px_3px_rgba(0,0,0,0.3)]">
            conduit
          </h1>
          <h3 className="text-2xl font-thin">
            A place to share your knowledge
          </h3>
        </div>
      )}
    </>
  );
}
