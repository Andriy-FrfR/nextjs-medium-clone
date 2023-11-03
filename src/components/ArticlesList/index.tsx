/* eslint-disable @next/next/no-img-element */
import dayjs from 'dayjs';
import { FC } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

import Button from '~/components/Button';
import HeartIcon from '~/assets/svg/heart.svg';
import { RouterOutputs, trpc } from '~/utils/trpc';
import userAvatarPlaceholderImage from '~/assets/images/user-avatar-placeholder.jpeg';

type Props = {
  articles: RouterOutputs['article']['getArticles'];
  className?: string;
};

const ArticlesList: FC<Props> = ({ articles, className }) => {
  return (
    <ul className={`flex flex-col ${className}`}>
      {articles.map((article) => (
        <ListItem key={article.id} article={article} />
      ))}
    </ul>
  );
};

export default ArticlesList;

type ListItemProps = {
  article: RouterOutputs['article']['getArticles'][number];
};

const ListItem: FC<ListItemProps> = ({ article }) => {
  const trpcUtils = trpc.useUtils();

  const {
    mutate: changeFavoritedStatus,
    isLoading: isChangingFavoritedStatus,
  } = trpc.article.changeArticleFavoritedStatus.useMutation({
    onSuccess: () => trpcUtils.article.getArticles.invalidate(),
    onError: () => toast('Something went wrong', { type: 'error' }),
  });

  const handleChangeFavoritedStatus = () => {
    changeFavoritedStatus(article.id);
  };

  return (
    <li
      className="border-t border-black border-opacity-10 py-6"
      key={article.id}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
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
          <div className="ml-2 flex flex-col">
            <Link
              href={`/@${article?.author.username}`}
              className="font-medium leading-4 text-green-550 hover:text-green-650 hover:underline"
            >
              {article?.author.username}
            </Link>
            <p className="text-[13px] font-light leading-4 text-gray-400">
              {dayjs(article?.createdAt).format('MMMM D, YYYY')}
            </p>
          </div>
        </div>
        <Button
          onClick={handleChangeFavoritedStatus}
          disabled={isChangingFavoritedStatus}
          variantProps={{
            size: 'sm',
            variant: article.isFavorited ? 'primary' : 'primary-outline',
            disabled: isChangingFavoritedStatus,
          }}
        >
          <HeartIcon className="mr-[3px] h-3" />
          {article._count.favoritedBy}
        </Button>
      </div>
      <Link className="inline-block" href={`/article/${article.slug}`}>
        <h4 className="mt-4 break-all text-2xl font-semibold">
          {article.title}
        </h4>
        <p className="break-all font-light leading-5 text-gray-400">
          {article.description}
        </p>
      </Link>
      <div className="mt-4 flex justify-between">
        <Link
          className="text-[13px] font-light text-gray-400"
          href={`/article/${article.slug}`}
        >
          Read more...
        </Link>
        {article.tags.length > 0 && (
          <Link href={`/article/${article.slug}`}>
            <ul className="flex gap-x-1">
              {article.tags.map((tag) => (
                <li
                  className="rounded-full border border-gray-300 px-2 text-[13px] text-gray-400"
                  key={tag.id}
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          </Link>
        )}
      </div>
    </li>
  );
};
