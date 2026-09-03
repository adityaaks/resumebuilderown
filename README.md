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
- **Structured sections** — header, summary, skills, experience (with bullet points), projects (with links), education, awards — each addable/removable.
- **Export to PDF** via [jsPDF](https://github.com/parallax/jsPDF).
- **Export to DOCX** — hand-built OOXML zipped with [JSZip](https://stuk.github.io/jszip/), no server required.
- **Export/import JSON** — save your data, reload it later, or paste it in directly. A sample JSON file is available from the "Upload / Copy JSON" menu to see the expected shape.
- **Responsive** — side-by-side editor/preview on wide screens, stacked with quick-jump tabs on mobile.

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
  "skills": [{ "label": "", "items": "" }],
  "experience": [{ "title": "", "company": "", "dates": "", "bullets": [""] }],
  "projects": [{ "name": "", "description": "", "links": [{ "label": "", "url": "" }] }],
  "education": [{ "degree": "", "dates": "", "school": "" }],
  "awards": [""]
}
```

Empty fields and empty sections are simply skipped in the exported files.
