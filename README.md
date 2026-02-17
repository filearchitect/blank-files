# Blank Files

A collection of minimal valid blank files in various formats. These files are valid and open in the right software. This repo is the canonical source for the [Blank Files website](https://blankfiles.com) and is consumable via CDN.

This collection focuses mainly on binary work files, not text-based files.

Current catalog size: **104 formats**.

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

These categories are used for grouping on the website and in catalog consumers. They are broad and may evolve.

- 3D
- 3D-editing
- archive
- audio
- audio-editing
- data
- database
- document-text
- document-spreadsheet
- document-presentation
- font
- image
- image-editing
- network
- video
- video-editing

Suggestions and pull requests for additional binary formats are welcome.

## Consuming the catalog

### CDN

- **Catalog:** `{BASE_URL}/files/files.json` — returns the full `files` array.
- **File:** `{BASE_URL}/files/{url}` (or `{BASE_URL}/files/{url}.zip` when `package: true`).

Example: `https://raw.githubusercontent.com/filearchitect/blank-files/main/files/blank.xlsx`.

**Note:** Using `raw.githubusercontent.com` as the base is subject to GitHub rate limits. For higher traffic, use a CDN that mirrors the repo (e.g. [jsDelivr](https://www.jsdelivr.com)).

### JavaScript package status

The repository contains package code in `package.json` and `src/`, but `@filearchitect/blank-files` is currently not published on npm.

Until publishing, consume files via CDN endpoints above or directly from this repository.

## Automation

[.github/workflows/zip-files.yml](.github/workflows/zip-files.yml) runs on push to `main` when `files/**` changes (or on manual dispatch). It creates a ZIP of the `files/` directory and uploads it to a GitHub Release with tag `latest`. Use this artifact if you need a single ZIP of all blank files.

## Website

The [Blank Files website](https://blankfiles.com) and its [source repo](https://github.com/filearchitect/blankfiles-website) consume this catalog via a configurable CDN URL and provide browse/download and an API.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Some of the images and documents are from [VerifyTests/EmptyFiles](https://github.com/VerifyTests/EmptyFiles) and are licensed under the MIT License.
