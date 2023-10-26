import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { isTRPCClientError, trpc } from '~/utils/trpc';

type InputName = 'username' | 'email' | 'password';

const INPUTS: { placeholder: string; type: string; name: InputName }[] = [
  {
    placeholder: 'Username',
    type: 'text',
    name: 'username',
  },
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

export default function RegisterPage() {
  const router = useRouter();

  const { handleSubmit, register, getValues } =
    useForm<Record<InputName, string>>();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const onSubmit = async () => {
    setIsLoading(true);

    const values = getValues();

    try {
      const user = await trpc.user.register.mutate(values);
      router.replace('/');
    } catch (e) {
      if (!isTRPCClientError(e) || e.data?.code === 'INTERNAL_SERVER_ERROR') {
        setIsLoading(false);
        toast('Something went wrong', { type: 'error' });
        return;
      }

      if (e.message === 'user with this email already exists') {
        setErrorMessages([e.message]);
        setIsLoading(false);
        return;
      }

      const errors = JSON.parse(e.message) as Error[];
      const errorMessages = errors.map((error) => error.message);

      setErrorMessages(errorMessages);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign up - Conduit</title>
      </Head>
      <div className="mx-auto mt-5 max-w-[580px] px-5 text-center">
        <h1 className="text-[40px]">Sign up</h1>
        <Link
          href="/login"
          className="text-green-500 hover:text-green-650 hover:underline"
        >
          Have an account?
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
            <input
              {...register(name)}
              key={name}
              type={type}
              placeholder={placeholder}
              disabled={isLoading}
              className={`mb-4 h-[51px] rounded border border-[#00000026] px-6 py-3 text-xl text-gray-600 placeholder:text-gray-400 ${
                isLoading && 'cursor-not-allowed bg-gray-150'
              }`}
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
            Sign up
          </button>
        </form>
      </div>
    </>
  );
}
