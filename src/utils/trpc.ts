import Cookies from 'js-cookie';
import superjson from 'superjson';
import { createTRPCNext } from '@trpc/next';
import { inferRouterOutputs } from '@trpc/server';
import { HTTPHeaders, httpBatchLink } from '@trpc/client';

import { AppRouter } from '~/server/routers/_app';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            const headers: HTTPHeaders = {};
            const accessToken = Cookies.get('accessToken');

            if (accessToken) {
              headers['Authorization'] = `Bearer ${accessToken}`;
            }

            return headers;
          },
        }),
      ],
      transformer: superjson,
    };
  },
  ssr: false,
});

export type RouterOutputs = inferRouterOutputs<AppRouter>;
