import type { Identifier } from "@competencias-platform/contracts";
import { MockProfileRepository } from "../repositories/mock-profile.repository";
import type { ProfileRepository } from "../repositories/profile.repository";
import type { ProfileEditValues, ProfilePageData } from "../types/profile-page";

export type ProfileServiceDependencies = Readonly<{
  profileRepository?: ProfileRepository;
}>;

export class ProfileService {
  private readonly profileRepository: ProfileRepository;

  constructor(dependencies: ProfileServiceDependencies = {}) {
    this.profileRepository = dependencies.profileRepository ?? new MockProfileRepository();
  }

  getCurrentProfile(userId: Identifier): Promise<ProfilePageData | null> {
    return this.profileRepository.findCurrent(userId);
  }

  updateCurrentProfile(userId: Identifier, values: ProfileEditValues): Promise<ProfilePageData> {
    return this.profileRepository.updateCurrent(userId, values);
  }
}

export const profileService = new ProfileService();
