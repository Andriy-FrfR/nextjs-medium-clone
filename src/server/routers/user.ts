import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';

import { prisma } from '../prisma';
import { publicProcedure, router } from '../trpc';

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().refine(
          (val) => z.string().email().safeParse(val).success,
          (val) => ({
            message:
              val.length > 0 ? 'email is invalid' : "email can't be blank",
          }),
        ),
        password: z.string().min(1, "password can't be blank"),
        username: z.string().min(1, "username can't be blank"),
      }),
    )
    .mutation(async (opts) => {
      const { email, password, username } = opts.input;

      const userWithEmailAlreadyExist = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithEmailAlreadyExist) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'user with this email already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      const accessToken = jwt.sign(String(user.id), process.env.JWT_SECRET!);

      return { ...user, accessToken };
    }),
});
