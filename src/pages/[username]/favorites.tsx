import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { trpc } from '~/utils/trpc';
import ArticlesList from '~/components/ArticlesList';
import ProfilePageLayout from '~/components/ProfilePageLayout';

export default function ProfilePage() {
  const router = useRouter();
  const username = (router.query.username as string).slice(1); // remove @ from username param

  const { data: user, isLoading: isFetchingUser } =
    trpc.user.getUserByUsername.useQuery(username);

  const { data: articles } = trpc.article.getArticles.useQuery({
    favoritedByUserId: user?.id,
  });

  useEffect(() => {
    if (isFetchingUser || user) return;

    router.push('/');
  }, [isFetchingUser, router, user]);

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Articles favorited by {user.username} - Conduit</title>
      </Head>
      <ProfilePageLayout user={user} />
      {articles && (
        <ArticlesList
          className="mx-auto max-w-[950px] px-5"
          articles={articles}
        />
      )}
    </>
  );
}
