import type { Router, History } from '@repo/backend/src/router';
import type { RouterClient } from '@orpc/server';
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';

const link = new RPCLink({
  url: import.meta.env.VITE_API_URL || 'http://localhost:3001/rpc',
});

export const apiClient: RouterClient<Router> = createORPCClient(link);

// Re-export History type for use in components
export type { History };
