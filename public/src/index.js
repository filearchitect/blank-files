const BLANK_FILES = {
  documents: ["doc", "docx", "pdf", "txt"],
  images: ["jpg", "png", "gif"],
  spreadsheets: ["xls", "xlsx", "csv"],
};

export async function listBlankFiles() {
  try {
    const response = await fetch("/files/index.json");
    const data = await response.json();

    // Group files by category
    const groupedFiles = data.files.reduce((acc, file) => {
      if (!acc[file.category]) {
        acc[file.category] = [];
      }
      acc[file.category].push(file.type);
      return acc;
    }, {});

    // Convert to array format expected by UI
    return Object.entries(groupedFiles).map(([category, types]) => ({
      name: category,
      types: types,
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

    const fileData = data.files.find(
      (file) => file.category === category && file.type === type
    );

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
    throw error;
  }
}
