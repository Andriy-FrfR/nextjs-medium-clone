import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { generateSlug } from '../helpers';
import { privateProcedure, publicProcedure, router } from '../trpc';

export const articleRouter = router({
  create: privateProcedure
    .input(
      z.object({
        title: z.string().min(1, "title can't be blank"),
        description: z.string().min(1, "description can't be blank"),
        body: z.string().min(1, "body can't be blank"),
        tags: z.array(z.string().min(1)).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const slug = generateSlug(input.title);

      const article = await ctx.prisma.article.create({
        data: {
          ...input,
          slug,
          authorId: ctx.userId,
          tags: {
            connectOrCreate: input.tags?.map((tagName) => ({
              where: { name: tagName },
              create: { name: tagName },
            })),
          },
        },
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
        tags: z.array(z.string().min(1)).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { slug, tags, ...rest } = input;

      const article = await ctx.prisma.article.findUnique({
        where: { slug },
        select: { title: true, tags: true },
      });

      // Filter input to avoid fields with empty strings
      const filteredInput = Object.fromEntries(
        Object.entries(rest).filter(([_, value]) => Boolean(value)),
      );

      if (filteredInput.title && article?.title !== filteredInput.title) {
        filteredInput.slug = generateSlug(filteredInput.title);
      }

      const updatedArticle = await ctx.prisma.article.update({
        where: { slug: input.slug, authorId: ctx.userId },
        data: {
          ...filteredInput,
          tags: {
            disconnect: article?.tags.map((tag) => ({ name: tag.name })),
            connectOrCreate: tags?.map((tagName) => ({
              where: { name: tagName },
              create: { name: tagName },
            })),
          },
        },
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
          tags: true,
          author: {
            select: {
              username: true,
              email: true,
              image: true,
              followedBy: { where: { id: ctx.userId } },
            },
          },
          favoritedBy: { where: { id: ctx.userId } },
        },
      });

      return article
        ? {
            ...article,
            isFavorited: Boolean(article.favoritedBy[0]),
            author: {
              ...article.author,
              isFollowing: Boolean(article.author.followedBy[0]),
            },
          }
        : null;
    }),
  changeArticleFavoritedStatus: privateProcedure
    .input(z.number())
    .mutation(async ({ input: articleId, ctx }) => {
      const article = await ctx.prisma.article.findUnique({
        where: {
          id: articleId,
        },
        select: { favoritedBy: { where: { id: ctx.userId } } },
      });

      if (!article) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Article not found',
        });
      }

      const isFavorited = Boolean(article.favoritedBy[0]);

      await ctx.prisma.article.update({
        where: { id: articleId },
        data: {
          favoritedBy: {
            connect: !isFavorited ? { id: ctx.userId } : undefined,
            disconnect: isFavorited ? { id: ctx.userId } : undefined,
          },
        },
      });
    }),
});
