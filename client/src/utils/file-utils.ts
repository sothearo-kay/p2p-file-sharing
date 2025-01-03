export const categorizeFiles = <T extends { type: string }>(files: T[]) => {
  return files.reduce(
    (acc, file) => {
      if (file.type.includes("image")) {
        acc.imageFiles.push(file);
      } else {
        acc.otherFiles.push(file);
      }
      return acc;
    },
    { imageFiles: [] as T[], otherFiles: [] as T[] },
  );
};
