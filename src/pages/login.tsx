import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const INPUTS = [
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
  const { handleSubmit, register } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);

    setTimeout(() => setIsLoading(false), 1000);
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
          className="text-green-500 hover:text-green-650 hover:underline"
        >
          Need an account?
        </Link>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col">
          {INPUTS.map(({ type, placeholder, name }) => (
            <input
              {...register(name)}
              key={name}
              type={type}
              placeholder={placeholder}
              disabled={isLoading}
              className={`mb-4 h-[51px] rounded border border-[#00000026] px-6 py-3 text-xl text-gray-600 placeholder:text-gray-400 ${
                isLoading && 'bg-gray-150 cursor-not-allowed'
              }`}
            />
          ))}
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-green-550 self-end rounded px-6 py-3 text-xl text-white ${
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
