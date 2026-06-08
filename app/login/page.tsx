"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { signIn } from "@/app/auth-actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, { ok: true, message: "" });

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="card w-full max-w-md p-6">
        <Mail className="text-brand" size={28} />
        <h1 className="mt-4 text-2xl font-semibold text-zinc-950">Acceso del profesional</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Inicia sesion con el correo y la contrasena de tu negocio para administrar tu agenda.
        </p>

        <form action={action} className="mt-6 grid gap-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="field mt-2" name="email" type="email" required autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="password">Contrasena</label>
            <input
              id="password"
              className="field mt-2"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
            />
          </div>

          {!state.ok ? (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</p>
          ) : null}

          <button className="btn btn-primary w-full" disabled={pending}>
            {pending ? "Entrando..." : "Iniciar sesion"}
          </button>
        </form>
      </section>
    </main>
  );
}
