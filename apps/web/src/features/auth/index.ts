export const authFeature = {
  key: "auth",
  label: "Autenticacion"
} as const;

export { LoginPage } from "./components/login-page";
export { ForgotPasswordPage } from "./components/forgot-password-page";
export { RegisterPage } from "./components/register-page";
export {
  AuthService,
  DuplicateEmailError,
  InvalidCredentialsError,
  authService
} from "./services/auth.service";
export type {
  AuthenticatedSession,
  ForgotPasswordFormState,
  ForgotPasswordInput,
  LoginCredentials,
  LoginFormState,
  RegisterFormState,
  RegisterInput
} from "./types/auth";
