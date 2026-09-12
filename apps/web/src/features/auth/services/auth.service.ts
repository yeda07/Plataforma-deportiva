import { MockAuthRepository } from "../repositories/mock-auth.repository";
import type { AuthRepository } from "../repositories/auth.repository";
import type {
  AuthenticatedSession,
  ForgotPasswordInput,
  LoginCredentials,
  RegisterInput
} from "../types/auth";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}

export class DuplicateEmailError extends Error {
  constructor() {
    super("Duplicate email");
    this.name = "DuplicateEmailError";
  }
}

export type AuthServiceDependencies = Readonly<{
  authRepository?: AuthRepository;
}>;

export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor(dependencies: AuthServiceDependencies = {}) {
    this.authRepository = dependencies.authRepository ?? new MockAuthRepository();
  }

  async login(credentials: LoginCredentials): Promise<AuthenticatedSession> {
    try {
      return await this.authRepository.login({
        ...credentials,
        email: credentials.email.trim().toLowerCase()
      });
    } catch {
      throw new InvalidCredentialsError();
    }
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    await this.authRepository.forgotPassword({
      email: input.email.trim().toLowerCase()
    });
  }

  async register(input: RegisterInput): Promise<AuthenticatedSession> {
    try {
      return await this.authRepository.register({
        ...input,
        email: input.email.trim().toLowerCase()
      });
    } catch {
      throw new DuplicateEmailError();
    }
  }
}

export const authService = new AuthService();
