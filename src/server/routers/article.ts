import { z } from 'zod';

import { prisma } from '../prisma';
import { privateProcedure, publicProcedure, router } from '../trpc';
import { generateSlug } from '../helpers';

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
      const slug = generateSlug(input.title);

      const article = await prisma.article.create({
        data: { ...input, slug, authorId: ctx.userId },
        select: { id: true, slug: true },
      });

      return article;
    }),
  update: privateProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        title: z.string().optional(),
        description: z.string().optional(),
        body: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Filter input to avoid fields with empty strings
      const filteredInput = Object.fromEntries(
        Object.entries(input).filter(([_, value]) => Boolean(value)),
      );

      if (filteredInput.title) {
        filteredInput.slug = generateSlug(filteredInput.slug);
      }

      const updatedArticle = await prisma.article.update({
        where: { slug: input.slug, authorId: ctx.userId },
        data: filteredInput,
        select: { slug: true },
      });

      return { slug: updatedArticle.slug };
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
