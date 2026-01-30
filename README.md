# Blank Files

A collection of minimal valid blank files in various formats. These files are valid and open in the right software. This repo is the canonical source for the [Blank Files website](https://blankfiles.com) and is consumable via CDN or the NPM package `@filearchitect/blank-files`.

This collection focuses mainly on binary work files, not text-based files.

## Catalog schema (for bots and contributors)

The file list is in [files/files.json](files/files.json). It has a single key `files`, an array of objects:

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Extension / type id (e.g. `xlsx`, `pdf`). |
| `url` | string | Filename under `files/` (e.g. `blank.xlsx`). |
| `category` | string | Slug for grouping (e.g. `document-spreadsheet`, `image`). |
| `package` | boolean (optional) | If `true`, the file is served as `{url}.zip` (e.g. `blank.logicx.zip`). |

Example entry: `{ "type": "xlsx", "url": "blank.xlsx", "category": "document-spreadsheet" }`.

## Adding a file

1. Add the file under `files/` (e.g. `files/blank.xyz`).
2. Append an entry to [files/files.json](files/files.json) with `type`, `url`, `category`, and optional `package`.
3. Keep the file as small and minimal as possible.

Then open a Pull Request.

## Categories

These categories are used for grouping on the website and in the NPM package. They are broad and may evolve.

- 3D
- 3D-editing
- audio
- audio-editing
- document-text
- document-spreadsheet
- document-presentation
- image
- image-editing
- video
- video-editing
- CAD (Todo)
- etc. (suggestions and pull requests welcome)

## Consuming the catalog

### CDN

- **Catalog:** `{BASE_URL}/files/files.json` — returns the full `files` array.
- **File:** `{BASE_URL}/files/{url}` (or `{BASE_URL}/files/{url}.zip` when `package: true`).

Example: `https://raw.githubusercontent.com/filearchitect/blank-files/main/files/blank.xlsx`.

**Note:** Using `raw.githubusercontent.com` as the base is subject to GitHub rate limits. For higher traffic, use a CDN that mirrors the repo (e.g. [Statically](https://statically.io), [jsDelivr](https://www.jsdelivr.com)).

### NPM package

Install: `npm install @filearchitect/blank-files` (or pnpm/yarn).

From [src/index.ts](src/index.ts):

- **`listBlankFiles()`** — Returns a list of categories and their file types (for UI grouping). Uses the bundled `files/files.json`.
- **`getBlankFile(category, type)`** — Fetches the file from `/files/blank.{type}` and returns a `Blob`. Expects a local or same-origin server serving the `files/` directory unless you use a custom base URL (e.g. when running with the included `server.js` or against the live website’s download proxy).

## Automation

[.github/workflows/zip-files.yml](.github/workflows/zip-files.yml) runs on push to `main` when `files/**` changes (or on manual dispatch). It creates a ZIP of the `files/` directory and uploads it to a GitHub Release with tag `latest`. Use this artifact if you need a single ZIP of all blank files.

## Website

The [Blank Files website](https://blankfiles.com) and its [source repo](https://github.com/filearchitect/blankfiles-website) consume this catalog via a configurable CDN URL and provide browse/download and an API.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Some of the images and documents are from [VerifyTests/EmptyFiles](https://github.com/VerifyTests/EmptyFiles) and are licensed under the MIT License.
