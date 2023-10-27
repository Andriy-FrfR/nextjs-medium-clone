import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { trpc } from '~/utils/trpc';
import Input from '~/components/Input';

type InputName = 'email' | 'password';

const INPUTS: { placeholder: string; type: string; name: InputName }[] = [
  {
    placeholder: 'Email',
    type: 'email',
    name: 'email',
  },
  {
    placeholder: 'Password',
    type: 'password',
    name: 'password',
  },
];

export default function LoginPage() {
  const router = useRouter();

  const { handleSubmit, register, getValues } =
    useForm<Record<InputName, string>>();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const utils = trpc.useUtils();

  const { mutate, isLoading } = trpc.user.login.useMutation({
    onSuccess: async (res) => {
      Cookies.set('accessToken', res.accessToken);
      await utils.user.getCurrentUser.invalidate();
      router.replace('/');
    },
    onError: (e) => {
      if (e.data?.code === 'INTERNAL_SERVER_ERROR') {
        toast('Something went wrong', { type: 'error' });
        return;
      }

      if (
        e.message === 'user with this email does not exist' ||
        e.message === 'password is not correct'
      ) {
        setErrorMessages([e.message]);
        return;
      }

      const errors = JSON.parse(e.message) as Error[];
      const errorMessages = errors.map((error) => error.message);
      setErrorMessages(errorMessages);
    },
  });

  const onSubmit = async () => {
    const values = getValues();
    mutate(values);
  };

  return (
    <>
      <Head>
        <title>Sign in - Conduit</title>
      </Head>
      <div className="mx-auto mt-5 max-w-[580px] px-5 text-center">
        <h1 className="text-[40px]">Sign in</h1>
        <Link
          href="/register"
          className="text-green-550 hover:text-green-650 hover:underline"
        >
          Need an account?
        </Link>
        <ul className="mb-1 mt-3 pl-6 text-left">
          {errorMessages.map((errorMessage) => (
            <li
              className="flex items-center font-bold text-red-700"
              key={errorMessage}
            >
              <div className="mr-2 h-[5px] w-[5px] rounded-full bg-red-700" />{' '}
              {errorMessage}
            </li>
          ))}
        </ul>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col"
        >
          {INPUTS.map(({ type, placeholder, name }) => (
            <Input
              {...register(name)}
              key={name}
              type={type}
              placeholder={placeholder}
              disabled={isLoading}
              state={isLoading ? 'loading' : undefined}
              className="mb-4"
            />
          ))}
          <button
            type="submit"
            disabled={isLoading}
            className={`self-end rounded bg-green-550 px-6 py-3 text-xl text-white ${
              isLoading
                ? 'cursor-not-allowed opacity-60'
                : 'hover:bg-green-600 active:bg-green-700'
            }`}
          >
            Sign in
          </button>
        </form>
      </div>
    </>
  );
}
