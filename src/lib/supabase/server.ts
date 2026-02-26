import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Supabase environment variables missing. Running in stub mode.');
}

// Minimal stub implementation that responds to any method with a harmless result.
// We use a Proxy so chaining (from().select().eq().single(), rpc(), etc.) works without
// throwing. Storage operations are also no-ops.
function createStubClient() {
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === 'storage') {
        return {
          from: (_bucket: string) => ({
            upload: async () => ({ error: null }),
            remove: async () => ({ error: null }),
          }),
        };
      }
      // Return a function for everything else; invoking it returns the proxy itself
      // so we can chain arbitrary calls and finally `await` it to get a default value.
      return (..._args: any[]) => new Proxy(() => ({ data: null, error: null }), handler);
    },
    apply(target, thisArg, args) {
      // Called when the proxy itself is invoked as a function: return default response
      return Promise.resolve({ data: null, error: null });
    },
  };
  // initial proxy object
  return new Proxy(() => ({ data: null, error: null }), handler) as any;
}

// Server-side Supabase client (uses service role key)
// This bypasses RLS and should only be used in server-side code
export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : (createStubClient() as any);


export default supabaseAdmin;
