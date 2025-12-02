export const createCatalogImportData = (fileId: string) => ({
  fileId,
  importKind: "BUILDING_BLOCK",
  mode: "merge",
  withRefresh: true,
});
