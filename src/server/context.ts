import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

import { prisma } from './prisma';

export const createContext = async (opts: CreateNextContextOptions) => {
  const context: { prisma: PrismaClient; userId?: number } = { prisma };

  const accessToken = opts.req.headers.authorization
    ? opts.req.headers.authorization.split('Bearer ')[1]
    : '';

  if (!accessToken) {
    return context;
  }

  try {
    const userId = jwt.verify(accessToken, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
      },
    });
    context.userId = user?.id;
    return context;
  } catch (e) {
    return context;
  }
};

export type Context = inferAsyncReturnType<typeof createContext>;
