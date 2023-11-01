import { router } from '../trpc';
import { userRouter } from './user';
import { articleRouter } from './article';
import { commentRouter } from './comment';

export const appRouter = router({
  user: userRouter,
  article: articleRouter,
  comment: commentRouter,
});

export type AppRouter = typeof appRouter;
