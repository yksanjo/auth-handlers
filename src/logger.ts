import winston from 'winston';
import { Logger } from './types';

export type { Logger };

export function createLogger(opts?: { level?: string }): Logger {
  const l = winston.createLogger({
    level: opts?.level || 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console({ format: winston.format.simple() })]
  });
  return {
    info: (m, x) => l.info(m, x),
    warn: (m, x) => l.warn(m, x),
    error: (m, x) => l.error(m, x),
    debug: (m, x) => l.debug(m, x)
  };
}

export const defaultLogger = createLogger();
