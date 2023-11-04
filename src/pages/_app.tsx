import { FC, ReactElement, ReactNode } from 'react';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer as ToastContainerBase } from 'react-toastify';

import '~/styles/globals.css';
import { trpc } from '~/utils/trpc';
import AuthProvider from '~/contexts/auth';
import PageLayout from '~/components/PageLayout';
import { NextPage } from 'next';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AuthProvider>
      <PageLayout>
        {getLayout(<Component {...pageProps} />)}
        <ToastContainer />
      </PageLayout>
    </AuthProvider>
  );
};

export default trpc.withTRPC(App);

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
