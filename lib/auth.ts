import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createAuthServerClient } from "./supabase";
import type { Business } from "./types";

/** Current logged-in auth user, or null. Does not redirect. */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await createAuthServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Resolves the authenticated professional's business and returns the
 * RLS-bound client to reuse for scoped reads/writes. Redirects to /login
 * if there is no session or the user is not linked to a business.
 */
export async function getAuthenticatedBusiness(): Promise<{ business: Business; supabase: SupabaseClient }> {
  const supabase = await createAuthServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("business_id").eq("id", user.id).single();
  if (!profile) redirect("/login?error=sin-negocio");

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", profile.business_id)
    .single<Business>();
  if (!business) redirect("/login?error=sin-negocio");

  return { business, supabase };
}
