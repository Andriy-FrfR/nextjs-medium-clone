import Head from 'next/head';
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

  const { isLoading, mutate } = trpc.user.updateUser.useMutation({
    onSuccess: async () => {
      await trpcUtils.user.getCurrentUser.invalidate();
      router.push(`/@${currentUser?.email}`);
    },
    onError: (e) => {
      if (e.data?.code === 'INTERNAL_SERVER_ERROR') {
        toast('Something went wrong', { type: 'error' });
        return;
      }

      const errors = JSON.parse(e.message) as Error[];
      const errorMessages = errors.map((error) => error.message);
      setErrorMessages(errorMessages);
    },
  });

  const onSubmit = () => {
    const values = getValues();
    mutate(values);
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
            sizeVariant="sm"
            defaultValue={currentUser?.image || undefined} // Workaround to pass not null check
            className="mb-4"
            placeholder="Url of profile picture"
            type="text"
            disabled={isLoading}
          />
          <Textarea
            {...register('bio')}
            defaultValue={currentUser?.bio || undefined}
            className="mb-4"
            placeholder="Short bio about you"
            rows={8}
            disabled={isLoading}
          />
          <Input
            {...register('username')}
            defaultValue={currentUser?.username}
            className="mb-4"
            placeholder="Username"
            type="text"
            disabled={isLoading}
          />
          <Input
            {...register('email')}
            defaultValue={currentUser?.email}
            className="mb-4"
            placeholder="Email"
            type="email"
            disabled={isLoading}
          />
          <Input
            {...register('password')}
            className="mb-4"
            placeholder="New Password"
            type="password"
            disabled={isLoading}
          />
          <Button type="submit" className="self-end" disabled={isLoading}>
            Update Settings
          </Button>
        </form>
        <div className="my-4 border-t border-gray-300" />
        <Button variant="danger" size="sm" disabled={isLoading}>
          Or click here to logout.
        </Button>
      </div>
    </>
  );
}
