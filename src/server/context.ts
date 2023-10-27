import jwt from 'jsonwebtoken';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

import { prisma } from './prisma';

export const createContext = async (opts: CreateNextContextOptions) => {
  const accessToken = opts.req.headers.authorization
    ? opts.req.headers.authorization.split('Bearer ')[1]
    : '';

  if (!accessToken) {
    return { userId: null };
  }

  try {
    const userId = jwt.verify(accessToken, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
      },
    });
    return { userId: user?.id };
  } catch (e) {
    return { userId: null };
  }
};

export type Context = inferAsyncReturnType<typeof createContext>;
