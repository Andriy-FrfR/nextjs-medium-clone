import { z } from 'zod';

import { privateProcedure, publicProcedure, router } from '../trpc';

export const commentRouter = router({
  create: privateProcedure
    .input(z.object({ articleId: z.number(), commentBody: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const { articleId, commentBody } = input;

      await ctx.prisma.articleComment.create({
        data: {
          body: commentBody,
          authorId: ctx.userId,
          articleId,
        },
      });
    }),
  deleteById: privateProcedure
    .input(z.number())
    .mutation(async ({ input: commentId, ctx }) => {
      await ctx.prisma.articleComment.delete({
        where: { id: commentId, authorId: ctx.userId },
      });
    }),
  getCommentsByArticleId: publicProcedure
    .input(z.number())
    .query(async ({ input: articleId, ctx }) => {
      return ctx.prisma.articleComment.findMany({
        where: { articleId },
        include: {
          author: { select: { id: true, username: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }),
});
