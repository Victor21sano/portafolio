"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAuthServerClient } from "@/lib/supabase";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function signIn(_: unknown, formData: FormData) {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Ingresa un email valido y tu contrasena." };
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, message: "Credenciales incorrectas. Verifica email y contrasena." };
  }

  redirect("/panel");
}

export async function signOut() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
