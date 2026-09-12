import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BottomNavigation } from "./bottom-navigation";

const usePathnameMock = vi.fn(() => "/");

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock()
}));

describe("BottomNavigation", () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue("/");
  });

  it("renders the primary mobile navigation links", () => {
    render(<BottomNavigation />);

    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Explorar" })).toHaveAttribute("href", "/explore");
    expect(screen.getByRole("link", { name: "En vivo" })).toHaveAttribute("href", "/live");
    expect(screen.getByRole("link", { name: "Ranking" })).toHaveAttribute("href", "/ranking");
    expect(screen.getByRole("link", { name: "Perfil" })).toHaveAttribute("href", "/profile");
  });

  it("marks nested routes as active", () => {
    usePathnameMock.mockReturnValue("/ranking");

    render(<BottomNavigation />);

    expect(screen.getByRole("link", { name: "Ranking" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveAttribute("aria-current");
  });
});
