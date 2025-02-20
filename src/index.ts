// Browser-only version
import categoriesData from "../files/index.json" assert { type: "json" };

export async function listBlankFiles() {
  return categoriesData.categories.map((cat) => ({
    name: cat.name,
    types: cat.files.map((f) => f.type),
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
