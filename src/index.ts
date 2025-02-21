// Browser-only version
import categoriesData from "../files/index.json" assert { type: "json" };

interface FileData {
  type: string;
  url: string;
  category: string;
}

export async function listBlankFiles() {
  // Group files by category
  const groupedFiles = categoriesData.files.reduce(
    (acc: Record<string, string[]>, file: FileData) => {
      if (!acc[file.category]) {
        acc[file.category] = [];
      }
      acc[file.category].push(file.type);
      return acc;
    },
    {}
  );

  // Convert to array format expected by UI
  return Object.entries(groupedFiles).map(([category, types]) => ({
    name: category,
    types: types,
  }));
}

export async function getBlankFile(category: string, type: string) {
  const fileUrl = `/files/${category}/blank.${type}`;
  console.log(`Fetching blank file: ${fileUrl}`);

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      console.error(
        `Failed to fetch file: ${response.status} ${response.statusText}`
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) === 0) {
      console.error("Server returned an empty file");
      throw new Error("Empty file received");
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength === 0) {
      console.error("Received empty buffer");
      throw new Error("Empty file received");
    }

    console.log(`Successfully received file: ${buffer.byteLength} bytes`);
    return new Blob([buffer]);
  } catch (error) {
    console.error(`Error fetching ${category}/${type}:`, error);
    throw error; // Re-throw to let the UI handle the error
  }
}
