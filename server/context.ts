import { createClientApi } from '@/utils/supabase/api';
import { SupabaseClient } from '@supabase/supabase-js';
import type * as trpcNext from '@trpc/server/adapters/next';

interface CreateInnerContextOptions extends Partial<trpcNext.CreateNextContextOptions> {
    // session: Session | null
    supabase?: SupabaseClient
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(opts: CreateInnerContextOptions) {
    return {
        ...opts,
    };
}

export type Context = Awaited<ReturnType<typeof createContextInner>>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext(
    opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
    // for API-response caching see https://trpc.io/docs/v11/caching

    const supabase = createClientApi(opts.req, opts.res);

    return await createContextInner({
        supabase
    });
}