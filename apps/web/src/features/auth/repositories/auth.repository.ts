import type {
  AuthenticatedSession,
  ForgotPasswordInput,
  LoginCredentials,
  RegisterInput
} from "../types/auth";

export type AuthRepository = Readonly<{
  forgotPassword: (input: ForgotPasswordInput) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<AuthenticatedSession>;
  register: (input: RegisterInput) => Promise<AuthenticatedSession>;
}>;
