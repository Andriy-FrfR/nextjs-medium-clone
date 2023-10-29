import { z } from 'zod';

import { prisma } from '../prisma';
import { privateProcedure, publicProcedure, router } from '../trpc';

export const articleRouter = router({
  create: privateProcedure
    .input(
      z.object({
        title: z.string().min(1, "title can't be blank"),
        description: z.string().min(1, "description can't be blank"),
        body: z.string().min(1, "body can't be blank"),
        // tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const slug =
        input.title
          .toLowerCase()
          .split(' ')
          .filter((value) => Boolean(value))
          .join('-') + `-${String(Date.now()).slice(-6)}`;

      const article = await prisma.article.create({
        data: { ...input, slug, authorId: ctx.userId },
        select: { id: true, slug: true },
      });

      return article;
    }),
  delete: privateProcedure
    .input(z.number())
    .mutation(async ({ input: articleId, ctx }) => {
      await prisma.article.delete({
        where: { id: articleId, authorId: ctx.userId },
      });
    }),
  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ input: slug }) => {
      const article = await prisma.article.findUnique({
        where: { slug },
        include: {
          author: { select: { username: true, email: true, image: true } },
        },
      });

      return article;
    }),
});
