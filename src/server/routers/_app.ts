import { router } from '../trpc';
import { userRouter } from './user';
import { articleRouter } from './article';

export const appRouter = router({
  user: userRouter,
  article: articleRouter,
});

export type AppRouter = typeof appRouter;
