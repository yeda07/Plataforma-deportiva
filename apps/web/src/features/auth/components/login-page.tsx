"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail, ShieldCheck, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge, Button, Card, Input } from "@competencias-platform/ui";
import { InvalidCredentialsError, authService } from "../services/auth.service";
import type { LoginFormState } from "../types/auth";

const loginSchema = z.object({
  email: z.email("Ingresa un email válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  rememberMe: z.boolean()
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<LoginFormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "usuario1@competencias.local",
      password: "",
      rememberMe: true
    },
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    if (formState !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.replace("/");
    }, 650);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [formState, router]);

  async function onSubmit(values: LoginFormValues) {
    setFormState("loading");
    setErrorMessage(null);

    try {
      await authService.login(values);
      setFormState("success");
    } catch (error) {
      setFormState("error");
      setErrorMessage(
        error instanceof InvalidCredentialsError
          ? "Email o contraseña incorrectos."
          : "No pudimos iniciar sesión."
      );
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <section className="grid gap-4">
        <Badge tone="primary">Acceso seguro</Badge>
        <div>
          <h1 className="text-h1">Inicia sesión</h1>
          <p className="mt-2 text-body text-muted-foreground">
            Entra para seguir tus predicciones gratuitas, puntos, logros y ranking.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <FeaturePill icon={<Trophy className="size-4" aria-hidden="true" />} text="Competencias" />
          <FeaturePill icon={<ShieldCheck className="size-4" aria-hidden="true" />} text="Sin dinero real" />
          <FeaturePill icon={<LockKeyhole className="size-4" aria-hidden="true" />} text="Mock auth" />
        </div>
      </section>

      <Card className="grid gap-4 p-4 sm:p-6">
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event);
          }}
        >
          <Input
            autoComplete="email"
            label="Email"
            placeholder="usuario1@competencias.local"
            type="email"
            {...(errors.email?.message ? { errorMessage: errors.email.message } : {})}
            {...register("email")}
          />
          <Input
            autoComplete="current-password"
            label="Contraseña"
            placeholder="password123"
            type="password"
            {...(errors.password?.message ? { errorMessage: errors.password.message } : {})}
            {...register("password")}
          />

          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <label className="inline-flex min-h-10 items-center gap-2 text-caption text-foreground">
              <input
                className="size-4 rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                type="checkbox"
                {...register("rememberMe")}
              />
              Recordarme
            </label>
            <Link
              className="rounded-sm text-caption font-semibold text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="/forgot-password"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {errorMessage ? (
            <p className="rounded-md border border-error/30 bg-error/10 p-3 text-caption font-semibold text-error">
              {errorMessage}
            </p>
          ) : null}

          {formState === "success" ? (
            <p className="rounded-md border border-success/30 bg-success/10 p-3 text-caption font-semibold text-success">
              Sesión iniciada. Redirigiendo al inicio.
            </p>
          ) : null}

          <Button isLoading={formState === "loading"} type="submit">
            Iniciar sesión
          </Button>
        </form>

        <div className="border-t border-border pt-4 text-center text-caption text-muted-foreground">
          ¿Aún no tienes cuenta?{" "}
          <Link
            className="font-semibold text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/register"
          >
            Crear cuenta
          </Link>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-muted p-3 text-caption text-muted-foreground">
          <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
          Demo: usuario1@competencias.local / password123
        </div>
      </Card>
    </div>
  );
}

function FeaturePill({ icon, text }: Readonly<{ icon: ReactNode; text: string }>) {
  return (
    <div className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 text-label shadow-sm">
      <span className="text-primary">{icon}</span>
      {text}
    </div>
  );
}
