import { createClient } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env.local and set Supabase credentials.`);
  }
  return value;
}

/**
 * Admin client (service role). Bypasses RLS.
 * Use ONLY for trusted, non-authenticated flows: public booking RPC, cron,
 * notifications and user provisioning. Never expose to the browser.
 */
export function createServerSupabase() {
  return createClient(
    requireEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(serviceRoleKey, "SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}

/**
 * Cookie-bound server client (anon key). Carries the logged-in user's session,
 * so Postgres RLS is enforced. Use in the authenticated panel (server
 * components and server actions).
 */
export async function createAuthServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    requireEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(anonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component where cookies are read-only.
            // The middleware refreshes the session, so this is safe to ignore.
          }
        }
      }
    }
  );
}

export function createBrowserSupabase() {
  return createBrowserClient(
    requireEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(anonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}
