import type { User } from "@competencias-platform/contracts";

export type LoginCredentials = Readonly<{
  email: string;
  password: string;
  rememberMe: boolean;
}>;

export type RegisterInput = Readonly<{
  city: string;
  confirmPassword: string;
  displayName: string;
  email: string;
  favoriteSportSlug: string;
  password: string;
}>;

export type ForgotPasswordInput = Readonly<{
  email: string;
}>;

export type AuthenticatedSession = Readonly<{
  rememberMe: boolean;
  user: User;
}>;

export type LoginFormState = "idle" | "loading" | "error" | "success";
export type RegisterFormState = LoginFormState;
export type ForgotPasswordFormState = LoginFormState;
