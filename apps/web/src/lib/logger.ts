import pino from 'pino';

const isProduction = import.meta.env.PROD;

export const logger = pino({
  level: import.meta.env.VITE_LOG_LEVEL || (isProduction ? 'warn' : 'debug'),
  browser: {
    asObject: true,
  },
});
