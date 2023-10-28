import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';

import { prisma } from '../prisma';
import { privateProcedure, publicProcedure, router } from '../trpc';

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
    .mutation(async ({ input }) => {
      const { email, password, username } = input;

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
        },
      });

      const accessToken = jwt.sign(String(user.id), process.env.JWT_SECRET!);

      return { id: user.id, accessToken };
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().min(1, "email can't be blank"),
        password: z.string().min(1, "password can't be blank"),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const userWithGivenEmail = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          password: true,
        },
      });

      if (!userWithGivenEmail) {
        throw new TRPCError({
          message: 'user with this email does not exist',
          code: 'BAD_REQUEST',
        });
      }

      const passwordsMatch = await bcrypt.compare(
        password,
        userWithGivenEmail.password,
      );

      if (!passwordsMatch) {
        throw new TRPCError({
          message: 'password is not correct',
          code: 'BAD_REQUEST',
        });
      }

      const accessToken = jwt.sign(
        String(userWithGivenEmail.id),
        process.env.JWT_SECRET!,
      );

      return {
        id: userWithGivenEmail.id,
        accessToken,
      };
    }),
  getCurrentUser: privateProcedure.query(async ({ ctx }) => {
    return prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { id: true, username: true, email: true, bio: true, image: true },
    });
  }),
  updateUser: privateProcedure
    .input(
      z.object({
        image: z.string().optional(),
        bio: z.string().optional(),
        username: z.string().optional(),
        email: z
          .string()
          .email('email is invalid')
          .optional()
          .or(z.literal('')),
        password: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Filter input to avoid fields with empty strings
      const filteredInput = Object.fromEntries(
        Object.entries(input).filter(([_, value]) => Boolean(value)),
      );

      if (filteredInput.password) {
        const salt = await bcrypt.genSalt(10);
        filteredInput.password = await bcrypt.hash(
          filteredInput.password,
          salt,
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: ctx.userId },
        data: filteredInput,
        select: {
          id: true,
        },
      });

      return { id: updatedUser.id };
    }),
});
