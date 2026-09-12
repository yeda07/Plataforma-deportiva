import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./login-page";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock
  })
}));

describe("LoginPage", () => {
  beforeEach(() => {
    replaceMock.mockClear();
  });

  it("shows validation errors for incomplete credentials", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "corta" } });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(await screen.findByText("La contraseña debe tener al menos 8 caracteres.")).toBeInTheDocument();
  });

  it("shows an error for invalid credentials", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "usuario1@competencias.local" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "password-wrong" }
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(await screen.findByText("Email o contraseña incorrectos.")).toBeInTheDocument();
  });

  it("logs in with demo credentials and schedules redirect", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "usuario1@competencias.local" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(await screen.findByText("Sesión iniciada. Redirigiendo al inicio.")).toBeInTheDocument();

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/");
    }, { timeout: 1_500 });
  });
});
