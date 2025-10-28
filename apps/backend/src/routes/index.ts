import { os } from '@orpc/server';

const healthProcedure = os.handler(() => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
}));

export const userRoutes = {
  health: healthProcedure,
};
