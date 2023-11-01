import Head from 'next/head';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { trpc } from '~/utils/trpc';
import Input from '~/components/Input';
import Button from '~/components/Button';
import { useAuth } from '~/contexts/auth';
import Textarea from '~/components/Textarea';
import ValidationErrors from '~/components/ValidationErrors';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const { register, handleSubmit, getValues } = useForm<{
    image: string;
    bio: string;
    username: string;
    email: string;
    password: string;
  }>();

  const trpcUtils = trpc.useUtils();

  const { isLoading, mutate } = trpc.user.update.useMutation({
    onSuccess: async () => {
      trpcUtils.user.getCurrentUser.invalidate();
      router.push(`/@${currentUser?.username}`);
    },
    onError: (e) => {
      if (
        e.message === 'email must be unique' ||
        e.message === 'username must be unique'
      ) {
        setErrorMessages([e.message]);
        return;
      }

      if (e.data?.zodError) {
        const errors = JSON.parse(e.message) as Error[];
        const errorMessages = errors.map((error) => error.message);
        setErrorMessages(errorMessages);
        return;
      }

      toast('Something went wrong', { type: 'error' });
    },
  });

  const onSubmit = () => {
    const values = getValues();
    mutate(values);
  };

  const onLogout = async () => {
    Cookies.remove('accessToken');
    await router.replace('/');
    trpcUtils.user.getCurrentUser.reset();
  };

  return (
    <>
      <Head>
        <title>Settings - Conduit</title>
      </Head>
      <div className="mx-auto mb-10 max-w-[580px] px-5">
        <h1 className="mt-6 text-center text-[40px] text-gray-700">
          Your Settings
        </h1>
        <ValidationErrors errorMessages={errorMessages} className="mb-2" />
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col"
        >
          <Input
            {...register('image')}
            defaultValue={currentUser?.image || undefined} // Workaround to pass not null check
            className="mb-4"
            placeholder="Url of profile picture"
            type="text"
            disabled={isLoading}
            variantProps={{ disabled: isLoading, size: 'sm' }}
          />
          <Input
            {...register('username')}
            defaultValue={currentUser?.username}
            className="mb-4"
            placeholder="Username"
            type="text"
            disabled={isLoading}
            variantProps={{ disabled: isLoading }}
          />
          <Textarea
            {...register('bio')}
            defaultValue={currentUser?.bio || undefined}
            className="mb-4"
            placeholder="Short bio about you"
            rows={8}
            disabled={isLoading}
            variantProps={{ disabled: isLoading }}
          />
          <Input
            {...register('email')}
            defaultValue={currentUser?.email}
            className="mb-4"
            placeholder="Email"
            type="email"
            disabled={isLoading}
            variantProps={{ disabled: isLoading }}
          />
          <Input
            {...register('password')}
            className="mb-4"
            placeholder="New Password"
            type="password"
            disabled={isLoading}
            variantProps={{ disabled: isLoading }}
          />
          <Button
            type="submit"
            className="self-end"
            disabled={isLoading}
            variantProps={{ disabled: isLoading }}
          >
            Update Settings
          </Button>
        </form>
        <div className="my-4 border-t border-gray-300" />
        <Button
          onClick={onLogout}
          disabled={isLoading}
          variantProps={{
            variant: 'danger-outline-1',
            size: 'md',
            disabled: isLoading,
          }}
        >
          Or click here to logout.
        </Button>
      </div>
    </>
  );
}
