import { os } from '@orpc/server';

const healthProcedure = os.handler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
});

export const router = {
  health: healthProcedure,
};

export type Router = typeof router;
