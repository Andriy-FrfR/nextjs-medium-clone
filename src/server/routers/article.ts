import { z } from 'zod';

import { generateSlug } from '../helpers';
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
      const slug = generateSlug(input.title);

      const article = await ctx.prisma.article.create({
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
        const article = await ctx.prisma.article.findUnique({
          where: { slug: input.slug },
          select: { title: true },
        });

        if (article?.title !== filteredInput.title) {
          filteredInput.slug = generateSlug(filteredInput.title);
        }
      }

      const updatedArticle = await ctx.prisma.article.update({
        where: { slug: input.slug, authorId: ctx.userId },
        data: filteredInput,
        select: { slug: true },
      });

      return { slug: updatedArticle.slug };
    }),
  delete: privateProcedure
    .input(z.number())
    .mutation(async ({ input: articleId, ctx }) => {
      await ctx.prisma.article.delete({
        where: { id: articleId, authorId: ctx.userId },
      });
    }),
  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ input: slug, ctx }) => {
      const article = await ctx.prisma.article.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              username: true,
              email: true,
              image: true,
              followedBy: { where: { id: ctx.userId } },
            },
          },
        },
      });

      return article
        ? {
            ...article,
            author: {
              ...article.author,
              isFollowing: Boolean(article?.author.followedBy[0]),
            },
          }
        : null;
    }),
});
