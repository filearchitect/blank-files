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
    const mimeType = getMimeType(type);
    return new Blob([buffer], { type: mimeType });
  } catch (error) {
    console.error(`Error fetching ${category}/${type}:`, error);
    throw error; // Re-throw to let the UI handle the error
  }
}

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    // Images
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    bmp: "image/bmp",
    tiff: "image/tiff",
    tif: "image/tiff",

    // Documents
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Design
    ai: "application/postscript",
    psd: "image/vnd.adobe.photoshop",

    // Other
    txt: "text/plain",
    rtf: "application/rtf",
    odt: "application/vnd.oasis.opendocument.text",
    ods: "application/vnd.oasis.opendocument.spreadsheet",
    odp: "application/vnd.oasis.opendocument.presentation",
  };

  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}
