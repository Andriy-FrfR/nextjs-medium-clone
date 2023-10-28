import Head from 'next/head';
import { useForm } from 'react-hook-form';

import Input from '~/components/Input';
import Button from '~/components/Button';
import { useAuth } from '~/contexts/auth';
import Textarea from '~/components/Textarea';

export default function SettingsPage() {
  const { currentUser } = useAuth();

  const { register, handleSubmit, getValues } = useForm<{
    image: string;
    bio: string;
    username: string;
    email: string;
    password: string;
  }>();

  const onSubmit = () => {
    const values = getValues();
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
          />
          <Textarea
            {...register('bio')}
            defaultValue={currentUser?.bio || undefined}
            className="mb-4"
            placeholder="Short bio about you"
            rows={8}
          />
          <Input
            {...register('username')}
            defaultValue={currentUser?.username}
            className="mb-4"
            placeholder="Username"
            type="text"
          />
          <Input
            {...register('email')}
            defaultValue={currentUser?.email}
            className="mb-4"
            placeholder="Email"
            type="email"
          />
          <Input
            {...register('password')}
            className="mb-4"
            placeholder="New Password"
            type="password"
          />
          <Button type="submit" className="self-end">
            Update Settings
          </Button>
        </form>
        <div className="my-4 border-t border-gray-300" />
        <Button variant="danger" size="sm">
          Or click here to logout.
        </Button>
      </div>
    </>
  );
}
