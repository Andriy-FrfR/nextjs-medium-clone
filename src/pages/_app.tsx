import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer as ToastContainerBase } from 'react-toastify';

import '~/styles/globals.css';
import { trpc } from '~/utils/trpc';
import AuthProvider from '~/contexts/auth';
import PageLayout from '~/components/PageLayout';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <PageLayout>
        <Component {...pageProps} />
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
