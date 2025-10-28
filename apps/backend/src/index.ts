import { createServer } from 'node:http';
import { RPCHandler } from '@orpc/server/node';
import { CORSPlugin } from '@orpc/server/plugins';
import { router } from '@/router';
import { logger } from '@/lib/logger';

const PORT = process.env.PORT || 3001;

const handler = new RPCHandler(router, {
  plugins: [new CORSPlugin()],
});

const server = createServer(async (req, res) => {
  const { matched } = await handler.handle(req, res, {
    prefix: '/rpc',
    context: {},
  });

  if (matched) {
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  logger.info(`Backend server running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
