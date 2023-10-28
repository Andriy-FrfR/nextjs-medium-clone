import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { Source_Sans_3, Titillium_Web } from 'next/font/google';
import { ToastContainer as ToastContainerBase } from 'react-toastify';

import '~/styles/globals.css';
import { trpc } from '~/utils/trpc';
import GearIcon from '~/assets/svg/gear.svg';
import AuthProvider, { useAuth } from '~/contexts/auth';
import PenToSquareIcon from '~/assets/svg/pen-to-square.svg';
import userAvatarPlaceholderImage from '~/assets/images/user-avatar-placeholder.jpeg';

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

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <div
        className={`${source_sans_3.variable} ${titilium_web.variable} flex min-h-screen flex-col font-sans`}
      >
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </AuthProvider>
  );
};

export default trpc.withTRPC(App);

const Header = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  const routes = currentUser
    ? [
        { href: '/', content: 'Home' },
        {
          href: '/editor',
          content: (
            <>
              <PenToSquareIcon className="mb-1 mr-1 w-4" />
              New Article
            </>
          ),
        },
        {
          href: '/settings',
          content: (
            <>
              <GearIcon className="mr-1 w-4" />
              Settings
            </>
          ),
        },
        {
          href: `/@${currentUser.email}`,
          content: (
            <>
              <Image
                width={26}
                src={
                  currentUser.image
                    ? currentUser.image
                    : userAvatarPlaceholderImage
                }
                alt="User avatar"
                className="mr-[6px] rounded-full"
              />
              {currentUser.username}
            </>
          ),
        },
      ]
    : [
        { href: '/', content: 'Home' },
        { href: '/login', content: 'Sign in' },
        { href: '/register', content: 'Sign up' },
      ];

  return (
    <header>
      <nav className="mx-auto flex h-[56px] max-w-[1140px] items-center justify-between px-5">
        <Link
          href="/"
          className="font-titilium text-2xl font-bold text-green-550"
        >
          conduit
        </Link>
        <div className="flex">
          {routes.map(({ href, content }) => (
            <Link
              key={href}
              href={href}
              className={`ml-4 flex items-center text-black ${
                router.pathname === href
                  ? 'text-opacity-80'
                  : 'text-opacity-30 hover:text-opacity-60'
              }`}
            >
              {content}
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
          className="font-titilium font-bold text-green-550 hover:text-green-650 hover:underline"
        >
          conduit
        </Link>
        <p className="ml-3 text-xs text-gray-400">
          © 2023. An interactive learning project from{' '}
          <Link
            className="font-titilium text-green-550 hover:text-green-650 hover:underline"
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

const ToastContainer = () => (
  <ToastContainerBase
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
);
