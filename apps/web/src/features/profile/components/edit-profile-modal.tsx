"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Modal, Select } from "@competencias-platform/ui";
import type { ProfileEditValues, ProfilePageData } from "../types/profile-page";

const profileFormSchema = z.object({
  bio: z.string().max(160, "La biografía no puede superar 160 caracteres."),
  city: z.string().min(2, "Ingresa una ciudad válida.").max(60, "La ciudad es demasiado larga."),
  displayName: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(40, "El nombre no puede superar 40 caracteres."),
  favoriteSportSlug: z.string().min(1, "Selecciona un deporte.")
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export type EditProfileModalProps = Readonly<{
  data: ProfilePageData;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ProfileEditValues) => Promise<void>;
}>;

export function EditProfileModal({ data, isOpen, onClose, onSubmit }: EditProfileModalProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<ProfileFormValues>({
    defaultValues: {
      bio: data.profile.bio ?? "",
      city: data.city,
      displayName: data.profile.displayName,
      favoriteSportSlug: data.favoriteSport.slug
    },
    resolver: zodResolver(profileFormSchema)
  });

  useEffect(() => {
    reset({
      bio: data.profile.bio ?? "",
      city: data.city,
      displayName: data.profile.displayName,
      favoriteSportSlug: data.favoriteSport.slug
    });
  }, [data, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar perfil">
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          void handleSubmit(async (values) => {
            await onSubmit(values);
            onClose();
          })(event);
        }}
      >
        <Input
          label="Nombre"
          {...(errors.displayName?.message ? { errorMessage: errors.displayName.message } : {})}
          {...register("displayName")}
        />
        <Input
          label="Ciudad"
          {...(errors.city?.message ? { errorMessage: errors.city.message } : {})}
          {...register("city")}
        />
        <Select
          label="Deporte favorito"
          options={data.sports.map((sport) => ({
            label: sport.name,
            value: sport.slug
          }))}
          {...register("favoriteSportSlug")}
        />
        {errors.favoriteSportSlug ? (
          <p className="text-caption text-error">{errors.favoriteSportSlug.message}</p>
        ) : null}
        <label className="grid gap-2 text-label text-foreground">
          <span>Biografía</span>
          <textarea
            className="min-h-24 w-full rounded-md border border-input bg-surface px-3 py-2 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55"
            {...register("bio")}
          />
          {errors.bio ? <span className="text-caption text-error">{errors.bio.message}</span> : null}
        </label>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button isLoading={isSubmitting} type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
