import type { Identifier, User } from "@competencias-platform/contracts";
import { users } from "@/mocks";
import type { AuthRepository } from "./auth.repository";
import type {
  AuthenticatedSession,
  ForgotPasswordInput,
  LoginCredentials,
  RegisterInput
} from "../types/auth";

const demoPassword = "password123";
let userStore: User[] = [...users];

function createUserId(): Identifier {
  return crypto.randomUUID() as Identifier;
}

function createUsername(displayName: string): string {
  return displayName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export class MockAuthRepository implements AuthRepository {
  forgotPassword(input: ForgotPasswordInput): Promise<void> {
    const normalizedEmail = input.email.trim().toLowerCase();
    void userStore.find((user) => user.email === normalizedEmail);

    return Promise.resolve();
  }

  login(credentials: LoginCredentials): Promise<AuthenticatedSession> {
    const user = userStore.find((item) => item.email === credentials.email.trim().toLowerCase());

    if (!user || credentials.password !== demoPassword) {
      return Promise.reject(new Error("Invalid credentials"));
    }

    return Promise.resolve({
      rememberMe: credentials.rememberMe,
      user
    });
  }

  register(input: RegisterInput): Promise<AuthenticatedSession> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existingUser = userStore.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      return Promise.reject(new Error("Duplicate email"));
    }

    const now = new Date().toISOString();
    const user: User = {
      id: createUserId(),
      email: normalizedEmail,
      username: createUsername(input.displayName),
      role: "USER",
      createdAt: now,
      updatedAt: now
    };

    userStore = [user, ...userStore];

    return Promise.resolve({
      rememberMe: true,
      user
    });
  }
}
