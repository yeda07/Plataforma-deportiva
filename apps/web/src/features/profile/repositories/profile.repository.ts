import type { Identifier } from "@competencias-platform/contracts";
import type { ProfileEditValues, ProfilePageData } from "../types/profile-page";

export type ProfileRepository = Readonly<{
  findCurrent: (userId: Identifier) => Promise<ProfilePageData | null>;
  updateCurrent: (userId: Identifier, values: ProfileEditValues) => Promise<ProfilePageData>;
}>;
