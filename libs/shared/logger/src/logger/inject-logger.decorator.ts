import { Inject } from '@nestjs/common';

const TOKEN_PREFIX_BASE = 'LOGGER__';

export const TOKEN_PREFIX = TOKEN_PREFIX_BASE + '_';

export const loggerNamespaces: Map<string, string> = new Map();

export function InjectLogger(namespace: string): ReturnType<typeof Inject> {
  const injectionToken = getLoggerTokenFor(namespace);

  if (!loggerNamespaces.has(namespace)) {
    loggerNamespaces.set(namespace, injectionToken);
  }

  return Inject(injectionToken);
}

export function getLoggerTokenFor(namespace: string): string {
  return TOKEN_PREFIX + namespace;
}
