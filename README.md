# Resume Builder

A single-page, no-build resume builder that runs entirely in the browser. Fill in a form, watch a live preview update as you type, and export the result to **PDF**, **DOCX**, or **JSON** — nothing is ever uploaded anywhere.

## Project structure

```
.
├── index.html      # markup: header, editor pane, live-preview pane, upload/JSON modal
├── css/
│   └── style.css   # visual design, layout (split editor/preview), responsive rules
├── js/
│   └── app.js       # state, form rendering, live preview, PDF/DOCX/JSON generation
└── README.md
```

## Running it

No install, no build step — just open [index.html](index.html) in a browser, or serve the folder statically, e.g. with Node:

```bash
npx serve .
```

or, on Windows without Node installed, with the bundled PowerShell static server:

```bash
powershell -File tools/serve.ps1 -Port 5173
```

## Features

- **Live preview** — the right-hand pane mirrors the exported PDF/DOCX layout and updates as you type.
- **Templates** — pick from Classic (centered, underlined headings), Modern (left-aligned, teal accent bar), or Minimal (monochrome, no rules) at the top of the form. The choice applies consistently to the live preview, PDF, and DOCX.
- **Editable section titles** — rename any heading ("Live Projects", "Education", etc.) by clicking directly on it in the form; carries through to every export.
- **Structured sections** — header, summary, skills, experience (with bullet points), projects (with links), education, awards — each addable/removable.
- **Export to PDF** via [jsPDF](https://github.com/parallax/jsPDF).
- **Export to DOCX** — hand-built OOXML zipped with [JSZip](https://stuk.github.io/jszip/), no server required.
- **Export/import JSON** — save your data, reload it later, or paste it in directly. A sample JSON file is available from the "Upload / Copy JSON" menu to see the expected shape.
- **Responsive** — side-by-side editor/preview on wide screens; on narrow screens the editor takes the full width and the live preview is hidden (use Download to see the result).

## Data model

The form (and the JSON you can upload/download) follows this shape:

```json
{
  "name": "",
  "title": "",
  "location": "",
  "phone": "",
  "email": "",
  "portfolioUrl": "",
  "linkedinUrl": "",
  "summary": "",
  "template": "classic",
  "sectionTitles": {
    "summary": "Professional Summary",
    "skills": "Core Skills",
    "experience": "Professional Experience",
    "projects": "Live Projects",
    "education": "Education",
    "awards": "Awards"
  },
  "skills": [{ "label": "", "items": "" }],
  "experience": [{ "title": "", "company": "", "dates": "", "bullets": [""] }],
  "projects": [{ "name": "", "description": "", "links": [{ "label": "", "url": "" }] }],
  "education": [{ "degree": "", "dates": "", "school": "" }],
  "awards": [""]
}
```

`"template"` is one of `"classic"`, `"modern"`, or `"minimal"` (see `TEMPLATES` in [js/app.js](js/app.js)); an unrecognized or missing value falls back to `"classic"`.

Empty fields and empty sections are simply skipped in the exported files. Each section heading (`Professional Summary`, `Core Skills`, etc.) is editable in place — click directly on the heading text in the form to rename it (e.g. "Live Projects" → "Selected Projects"); the custom name carries through to the live preview, PDF, and DOCX. Leaving one blank falls back to its default name.
