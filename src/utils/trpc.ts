import {
  TRPCClientError,
  createTRPCProxyClient,
  httpBatchLink,
} from '@trpc/client';

import { AppRouter } from '~/server';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
    }),
  ],
});

export const isTRPCClientError = (
  cause: unknown,
): cause is TRPCClientError<AppRouter> => {
  return cause instanceof TRPCClientError;
};
