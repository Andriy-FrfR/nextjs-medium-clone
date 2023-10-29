import { useRouter } from 'next/router';
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import PageLoader from '~/components/PageLoader';
import { RouterOutputs, trpc } from '~/utils/trpc';

const context = createContext<{
  currentUser: RouterOutputs['user']['getCurrentUser'] | undefined;
  isFetchingUser: boolean;
}>({ currentUser: null, isFetchingUser: true });

const PROTECTED_ROUTES = [
  { path: '/editor' },
  { path: '/settings', exact: true },
];

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  const [showPageLoader, setShowPageLoader] = useState(true);

  const { data, isLoading: isFetchingUser } = trpc.user.getCurrentUser.useQuery(
    undefined,
    {
      retry: false,
    },
  );

  useEffect(() => {
    if (
      !isFetchingUser &&
      !data &&
      PROTECTED_ROUTES.some(({ path, exact }) =>
        exact ? router.pathname === path : router.pathname.startsWith(path),
      )
    ) {
      router.push('/register').then(() => setShowPageLoader(false));
    } else if (!isFetchingUser) {
      setShowPageLoader(false);
    }
  }, [data, isFetchingUser, router]);

  if (showPageLoader) {
    return <PageLoader />;
  }

  return (
    <context.Provider value={{ currentUser: data, isFetchingUser }}>
      {children}
    </context.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(context);
