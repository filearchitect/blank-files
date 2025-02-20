const BLANK_FILES = {
  documents: ["doc", "docx", "pdf", "txt"],
  images: ["jpg", "png", "gif"],
  spreadsheets: ["xls", "xlsx", "csv"],
};

export async function listBlankFiles() {
  try {
    const response = await fetch("/files/index.json");
    const data = await response.json();
    return data.categories.map((cat) => ({
      name: cat.name,
      types: cat.files.map((file) => file.type),
    }));
  } catch (error) {
    console.error("Error loading file index:", error);
    return [];
  }
}

export async function getBlankFile(category, type) {
  try {
    const response = await fetch("/files/index.json");
    const data = await response.json();

    const categoryData = data.categories.find((cat) => cat.name === category);
    const fileData = categoryData?.files.find((file) => file.type === type);

    if (!fileData) {
      throw new Error("File not found");
    }

    const fileResponse = await fetch(`/files/${category}/${fileData.url}`);
    if (!fileResponse.ok) {
      throw new Error("File not found");
    }
    return await fileResponse.blob();
  } catch (error) {
    console.error("Error fetching file:", error);
    return null;
  }
}
