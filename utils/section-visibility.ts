export type SectionVisibility = {
  id: string;
  visibility: "visible" | "hidden" | "protected";
  password?: string;
  hint?: string;
};

export function getSectionVisibility(
  sectionVisibility: SectionVisibility[] = [],
  sectionId: string,
) {
  return sectionVisibility.find((item) => item.id === sectionId) ?? null;
}

export function isSectionHidden(
  sectionVisibility: SectionVisibility[] = [],
  sectionId: string,
) {
  return (
    getSectionVisibility(sectionVisibility, sectionId)?.visibility === "hidden"
  );
}

export function isSectionProtected(
  sectionVisibility: SectionVisibility[] = [],
  sectionId: string,
) {
  return (
    getSectionVisibility(sectionVisibility, sectionId)?.visibility ===
    "protected"
  );
}

export function getSectionPassword(
  sectionVisibility: SectionVisibility[] = [],
  sectionId: string,
) {
  return getSectionVisibility(sectionVisibility, sectionId)?.password ?? "";
}

export function getSectionConfig(
  sectionVisibility: SectionVisibility[] = [],
  sectionId: string,
) {
  const config = sectionVisibility.find((item) => item.id === sectionId);

  return {
    hidden: config?.visibility === "hidden",
    protected: config?.visibility === "protected",
    password: config?.password ?? "",
    hint: config?.hint ?? "",
  };
}
