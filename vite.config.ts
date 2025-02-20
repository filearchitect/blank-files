import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "demo",
  // Explicitly set the base URL
  base: "/",
  // Configure static file handling
  server: {
    fs: {
      strict: false,
      allow: [".."],
    },
  },
  // Configure build options
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  // Configure plugins to handle static files
  plugins: [
    {
      name: "handle-static-files",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url;

          if (url?.startsWith("/files/")) {
            // Get the absolute path to the files directory
            const filesDir = resolve(__dirname, "files");
            // Remove the /files/ prefix and construct the file path
            const relativePath = url.slice("/files/".length);
            const filePath = resolve(filesDir, relativePath);

            console.log("Debug info:");
            console.log("- Request URL:", url);
            console.log("- Files directory:", filesDir);
            console.log("- Relative path:", relativePath);
            console.log("- Resolved file path:", filePath);

            try {
              // Check if file exists and get stats
              const stats = await stat(filePath);
              console.log("- File exists:", true);
              console.log("- File size:", stats.size, "bytes");

              // Get file extension and set MIME type
              const ext = relativePath.split(".").pop()?.toLowerCase() || "";
              const mimeType = getMimeType(ext);
              console.log("- File extension:", ext);
              console.log("- MIME type:", mimeType);

              // Set response headers
              res.setHeader("Content-Type", mimeType);
              res.setHeader("Content-Length", stats.size);
              res.setHeader("Content-Disposition", "attachment");

              // Create a read stream with explicit encoding for text files
              const stream = createReadStream(
                filePath,
                ext === "txt" ? { encoding: "utf8" } : undefined
              );

              stream.on("error", (error) => {
                console.error("Stream error:", error);
                res.statusCode = 500;
                res.end("Error reading file");
              });

              // For debugging, log the first chunk of data
              let isFirstChunk = true;
              stream.on("data", (chunk) => {
                if (isFirstChunk) {
                  console.log(
                    "- First chunk of data:",
                    chunk.toString().slice(0, 100)
                  );
                  isFirstChunk = false;
                }
              });

              stream.pipe(res);
            } catch (error) {
              console.error("File access error:", error);
              res.statusCode = 404;
              res.end("File not found");
            }
            return;
          }
          next();
        });
      },
    },
  ],
});

// Reuse the same MIME type function
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    txt: "text/plain",
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    rtf: "application/rtf",
    odt: "application/vnd.oasis.opendocument.text",
  };
  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}
