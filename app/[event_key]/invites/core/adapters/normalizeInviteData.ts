export function normalizeInviteData(raw: any) {
  return {
    couple: {
      bride: raw?.announcement?.bride?.name ?? "Bride",
      groom: raw?.announcement?.groom?.name ?? "Groom",
    },
    bannerMessage: raw?.announcement?.message ?? "",
    schedule: raw?.schedule ?? [],
    galleryItems: raw?.gallery?.items ?? [],
    wishesConfig: raw?.wishes ?? {
      enabled: false,
      limit: 25,
      title: "Send Your Wishes",
      types: ["text"],
    },
    wishesList: raw?.wishes_list ?? [], // or raw?.wishesData
  };
}
