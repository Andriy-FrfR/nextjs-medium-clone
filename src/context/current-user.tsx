import { FC, ReactNode, createContext, useContext } from 'react';

import { RouterOutputs, trpc } from '~/utils/trpc';

const context = createContext<
  RouterOutputs['user']['getCurrentUser'] | undefined
>(null);

const CurrentUserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data } = trpc.user.getCurrentUser.useQuery();

  return <context.Provider value={data}>{children}</context.Provider>;
};

export default CurrentUserProvider;

export const useCurrentUser = () => useContext(context);
