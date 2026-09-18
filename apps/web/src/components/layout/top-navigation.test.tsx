import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { developmentUserId } from "@/config/session";
import { profileService } from "@/features/profile/services/profile.service";
import { TopNavigation } from "./top-navigation";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TopNavigation", () => {
  it("shows the current profile and refreshes its name after an edit", async () => {
    const data = await profileService.getCurrentProfile(developmentUserId);

    if (!data) {
      throw new Error("Missing development profile");
    }

    const getCurrentProfile = vi.spyOn(profileService, "getCurrentProfile").mockResolvedValue(data);
    render(<TopNavigation />);

    expect(await screen.findByRole("link", { name: `Ir al perfil de ${data.profile.displayName}` })).toBeInTheDocument();

    getCurrentProfile.mockResolvedValue({
      ...data,
      profile: { ...data.profile, displayName: "Nombre actualizado" }
    });

    act(() => {
      window.dispatchEvent(new Event("profile-updated"));
    });

    expect(await screen.findByRole("link", { name: "Ir al perfil de Nombre actualizado" })).toBeInTheDocument();
  });
});
