import Head from 'next/head';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';

import { trpc } from '~/utils/trpc';
import { NextPageWithLayout } from '~/pages/_app';
import ArticlesList from '~/components/ArticlesList';
import ProfilePageLayout from '~/components/ProfilePageLayout';

const ProfilePage: NextPageWithLayout = () => {
  const router = useRouter();
  const username = (router.query.username as string).slice(1); // remove @ from username param

  const { data: user } = trpc.user.getByUsername.useQuery(username);

  const {
    data: articles,
    isLoading: isFetchingArticles,
    isRefetching: isRefetchingArticles,
  } = trpc.article.listArticles.useQuery(
    {
      authorId: user?.id,
    },
    { refetchOnWindowFocus: false },
  );

  if (!user) return null;

  return (
    <>
      <Head>
        <title>@{user.username} - Conduit</title>
      </Head>
      <ArticlesList
        className="mx-auto max-w-[950px] px-5"
        articles={articles}
        isLoading={isFetchingArticles || isRefetchingArticles}
      />
    </>
  );
};

export default ProfilePage;

ProfilePage.getLayout = (page: ReactElement) => (
  <>
    <ProfilePageLayout />
    {page}
  </>
);
