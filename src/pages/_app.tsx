import type { AppProps } from 'next/app';
import { Source_Sans_3, Titillium_Web } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
      className={`${source_sans_3.variable} ${titilium_web.variable} font-sans`}
    >
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
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
      <nav className="mx-auto flex h-[56px] max-w-[940px] items-center justify-between px-5">
        <Link href="/" className="text-green font-titilium text-2xl font-bold">
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
