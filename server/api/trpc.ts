import { initTRPC, TRPCError } from '@trpc/server';
import { db } from '@/server/db';
import superjson from 'superjson';
import { CURRENT_USER, type User } from '@/lib/constants'; 

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    user: CURRENT_USER as User, 
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;


export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.user.id) { 
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
