import { z } from 'zod';

import { prisma } from '../prisma';
import { privateProcedure, router } from '../trpc';

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
});
