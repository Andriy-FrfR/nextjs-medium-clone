/* eslint-disable @next/next/no-img-element */
import { FC } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import Button from '~/components/Button';
import { useAuth } from '~/contexts/auth';
import GearIcon from '~/assets/svg/gear.svg';
import PlusIcon from '~/assets/svg/plus.svg';
import { RouterOutputs, trpc } from '~/utils/trpc';
import userAvatarPlaceholderImage from '~/assets/images/user-avatar-placeholder.jpeg';

type Props = { user: RouterOutputs['user']['getUserByUsername'] };

const ProfilePageLayout: FC<Props> = ({ user }) => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const trpcUtils = trpc.useUtils();

  const { mutate: changeFollowStatus, isLoading: isChangingFollowStatus } =
    trpc.user.changeUserFollowingStatus.useMutation({
      onSuccess: () => trpcUtils.user.getUserByUsername.invalidate(),
      onError: () => toast('Something went wrong', { type: 'error' }),
    });

  const onChangeFollowStatus = () => {
    if (!currentUser)
      return router.push(`/register?navigateTo=${router.asPath}`);

    changeFollowStatus(user.id);
  };

  return (
    <>
      <div className="bg-gray-100">
        <div className="mx-auto flex max-w-[950px] flex-col items-center px-5 pb-4 pt-8">
          <img
            src={user.image ? user.image : userAvatarPlaceholderImage.src}
            className="h-[100px] w-[100px] rounded-full"
            alt="User avatar"
          />
          <h2 className="mt-3 text-2xl font-bold">{user.username}</h2>
          {currentUser?.id === user.id ? (
            <Button
              asLink
              href={`/settings`}
              className="mt-2 self-end"
              variantProps={{ variant: 'secondary-outline', size: 'sm' }}
            >
              <GearIcon className="mr-1 h-3" />
              Edit Profile Settings
            </Button>
          ) : (
            <Button
              onClick={onChangeFollowStatus}
              disabled={isChangingFollowStatus}
              className="mt-2 self-end"
              variantProps={{
                size: 'sm',
                variant: user.isFollowing
                  ? 'tertiary-outline'
                  : 'secondary-outline',
                disabled: isChangingFollowStatus,
              }}
            >
              <PlusIcon className="mr-[3px] h-[14px]" />{' '}
              {user.isFollowing ? 'Unfollow' : 'Follow'} {user.username}
            </Button>
          )}
        </div>
      </div>
      <div className="mx-auto mb-2 mt-6 max-w-[950px] px-5">
        <Link
          className={`relative px-4 py-2 ${
            `/@${user.username}` === router.asPath
              ? 'border-b-2 border-green-550 text-green-550'
              : 'text-[#AAAAAA]'
          }`}
          href={`/@${user.username}`}
        >
          My Articles
        </Link>
        <Link
          className={`relative px-4 py-2 ${
            `/@${user.username}/favorites` === router.asPath
              ? 'border-b-2 border-green-550 text-green-550'
              : 'text-[#AAAAAA]'
          }`}
          href={`/@${user.username}/favorites`}
        >
          Favorited Articles
        </Link>
      </div>
    </>
  );
};

export default ProfilePageLayout;
