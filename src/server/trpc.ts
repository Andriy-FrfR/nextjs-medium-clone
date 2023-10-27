import superjson from 'superjson';
import { TRPCError, initTRPC } from '@trpc/server';

import { Context } from './context';

const t = initTRPC.context<Context>().create({ transformer: superjson });

const authedUsersOnlyGuard = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      userId: ctx.userId,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(authedUsersOnlyGuard);
