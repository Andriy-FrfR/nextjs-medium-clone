import Link from 'next/link';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Source_Sans_3, Titillium_Web } from 'next/font/google';

import '~/styles/globals.css';

const source_sans_3 = Source_Sans_3({
  weight: ['400', '300', '500', '600', '700'],
  style: 'normal',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-source-sans-3',
});

const titilium_web = Titillium_Web({
  weight: ['400', '700'],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-titillium-web',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${source_sans_3.variable} ${titilium_web.variable} flex min-h-screen flex-col font-sans`}
    >
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

const Header = () => {
  const router = useRouter();

  const routes = [
    { href: '/', name: 'Home' },
    { href: '/login', name: 'Sign in' },
    { href: '/register', name: 'Sign up' },
  ];

  return (
    <header>
      <nav className="mx-auto flex h-[56px] max-w-[1140px] items-center justify-between px-5">
        <Link
          href="/"
          className="font-titilium text-2xl font-bold text-green-500"
        >
          conduit
        </Link>
        <div className="flex">
          {routes.map(({ href, name }) => (
            <Link
              key={href}
              href={href}
              className={`ml-4 text-black ${
                router.pathname === href ? 'opacity-80' : 'opacity-30'
              }`}
            >
              {name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-100">
      <div className="mx-auto flex h-[56px] max-w-[1140px] items-center px-5">
        <Link
          href="/"
          className="font-titilium font-bold text-green-500 hover:text-green-650 hover:underline"
        >
          conduit
        </Link>
        <p className="ml-3 text-xs text-gray-400">
          © 2023. An interactive learning project from{' '}
          <Link
            className="font-titilium text-green-500 hover:text-green-650 hover:underline"
            href="https://thinkster.io/"
            target="_blank"
          >
            Thinkster
          </Link>
          . Code licensed under MIT.
        </p>
      </div>
    </footer>
  );
};
