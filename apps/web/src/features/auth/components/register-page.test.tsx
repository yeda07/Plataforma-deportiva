import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RegisterPage } from "./register-page";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock
  })
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    replaceMock.mockClear();
  });

  it("shows visible validation errors", async () => {
    render(<RegisterPage />);

    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(await screen.findByText("El nombre debe tener al menos 3 caracteres.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa un email válido.")).toBeInTheDocument();
    expect(screen.getByText("La contraseña debe tener al menos 8 caracteres.")).toBeInTheDocument();
  });

  it("shows duplicated email error", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Usuario Demo" } });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "usuario1@competencias.local" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Password1" } });
    fireEvent.change(screen.getByLabelText("Confirmación de contraseña"), {
      target: { value: "Password1" }
    });
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(await screen.findByText("Ya existe una cuenta con ese email.")).toBeInTheDocument();
  });

  it("submits a valid registration successfully", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Nueva Persona" } });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: `persona-${Date.now().toString()}@competencias.local` }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Password1" } });
    fireEvent.change(screen.getByLabelText("Confirmación de contraseña"), {
      target: { value: "Password1" }
    });
    fireEvent.change(screen.getByLabelText("Ciudad (opcional)"), { target: { value: "Bogotá" } });
    fireEvent.change(screen.getByLabelText("Deporte favorito (opcional)"), {
      target: { value: "football" }
    });
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(await screen.findByText("Registro exitoso. Te llevaremos a iniciar sesión.")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Registro exitoso. Te llevaremos a iniciar sesión.")).toBeInTheDocument();
    });
  });
});
