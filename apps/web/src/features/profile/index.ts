export const profileFeature = {
  key: "profile",
  label: "Perfil"
} as const;

export { AchievementCard } from "./components/achievement-card";
export type { AchievementCardProps } from "./components/achievement-card";
export { EditProfileModal } from "./components/edit-profile-modal";
export type { EditProfileModalProps } from "./components/edit-profile-modal";
export { ProfilePage } from "./components/profile-page";
export { ProfileService, profileService } from "./services/profile.service";
export type {
  ProfileActivityItem,
  ProfileEditValues,
  ProfilePageData,
  ProfileStats
} from "./types/profile-page";
