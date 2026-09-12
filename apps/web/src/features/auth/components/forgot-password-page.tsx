"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge, Button, Card, Input } from "@competencias-platform/ui";
import { authService } from "../services/auth.service";
import type { ForgotPasswordFormState } from "../types/auth";

const forgotPasswordSchema = z.object({
  email: z.email("Ingresa un email válido.")
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const neutralMessage =
  "Si existe una cuenta asociada al correo, recibirás instrucciones para recuperar tu contraseña.";
const privacyMessage = "Por seguridad, no confirmamos si el correo está registrado.";

export function ForgotPasswordPage() {
  const [formState, setFormState] = useState<ForgotPasswordFormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: ""
    },
    resolver: zodResolver(forgotPasswordSchema)
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setFormState("loading");
    setErrorMessage(null);

    try {
      await authService.forgotPassword(values);
      setFormState("success");
    } catch {
      setFormState("error");
      setErrorMessage("No pudimos procesar la solicitud. Intenta nuevamente.");
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6">
      <section className="grid gap-3 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Mail className="size-6" aria-hidden="true" />
        </div>
        <Badge className="mx-auto" tone="primary">
          Recuperación
        </Badge>
        <div>
          <h1 className="text-h1">Recuperar contraseña</h1>
          <p className="mt-2 text-body text-muted-foreground">
            Ingresa tu correo y enviaremos instrucciones si la cuenta existe.
          </p>
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
            placeholder="tu@email.com"
            type="email"
            {...(errors.email?.message ? { errorMessage: errors.email.message } : {})}
            {...register("email")}
          />

          {formState === "success" ? (
            <div className="rounded-md border border-success/30 bg-success/10 p-3 text-caption text-success">
              <p className="font-semibold">Solicitud recibida.</p>
              <p className="mt-1">{neutralMessage}</p>
              <p className="mt-1">{privacyMessage}</p>
            </div>
          ) : null}

          {errorMessage ? (
            <p className="rounded-md border border-error/30 bg-error/10 p-3 text-caption font-semibold text-error">
              {errorMessage}
            </p>
          ) : null}

          <Button isLoading={formState === "loading"} type="submit">
            Enviar instrucciones
          </Button>
        </form>

        <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-caption text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p>{privacyMessage}</p>
        </div>

        <div className="border-t border-border pt-4 text-center text-caption text-muted-foreground">
          ¿Recordaste tu contraseña?{" "}
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

