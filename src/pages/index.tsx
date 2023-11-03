import Head from 'next/head';
import { useEffect, useState } from 'react';

import { trpc } from '~/utils/trpc';
import { useAuth } from '~/contexts/auth';
import ArticlesList from '~/components/ArticlesList';

export default function HomePage() {
  const { currentUser } = useAuth();

  const [activeTag, setActiveTag] = useState<string>();
  const [activeFeed, setActiveFeed] = useState<'global' | 'tag' | 'user'>(
    currentUser ? 'user' : 'global',
  );

  useEffect(() => {
    if (currentUser) {
      setActiveFeed('user');
    } else {
      setActiveFeed('global');
    }
  }, [currentUser]);

  const { data: popularTags } = trpc.tag.getPopularTags.useQuery();

  const { data: globalFeed, refetch: refetchGlobalFeed } =
    trpc.article.listArticles.useQuery({
      tag: activeTag,
    });

  const { data: userFeed, refetch: refetchUserFeed } =
    trpc.article.getUserFeed.useQuery();

  const onTagClick = (tag: string) => {
    setActiveTag(tag);
    setActiveFeed('tag');
    refetchGlobalFeed();
  };

  const onUserFeedClick = () => {
    refetchUserFeed();
    setActiveFeed('user');
  };

  const onGlobalFeedClick = () => {
    refetchGlobalFeed();
    setActiveTag(undefined);
    setActiveFeed('global');
  };

  const articles = activeFeed === 'user' ? userFeed : globalFeed;

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
          <h3 className="text-2xl font-light">
            A place to share your knowledge
          </h3>
        </div>
      )}
      <div className="mx-auto mt-8 flex max-w-[1180px] justify-between px-5">
        <div className="grow">
          <div>
            {currentUser && (
              <button
                onClick={onUserFeedClick}
                className={`relative border-b-2 px-4 py-2 ${
                  activeFeed === 'user'
                    ? 'border-green-550 text-green-550'
                    : 'border-transparent text-[#AAAAAA]'
                }`}
              >
                Your Feed
              </button>
            )}
            <button
              onClick={onGlobalFeedClick}
              className={`relative border-b-2 px-4 py-2 ${
                activeFeed === 'global'
                  ? 'border-green-550 text-green-550'
                  : 'border-transparent text-[#AAAAAA]'
              }`}
            >
              Global Feed
            </button>
            {activeFeed === 'tag' && (
              <button className="relative border-b-2 border-green-550 px-4 py-2 text-green-550">
                #{activeTag}
              </button>
            )}
            <div className="mt-[-1.5px] border-b border-black border-opacity-10" />
          </div>
          {articles && (
            <ArticlesList className="mt-[-1px] grow" articles={articles} />
          )}
        </div>
        <div className="ml-8 w-full max-w-[255px] self-start rounded bg-[#F3F3F3] px-[10px] pb-[10px] pt-[5px]">
          <p>Popular Tags</p>
          {popularTags && (
            <ul className="mt-1 flex flex-wrap gap-[2px]">
              {popularTags.map((tag) => (
                <li
                  className="cursor-pointer rounded-full bg-[#687077] px-2 py-[2px] text-[13px] text-white"
                  onClick={() => onTagClick(tag)}
                  key={tag}
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
