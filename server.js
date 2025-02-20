import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve static files from public directory
app.use(express.static("public"));

// Serve files from the files directory
app.use("/files", express.static(join(__dirname, "files")));

// Serve index.html for the root path
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Serving public files from: ${join(__dirname, "public")}`);
  console.log(`Serving blank files from: ${join(__dirname, "files")}`);
});
