export async function listBlankFiles() {
  try {
    const response = await fetch("/files/files.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Loaded files data:", data);

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
    throw error; // Re-throw to let the UI handle it
  }
}

export async function getBlankFile(category, type) {
  try {
    const fileUrl = `/files/blank.${type}`;
    console.log("Fetching file from:", fileUrl);

    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`HTTP error! status: ${fileResponse.status}`);
    }
    return await fileResponse.blob();
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}
