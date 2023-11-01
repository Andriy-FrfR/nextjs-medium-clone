/* eslint-disable @next/next/no-img-element */
import { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import Button from '~/components/Button';
import { useAuth } from '~/contexts/auth';
import PenIcon from '~/assets/svg/pen.svg';
import PlusIcon from '~/assets/svg/plus.svg';
import TrashIcon from '~/assets/svg/trash.svg';
import { RouterOutputs, trpc } from '~/utils/trpc';
import userAvatarPlaceholderImage from '~/assets/images/user-avatar-placeholder.jpeg';

export default function ArticlePage() {
  const router = useRouter();
  const articleSlug = (router.query.slug as string[]).join('/');

  const trpcUtils = trpc.useUtils();

  const { data: article } = trpc.article.getBySlug.useQuery(articleSlug);

  const { mutate: deleteArticle, isLoading: isDeleting } =
    trpc.article.delete.useMutation({
      onSuccess: () => router.replace('/'),
      onError: () => toast('Something went wrong', { type: 'error' }),
    });

  const onDeleteArticle = () => {
    if (!article) return;
    deleteArticle(article.id);
  };

  const { mutate: changeFollowStatus, isLoading: isChangingFollowStatus } =
    trpc.user.changeUserFollowingStatus.useMutation({
      onSuccess: () => trpcUtils.article.getBySlug.invalidate(),
      onError: () => toast('Something went wrong', { type: 'error' }),
    });

  const onChangeFollowStatus = () => {
    if (!article) return;
    changeFollowStatus(article.authorId);
  };

  if (!article) return null;

  return (
    <>
      <Head>
        <title>{article?.title} - Conduit</title>
      </Head>
      <div className="bg-zink-750">
        <div className="mx-auto max-w-[1150px] px-5 py-8">
          <h1 className="text-[44px] font-semibold text-white">
            {article?.title}
          </h1>
          <ArticleInfo
            className="mt-8"
            article={article}
            onDeleteArticle={onDeleteArticle}
            isDeleting={isDeleting}
            onChangeFollowStatus={onChangeFollowStatus}
            isChangingFollowStatus={isChangingFollowStatus}
          />
        </div>
      </div>
      <div className="mx-auto mb-10 mt-8 flex max-w-[1150px] flex-col px-5">
        <p className="text-[19px] leading-7 text-gray-900">{article?.body}</p>
        <div className="mt-4 border-t border-black border-opacity-10" />
        <ArticleInfo
          className="mt-4 self-center"
          article={article}
          onDeleteArticle={onDeleteArticle}
          isDeleting={isDeleting}
          onChangeFollowStatus={onChangeFollowStatus}
          isChangingFollowStatus={isChangingFollowStatus}
          showAuthorUsernameGreen
        />
      </div>
    </>
  );
}

type ArticleInfoProps = {
  onDeleteArticle: () => void;
  isDeleting: boolean;
  onChangeFollowStatus: () => void;
  isChangingFollowStatus: boolean;
  article?: RouterOutputs['article']['getBySlug'];
  className?: string;
  showAuthorUsernameGreen?: boolean;
};

const ArticleInfo: FC<ArticleInfoProps> = ({
  article,
  className,
  onDeleteArticle,
  isDeleting,
  onChangeFollowStatus,
  isChangingFollowStatus,
  showAuthorUsernameGreen,
}) => {
  const { currentUser } = useAuth();

  return (
    <div className={`flex items-center ${className}`}>
      <Link href={`/@${article?.author.username}`}>
        <img
          src={
            article?.author.image
              ? article.author.image
              : userAvatarPlaceholderImage.src
          }
          className="h-8 w-8 rounded-full"
          alt="Author image"
        />
      </Link>
      <div className="ml-2">
        <Link
          href={`/@${article?.author.username}`}
          className={`font-medium leading-4 ${
            showAuthorUsernameGreen
              ? 'text-green-550 hover:text-green-650 hover:underline'
              : 'text-white hover:text-gray-200 hover:underline'
          }`}
        >
          {article?.author.username}
        </Link>
        <p className="text-[13px] font-thin leading-4 text-gray-400">
          {article?.createdAt?.toDateString()}
        </p>
      </div>
      {currentUser?.id === article?.authorId ? (
        <>
          <Button
            asLink
            href={`/editor/${article?.slug}`}
            className="ml-6"
            variantProps={{ size: 'sm', variant: 'secondary' }}
          >
            <PenIcon className="mr-[3px] h-[11px]" /> Edit Article
          </Button>
          <Button
            onClick={onDeleteArticle}
            disabled={isDeleting}
            className="ml-1"
            variantProps={{
              size: 'sm',
              variant: 'danger-2',
              disabled: isDeleting,
            }}
          >
            <TrashIcon className="mr-[3px] h-[11px]" /> Delete Article
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={onChangeFollowStatus}
            disabled={isChangingFollowStatus}
            className="ml-6"
            variantProps={{
              size: 'sm',
              variant: article?.author.isFollowing ? 'tertiary' : 'secondary',
              disabled: isChangingFollowStatus,
            }}
          >
            <PlusIcon className="mr-[3px] h-[14px]" />{' '}
            {article?.author.isFollowing ? 'Unfollow' : 'Follow'}{' '}
            {article?.author.username}
          </Button>
          <Button
            className="ml-1"
            variantProps={{ size: 'sm', variant: 'primary-outline' }}
          >
            <TrashIcon className="mr-[3px] h-[11px]" /> Favorite Article
          </Button>
        </>
      )}
    </div>
  );
};
