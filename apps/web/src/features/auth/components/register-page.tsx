"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Badge, Button, Card, Input, Select } from "@competencias-platform/ui";
import { DuplicateEmailError, authService } from "../services/auth.service";
import type { RegisterFormState } from "../types/auth";

const registerSchema = z
  .object({
    city: z.string().max(60, "La ciudad es demasiado larga."),
    confirmPassword: z.string().min(1, "Confirma tu contraseña."),
    displayName: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres.")
      .max(40, "El nombre no puede superar 40 caracteres."),
    email: z.email("Ingresa un email válido."),
    favoriteSportSlug: z.string(),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .regex(/[A-Z]/, "Incluye al menos una mayúscula.")
      .regex(/[a-z]/, "Incluye al menos una minúscula.")
      .regex(/[0-9]/, "Incluye al menos un número.")
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"]
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const sportOptions = [
  { label: "Seleccionar después", value: "" },
  { label: "Fútbol", value: "football" },
  { label: "Baloncesto", value: "basketball" },
  { label: "Tenis", value: "tennis" },
  { label: "eSports", value: "esports" }
] as const;

export function RegisterPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<RegisterFormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    formState: { errors },
    control,
    handleSubmit,
    register
  } = useForm<RegisterFormValues>({
    defaultValues: {
      city: "",
      confirmPassword: "",
      displayName: "",
      email: "",
      favoriteSportSlug: "",
      password: ""
    },
    resolver: zodResolver(registerSchema)
  });

  const password = useWatch({ control, name: "password" });

  useEffect(() => {
    if (formState !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.replace("/login");
    }, 800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [formState, router]);

  async function onSubmit(values: RegisterFormValues) {
    setFormState("loading");
    setErrorMessage(null);

    try {
      await authService.register(values);
      setFormState("success");
    } catch (error) {
      setFormState("error");
      setErrorMessage(
        error instanceof DuplicateEmailError
          ? "Ya existe una cuenta con ese email."
          : "No pudimos crear tu cuenta."
      );
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <section className="grid gap-4">
        <Badge tone="primary">Nueva cuenta</Badge>
        <div>
          <h1 className="text-h1">Crea tu perfil</h1>
          <p className="mt-2 text-body text-muted-foreground">
            Únete para participar en predicciones gratuitas, competir por puntos y desbloquear logros.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <FeaturePill icon={<Trophy className="size-4" aria-hidden="true" />} text="Rankings" />
          <FeaturePill icon={<Sparkles className="size-4" aria-hidden="true" />} text="Logros" />
          <FeaturePill icon={<ShieldCheck className="size-4" aria-hidden="true" />} text="Sin dinero real" />
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
            autoComplete="name"
            label="Nombre"
            placeholder="Tu nombre de comunidad"
            {...(errors.displayName?.message ? { errorMessage: errors.displayName.message } : {})}
            {...register("displayName")}
          />
          <Input
            autoComplete="email"
            label="Email"
            placeholder="tu@email.com"
            type="email"
            {...(errors.email?.message ? { errorMessage: errors.email.message } : {})}
            {...register("email")}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              autoComplete="new-password"
              label="Contraseña"
              type="password"
              {...(errors.password?.message ? { errorMessage: errors.password.message } : {})}
              {...register("password")}
            />
            <Input
              autoComplete="new-password"
              label="Confirmación de contraseña"
              type="password"
              {...(errors.confirmPassword?.message
                ? { errorMessage: errors.confirmPassword.message }
                : {})}
              {...register("confirmPassword")}
            />
          </div>

          <PasswordRequirements password={password} />

          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Ciudad (opcional)" placeholder="Bogotá" {...register("city")} />
            <Select
              label="Deporte favorito (opcional)"
              options={sportOptions}
              {...register("favoriteSportSlug")}
            />
          </div>

          {errorMessage ? (
            <p className="rounded-md border border-error/30 bg-error/10 p-3 text-caption font-semibold text-error">
              {errorMessage}
            </p>
          ) : null}

          {formState === "success" ? (
            <p className="rounded-md border border-success/30 bg-success/10 p-3 text-caption font-semibold text-success">
              Registro exitoso. Te llevaremos a iniciar sesión.
            </p>
          ) : null}

          <Button isLoading={formState === "loading"} type="submit">
            Crear cuenta
          </Button>
        </form>

        <div className="border-t border-border pt-4 text-center text-caption text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            className="font-semibold text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/login"
          >
            Iniciar sesión
          </Link>
        </div>
      </Card>
    </div>
  );
}

function PasswordRequirements({ password }: Readonly<{ password: string }>) {
  const requirements = [
    { isMet: password.length >= 8, label: "Mínimo 8 caracteres" },
    { isMet: /[A-Z]/.test(password), label: "Una mayúscula" },
    { isMet: /[a-z]/.test(password), label: "Una minúscula" },
    { isMet: /[0-9]/.test(password), label: "Un número" }
  ];

  return (
    <div className="grid gap-2 rounded-md bg-muted p-3" aria-label="Requisitos de contraseña">
      <p className="text-caption font-semibold text-foreground">Requisitos de password</p>
      <div className="grid gap-1 sm:grid-cols-2">
        {requirements.map((requirement) => (
          <span
            className={
              requirement.isMet
                ? "inline-flex items-center gap-2 text-caption text-success"
                : "inline-flex items-center gap-2 text-caption text-muted-foreground"
            }
            key={requirement.label}
          >
            <CheckCircle2 className="size-4" aria-hidden="true" />
            {requirement.label}
          </span>
        ))}
      </div>
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
