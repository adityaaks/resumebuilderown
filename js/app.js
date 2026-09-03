/* ---------------------------------------------------------------------
   1. STATE — starts empty; fill in the form or upload a JSON file
--------------------------------------------------------------------- */
const DEFAULT_SECTION_TITLES = {
  summary: "Professional Summary",
  skills: "Core Skills",
  experience: "Professional Experience",
  projects: "Live Projects",
  education: "Education",
  awards: "Awards"
};

const DEFAULT_TEMPLATE = "classic";

// Colors are hex without "#" so DOCX (which wants bare hex) can use them directly;
// hexToRgb() below converts them to 0-255 arrays for the PDF generator.
const TEMPLATES = {
  classic: {
    label: "Classic",
    desc: "Centered header, underlined headings",
    colors: { navy: "1F2937", accent: "2A5C8A", grey: "444444" },
    align: "center",
    heading: "underline"
  },
  modern: {
    label: "Modern",
    desc: "Left-aligned, teal accent bar",
    colors: { navy: "16233A", accent: "0D9488", grey: "3F3F46" },
    align: "left",
    heading: "bar"
  },
  minimal: {
    label: "Minimal",
    desc: "Monochrome, hairline rules, refined type",
    colors: { navy: "1A1A1A", accent: "55606B", grey: "3D4148" },
    align: "left",
    heading: "plain",
    noItalic: true,
    headerRule: true,
    titleStyle: "caps"
  }
};

function getTemplate(key) {
  return TEMPLATES[key] || TEMPLATES[DEFAULT_TEMPLATE];
}
function hexToRgb(hex) {
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

let resumeData = {
  name: "",
  title: "",
  location: "",
  phone: "",
  email: "",
  portfolioUrl: "",
  linkedinUrl: "",
  summary: "",
  template: DEFAULT_TEMPLATE,
  sectionTitles: { ...DEFAULT_SECTION_TITLES },
  skills: [],
  experience: [],
  projects: [],
  education: [],
  awards: []
};

/* ---------------------------------------------------------------------
   1b. SAMPLE DATA — fully fictional, used only for "Download Sample JSON"
--------------------------------------------------------------------- */
const sampleResumeData = {
  name: "JORDAN A. RIVERA",
  title: "SENIOR BACKEND DEVELOPER",
  location: "Springfield, IL, USA",
  phone: "+1-555-0142",
  email: "jordan.rivera@example.com",
  portfolioUrl: "https://jordanrivera.example.com",
  linkedinUrl: "https://www.linkedin.com/in/jordan-rivera-example/",
  summary: "Backend Developer with 5+ years of experience designing and scaling REST and GraphQL APIs for e-commerce and fintech platforms. Skilled in Node.js, PostgreSQL, and distributed systems, with a track record of reducing latency and leading small engineering teams through production incidents.",
  template: DEFAULT_TEMPLATE,
  sectionTitles: { ...DEFAULT_SECTION_TITLES },
  skills: [
    { label: "Backend Development", items: "Node.js, Express, GraphQL, REST APIs, Microservices" },
    { label: "Databases", items: "PostgreSQL, MongoDB, Redis" },
    { label: "Cloud & DevOps", items: "AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD" },
    { label: "Tools & Practices", items: "Git, Jest, Agile / Scrum" }
  ],
  experience: [
    { title: "Senior Backend Developer", company: "Example Fintech Inc.", dates: "Mar 2022 – Present", bullets: [
      "Led migration of a monolithic payments service into microservices, reducing average response time by 35%.",
      "Designed a rate-limiting layer that cut fraudulent transaction attempts by 60%.",
      "Mentored two junior engineers and introduced a code review checklist adopted team-wide."
    ]},
    { title: "Backend Developer", company: "Sample Commerce Co.", dates: "Jul 2019 – Feb 2022", bullets: [
      "Built and maintained REST APIs powering a checkout flow handling 10,000+ daily transactions.",
      "Implemented caching with Redis, reducing database load by 40% during peak sales events."
    ]}
  ],
  projects: [
    { name: "Sample Inventory Tracker", description: "An internal tool for tracking warehouse stock levels in real time, built with Node.js and PostgreSQL.",
      links: [ { label: "Website", url: "https://example.com/inventory-tracker" } ] },
    { name: "Sample Budgeting App", description: "A personal finance app helping users track spending and set monthly budgets.",
      links: [ { label: "App Store", url: "https://apps.apple.com/example" }, { label: "Google Play", url: "https://play.google.com/example" } ] }
  ],
  education: [
    { degree: "Bachelor of Science, Computer Science", dates: "2015 – 2019", school: "State University of Example — GPA 3.6/4.0" }
  ],
  awards: [ "“Spot Award” for Incident Response Leadership — Example Fintech Inc. (2023)" ]
};

/* ---------------------------------------------------------------------
   2. STATE MUTATORS — each one also refreshes the live preview
--------------------------------------------------------------------- */
function updateField(field, value) { resumeData[field] = value; renderPreview(); }
function updateSectionTitle(key, value) { resumeData.sectionTitles[key] = value; renderPreview(); }
function selectTemplate(key) { resumeData.template = key; render(); }
function updateSkill(i, field, value) { resumeData.skills[i][field] = value; renderPreview(); }
function addSkill() { resumeData.skills.push({ label: "", items: "" }); render(); }
function removeSkill(i) { resumeData.skills.splice(i, 1); render(); }

function updateJob(i, field, value) { resumeData.experience[i][field] = value; renderPreview(); }
function addJob() { resumeData.experience.push({ title: "", company: "", dates: "", bullets: [""] }); render(); }
function removeJob(i) { resumeData.experience.splice(i, 1); render(); }
function updateBullet(ji, bi, value) { resumeData.experience[ji].bullets[bi] = value; renderPreview(); }
function addBullet(ji) { resumeData.experience[ji].bullets.push(""); render(); }
function removeBullet(ji, bi) { resumeData.experience[ji].bullets.splice(bi, 1); render(); }

function updateProject(i, field, value) { resumeData.projects[i][field] = value; renderPreview(); }
function addProject() { resumeData.projects.push({ name: "", description: "", links: [{ label: "", url: "" }] }); render(); }
function removeProject(i) { resumeData.projects.splice(i, 1); render(); }
function updateProjectLink(pi, li, field, value) { resumeData.projects[pi].links[li][field] = value; renderPreview(); }
function addProjectLink(pi) { resumeData.projects[pi].links.push({ label: "", url: "" }); render(); }
function removeProjectLink(pi, li) { resumeData.projects[pi].links.splice(li, 1); render(); }

function updateEdu(i, field, value) { resumeData.education[i][field] = value; renderPreview(); }
function addEdu() { resumeData.education.push({ degree: "", dates: "", school: "" }); render(); }
function removeEdu(i) { resumeData.education.splice(i, 1); render(); }

function updateAward(i, value) { resumeData.awards[i] = value; renderPreview(); }
function addAward() { resumeData.awards.push(""); render(); }
function removeAward(i) { resumeData.awards.splice(i, 1); render(); }

/* ---------------------------------------------------------------------
   2b. JSON IMPORT
--------------------------------------------------------------------- */
function normalizeData(parsed) {
  const defaults = {
    name: "", title: "", location: "", phone: "", email: "",
    portfolioUrl: "", linkedinUrl: "", summary: "",
    template: DEFAULT_TEMPLATE,
    sectionTitles: { ...DEFAULT_SECTION_TITLES },
    skills: [], experience: [], projects: [], education: [], awards: []
  };
  const merged = Object.assign({}, defaults, parsed || {});
  if (!TEMPLATES[merged.template]) merged.template = DEFAULT_TEMPLATE;
  merged.sectionTitles = Object.assign(
    {},
    DEFAULT_SECTION_TITLES,
    (parsed && typeof parsed.sectionTitles === "object" && parsed.sectionTitles) || {}
  );
  ["skills", "experience", "projects", "education", "awards"].forEach((k) => {
    if (!Array.isArray(merged[k])) merged[k] = [];
  });
  merged.experience.forEach((job) => {
    if (!Array.isArray(job.bullets)) job.bullets = [];
  });
  merged.projects.forEach((p) => {
    if (!Array.isArray(p.links)) p.links = [];
  });
  return merged;
}

document.getElementById("uploadJsonBtn").addEventListener("click", () => {
  document.getElementById("jsonModal").classList.add("open");
});
document.getElementById("closeJsonModalBtn").addEventListener("click", () => {
  document.getElementById("jsonModal").classList.remove("open");
});
document.getElementById("jsonModal").addEventListener("click", (e) => {
  if (e.target.id === "jsonModal") document.getElementById("jsonModal").classList.remove("open");
});

document.getElementById("modalChooseFileBtn").addEventListener("click", () => {
  document.getElementById("jsonUpload").click();
});
document.getElementById("jsonUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      resumeData = normalizeData(parsed);
      render();
      document.getElementById("modalFileName").textContent = "Loaded: " + file.name;
      document.getElementById("status").textContent = "Loaded data from " + file.name;
      document.getElementById("jsonModal").classList.remove("open");
    } catch (err) {
      document.getElementById("modalFileName").textContent = "Error: " + err.message;
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

document.getElementById("loadPastedJsonBtn").addEventListener("click", () => {
  const text = document.getElementById("jsonPasteArea").value.trim();
  if (!text) {
    document.getElementById("status").textContent = "Paste some JSON first.";
    return;
  }
  try {
    const parsed = JSON.parse(text);
    resumeData = normalizeData(parsed);
    render();
    document.getElementById("status").textContent = "Loaded pasted JSON.";
    document.getElementById("jsonModal").classList.remove("open");
  } catch (err) {
    document.getElementById("status").textContent = "Could not parse pasted JSON: " + err.message;
  }
});

document.getElementById("copyCurrentJsonBtn").addEventListener("click", async () => {
  const text = JSON.stringify(resumeData, null, 2);
  document.getElementById("jsonPasteArea").value = text;
  try {
    await navigator.clipboard.writeText(text);
    document.getElementById("status").textContent = "Current data copied to clipboard and filled into the box below.";
  } catch (err) {
    document.getElementById("status").textContent = "Current data filled into the box below (clipboard copy not available).";
  }
});

document.getElementById("downloadSampleJsonBtn").addEventListener("click", () => {
  const text = JSON.stringify(sampleResumeData, null, 2);
  const blob = new Blob([text], { type: "application/json" });
  triggerDownload(blob, "sample-resume-data.json");
  document.getElementById("status").textContent = "Downloaded sample-resume-data.json";
});

/* ---------------------------------------------------------------------
   3. RENDER FORM
--------------------------------------------------------------------- */
function esc(s) { return String(s ?? "").replace(/"/g, "&quot;"); }

function render() {
  const d = resumeData;
  let html = "";

  function cardHeading(key) {
    return `<h2><input type="text" class="card-title-input" value="${esc(d.sectionTitles[key])}" oninput="updateSectionTitle('${key}', this.value)" placeholder="${esc(DEFAULT_SECTION_TITLES[key])}"></h2>`;
  }

  const currentTemplate = TEMPLATES[d.template] ? d.template : DEFAULT_TEMPLATE;
  html += `<div class="card">
    <h2>Template</h2>
    <div class="template-grid">` +
    Object.keys(TEMPLATES).map((key) => {
      const t = TEMPLATES[key];
      const selected = key === currentTemplate ? " selected" : "";
      return `<button type="button" class="template-option${selected}" onclick="selectTemplate('${key}')">
        <div class="template-swatch"><span style="background:#${t.colors.navy}"></span><span style="background:#${t.colors.accent}"></span></div>
        <div class="template-name">${t.label}</div>
        <div class="template-desc">${t.desc}</div>
      </button>`;
    }).join("") +
    `</div>
  </div>`;

  html += `<div class="card">
    <h2>Header</h2>
    <div class="row2">
      <div><label>Full Name</label><input type="text" placeholder="e.g. Jordan Rivera" value="${esc(d.name)}" oninput="updateField('name', this.value)"></div>
      <div><label>Title</label><input type="text" placeholder="e.g. Senior Backend Developer" value="${esc(d.title)}" oninput="updateField('title', this.value)"></div>
    </div>
    <div class="row2">
      <div><label>Location</label><input type="text" placeholder="e.g. Austin, TX" value="${esc(d.location)}" oninput="updateField('location', this.value)"></div>
      <div><label>Phone</label><input type="text" placeholder="e.g. +1-555-0142" value="${esc(d.phone)}" oninput="updateField('phone', this.value)"></div>
    </div>
    <label>Email</label>
    <input type="text" class="input-lg" placeholder="e.g. jordan.rivera@example.com" value="${esc(d.email)}" oninput="updateField('email', this.value)">
    <div class="row2">
      <div><label>Portfolio URL</label><input type="text" placeholder="https://..." value="${esc(d.portfolioUrl)}" oninput="updateField('portfolioUrl', this.value)"></div>
      <div><label>LinkedIn URL</label><input type="text" placeholder="https://linkedin.com/in/..." value="${esc(d.linkedinUrl)}" oninput="updateField('linkedinUrl', this.value)"></div>
    </div>
  </div>`;

  html += `<div class="card">
    ${cardHeading("summary")}
    <textarea rows="5" placeholder="e.g. Backend developer with 5+ years building REST APIs and scaling distributed systems..." oninput="updateField('summary', this.value)">${esc(d.summary)}</textarea>
  </div>`;

  html += `<div class="card">${cardHeading("skills")}`;
  d.skills.forEach((s, i) => {
    html += `<div class="item-block">
      <div class="item-block-head"><span>Category ${i + 1}</span><button class="small danger" onclick="removeSkill(${i})">Remove</button></div>
      <label>Category label</label>
      <input type="text" placeholder="e.g. Programming Languages" value="${esc(s.label)}" oninput="updateSkill(${i}, 'label', this.value)">
      <label>Items (comma-separated)</label>
      <textarea rows="2" placeholder="e.g. JavaScript, Python, SQL" oninput="updateSkill(${i}, 'items', this.value)">${esc(s.items)}</textarea>
    </div>`;
  });
  html += `<button class="add" onclick="addSkill()">+ Add skill category</button></div>`;

  html += `<div class="card">${cardHeading("experience")}`;
  d.experience.forEach((job, ji) => {
    html += `<div class="item-block">
      <div class="item-block-head"><span>Role ${ji + 1}</span><button class="small danger" onclick="removeJob(${ji})">Remove role</button></div>
      <div class="row2">
        <div><label>Job Title</label><input type="text" placeholder="e.g. Senior Backend Engineer" value="${esc(job.title)}" oninput="updateJob(${ji}, 'title', this.value)"></div>
        <div><label>Company</label><input type="text" placeholder="e.g. Acme Corporation" value="${esc(job.company)}" oninput="updateJob(${ji}, 'company', this.value)"></div>
      </div>
      <label>Dates</label>
      <input type="text" placeholder="e.g. Jan 2022 – Present" value="${esc(job.dates)}" oninput="updateJob(${ji}, 'dates', this.value)">
      <label>Bullet points</label>`;
    job.bullets.forEach((b, bi) => {
      html += `<div class="bullet-row">
        <textarea rows="2" placeholder="e.g. Redesigned the checkout flow, increasing conversion by 15% and cutting page load time in half" oninput="updateBullet(${ji}, ${bi}, this.value)">${esc(b)}</textarea>
        <button class="small danger" onclick="removeBullet(${ji}, ${bi})">✕</button>
      </div>`;
    });
    html += `<button class="add" onclick="addBullet(${ji})">+ Add bullet</button>
    </div>`;
  });
  html += `<button class="add" onclick="addJob()">+ Add role</button></div>`;

  html += `<div class="card">${cardHeading("projects")}`;
  d.projects.forEach((p, pi) => {
    html += `<div class="item-block">
      <div class="item-block-head"><span>Project ${pi + 1}</span><button class="small danger" onclick="removeProject(${pi})">Remove project</button></div>
      <label>Project name</label>
      <input type="text" placeholder="e.g. Personal Portfolio Website" value="${esc(p.name)}" oninput="updateProject(${pi}, 'name', this.value)">
      <label>Description</label>
      <textarea rows="3" placeholder="Briefly describe what it does and the tech you used" oninput="updateProject(${pi}, 'description', this.value)">${esc(p.description)}</textarea>
      <label>Links</label>`;
    p.links.forEach((l, li) => {
      html += `<div class="link-row">
        <input class="link-label" type="text" placeholder="e.g. Website" value="${esc(l.label)}" oninput="updateProjectLink(${pi}, ${li}, 'label', this.value)">
        <input type="text" placeholder="https://..." value="${esc(l.url)}" oninput="updateProjectLink(${pi}, ${li}, 'url', this.value)">
        <button class="small danger" onclick="removeProjectLink(${pi}, ${li})">✕</button>
      </div>`;
    });
    html += `<button class="add" onclick="addProjectLink(${pi})">+ Add link</button>
    </div>`;
  });
  html += `<button class="add" onclick="addProject()">+ Add project</button></div>`;

  html += `<div class="card">${cardHeading("education")}`;
  d.education.forEach((e, ei) => {
    html += `<div class="item-block">
      <div class="item-block-head"><span>Entry ${ei + 1}</span><button class="small danger" onclick="removeEdu(${ei})">Remove</button></div>
      <div class="row2">
        <div><label>Degree</label><input type="text" placeholder="e.g. B.S. Computer Science" value="${esc(e.degree)}" oninput="updateEdu(${ei}, 'degree', this.value)"></div>
        <div><label>Dates</label><input type="text" placeholder="e.g. 2019 – 2023" value="${esc(e.dates)}" oninput="updateEdu(${ei}, 'dates', this.value)"></div>
      </div>
      <label>School / University</label>
      <input type="text" placeholder="e.g. State University" value="${esc(e.school)}" oninput="updateEdu(${ei}, 'school', this.value)">
    </div>`;
  });
  html += `<button class="add" onclick="addEdu()">+ Add education entry</button></div>`;

  html += `<div class="card">${cardHeading("awards")}`;
  d.awards.forEach((a, ai) => {
    html += `<div class="link-row">
      <input type="text" placeholder="e.g. &quot;Employee of the Year&quot; — Acme Corp (2024)" value="${esc(a)}" oninput="updateAward(${ai}, this.value)">
      <button class="small danger" onclick="removeAward(${ai})">✕</button>
    </div>`;
  });
  html += `<button class="add" onclick="addAward()">+ Add award</button>
    <p class="hint">Click "Download" to choose PDF, DOCX, or JSON individually. Empty fields and sections you leave blank are simply skipped in the output. Use "Upload JSON" at the top to reload a previously saved resume-data.json.</p>
  </div>`;

  document.getElementById("app").innerHTML = html;
  renderPreview();
}
render();

/* ---------------------------------------------------------------------
   3b. SHARED HELPERS
--------------------------------------------------------------------- */
function getContactLineParts(data) {
  const plain = [data.location, data.phone, data.email].filter((v) => v && v.trim());
  return plain;
}
function getContactLinkParts(data) {
  const links = [];
  if (data.portfolioUrl && data.portfolioUrl.trim()) links.push({ label: "Portfolio", url: data.portfolioUrl.trim() });
  if (data.linkedinUrl && data.linkedinUrl.trim()) links.push({ label: "LinkedIn", url: data.linkedinUrl.trim() });
  return links;
}

/* ---------------------------------------------------------------------
   3c. LIVE RESUME PREVIEW (right-hand pane)
--------------------------------------------------------------------- */
function escHtml(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escAttr(s) {
  return escHtml(s).replace(/"/g, "&quot;");
}
function isSafeHref(url) {
  return /^(https?:|mailto:)/i.test(String(url ?? "").trim());
}
function pvSection(title, innerHtml) {
  return `<div class="pv-section"><h2 class="pv-heading">${escHtml(title)}</h2>${innerHtml}</div>`;
}
function sectionTitle(d, key) {
  const custom = d.sectionTitles && d.sectionTitles[key];
  return (custom && custom.trim()) || DEFAULT_SECTION_TITLES[key];
}

function renderPreview() {
  const d = resumeData;
  const container = document.getElementById("resumePreview");
  if (!container) return;
  container.dataset.template = TEMPLATES[d.template] ? d.template : DEFAULT_TEMPLATE;

  const hasAnything = d.name || d.title || d.summary ||
    d.skills.length || d.experience.length || d.projects.length ||
    d.education.length || d.awards.length ||
    d.location || d.phone || d.email || d.portfolioUrl || d.linkedinUrl;

  if (!hasAnything) {
    container.innerHTML = `<div class="preview-empty">
      <div class="icon">📝</div>
      <p>Start filling in the form on the left and your resume will take shape here, formatted the same way it will look as a PDF or DOCX.</p>
    </div>`;
    return;
  }

  let html = "";

  if (d.name && d.name.trim()) html += `<h1 class="pv-name">${escHtml(d.name)}</h1>`;
  if (d.title && d.title.trim()) html += `<p class="pv-title">${escHtml(d.title)}</p>`;

  const plain = getContactLineParts(d);
  const links = getContactLinkParts(d);
  if (plain.length || links.length) {
    const segs = [];
    if (plain.length) segs.push(`<span>${escHtml(plain.join("  |  "))}</span>`);
    links.forEach((l) => {
      segs.push(isSafeHref(l.url)
        ? `<a href="${escAttr(l.url.trim())}" target="_blank" rel="noopener noreferrer">${escHtml(l.label)}</a>`
        : `<span>${escHtml(l.label)}</span>`);
    });
    html += `<p class="pv-contact">${segs.join(`<span class="pv-sep">|</span>`)}</p>`;
  }

  if (d.summary && d.summary.trim()) {
    html += pvSection(sectionTitle(d, "summary"), `<p class="pv-body">${escHtml(d.summary)}</p>`);
  }

  const validSkills = d.skills.filter((s) => (s.label && s.label.trim()) || (s.items && s.items.trim()));
  if (validSkills.length) {
    const inner = validSkills.map((s) =>
      `<p class="pv-skill"><strong>${escHtml(s.label)}:</strong> ${escHtml(s.items)}</p>`
    ).join("");
    html += pvSection(sectionTitle(d, "skills"), inner);
  }

  const validExperience = d.experience.filter((job) => job.title && job.title.trim());
  if (validExperience.length) {
    const inner = validExperience.map((job) => {
      let e = `<div class="pv-entry"><div class="pv-entry-head">
        <span class="pv-entry-title">${escHtml(job.title)}</span>
        <span class="pv-entry-dates">${escHtml(job.dates || "")}</span>
      </div>`;
      if (job.company && job.company.trim()) e += `<p class="pv-entry-sub">${escHtml(job.company)}</p>`;
      const bullets = (job.bullets || []).filter((b) => b && b.trim());
      if (bullets.length) e += `<ul class="pv-bullets">${bullets.map((b) => `<li>${escHtml(b)}</li>`).join("")}</ul>`;
      e += `</div>`;
      return e;
    }).join("");
    html += pvSection(sectionTitle(d, "experience"), inner);
  }

  const validProjects = d.projects.filter((p) => p.name && p.name.trim());
  if (validProjects.length) {
    const inner = validProjects.map((p) => {
      let line = `<strong>${escHtml(p.name)}</strong>`;
      const plinks = (p.links || []).filter((l) => (l.label && l.label.trim()) || (l.url && l.url.trim()));
      if (plinks.length) {
        const linkHtml = plinks.map((l) =>
          isSafeHref(l.url)
            ? `<a href="${escAttr(l.url.trim())}" target="_blank" rel="noopener noreferrer">${escHtml(l.label || l.url)}</a>`
            : `<span class="pv-project-links">${escHtml(l.label)}</span>`
        ).join(" &amp; ");
        line += `<span class="pv-project-links">  —  ${linkHtml}:  </span>`;
      } else {
        line += `<span class="pv-project-links">  —  </span>`;
      }
      line += escHtml(p.description || "");
      return `<p class="pv-body">${line}</p>`;
    }).join("");
    html += pvSection(sectionTitle(d, "projects"), inner);
  }

  const validEducation = d.education.filter((e) => e.degree && e.degree.trim());
  if (validEducation.length) {
    const inner = validEducation.map((e) => {
      let block = `<div class="pv-entry"><div class="pv-entry-head">
        <span class="pv-entry-title">${escHtml(e.degree)}</span>
        <span class="pv-entry-dates plain">${escHtml(e.dates || "")}</span>
      </div>`;
      if (e.school && e.school.trim()) block += `<p class="pv-entry-sub">${escHtml(e.school)}</p>`;
      block += `</div>`;
      return block;
    }).join("");
    html += pvSection(sectionTitle(d, "education"), inner);
  }

  const validAwards = (d.awards || []).filter((a) => a && a.trim());
  if (validAwards.length) {
    const inner = `<ul class="pv-awards">${validAwards.map((a) => `<li>${escHtml(a)}</li>`).join("")}</ul>`;
    html += pvSection(sectionTitle(d, "awards"), inner);
  }

  container.innerHTML = html;
}

/* ---------------------------------------------------------------------
   4. DOCX GENERATION (hand-built OOXML, zipped with JSZip)
--------------------------------------------------------------------- */
function xmlEscape(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function buildDocxBlob(data) {
  const tpl = getTemplate(data.template);
  const { navy, accent, grey } = tpl.colors;
  let hyperlinkRels = [];
  let relCounter = 2; // rId1 reserved for numbering.xml

  function run(text, opts = {}) {
    const { bold, italic, color, size = 22, underline, charSpacing } = opts;
    let rpr = `<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>`;
    if (bold) rpr += `<w:b/>`;
    if (italic && !tpl.noItalic) rpr += `<w:i/>`;
    if (color) rpr += `<w:color w:val="${color}"/>`;
    if (underline) rpr += `<w:u w:val="single"/>`;
    if (charSpacing) rpr += `<w:spacing w:val="${charSpacing}"/>`;
    rpr += `<w:sz w:val="${size}"/>`;
    return `<w:r><w:rPr>${rpr}</w:rPr><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r>`;
  }
  function tabRun() { return `<w:r><w:tab/></w:r>`; }
  function hyperlinkRun(text, url, opts = {}) {
    const id = `rId${relCounter++}`;
    hyperlinkRels.push({ id, url });
    const { size = 21 } = opts;
    const italicTag = tpl.noItalic ? "" : "<w:i/>";
    return `<w:hyperlink r:id="${id}" w:history="1"><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>${italicTag}<w:color w:val="${accent}"/><w:u w:val="single"/><w:sz w:val="${size}"/></w:rPr><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r></w:hyperlink>`;
  }
  function paragraph(runsXml, opts = {}) {
    const { before, after = 150, line = 300, border, leftBar, topRule, lightBottomRule, tabRight, bulleted, align, indent } = opts;
    let ppr = "<w:pPr>";
    if (align) ppr += `<w:jc w:val="${align}"/>`;
    if (bulleted) ppr += `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>`;
    if (tabRight) ppr += `<w:tabs><w:tab w:val="right" w:pos="${tabRight}"/></w:tabs>`;
    ppr += `<w:spacing ${before !== undefined ? `w:before="${before}" ` : ""}w:after="${after}" w:line="${line}" w:lineRule="auto"/>`;
    if (border) ppr += `<w:pBdr><w:bottom w:val="single" w:sz="8" w:space="2" w:color="${accent}"/></w:pBdr>`;
    if (leftBar) ppr += `<w:pBdr><w:left w:val="single" w:sz="24" w:space="8" w:color="${accent}"/></w:pBdr>`;
    if (topRule) ppr += `<w:pBdr><w:top w:val="single" w:sz="4" w:space="6" w:color="E3E3E3"/></w:pBdr>`;
    if (lightBottomRule) ppr += `<w:pBdr><w:bottom w:val="single" w:sz="4" w:space="8" w:color="E3E3E3"/></w:pBdr>`;
    if (indent) ppr += `<w:ind w:left="${indent}"/>`;
    ppr += "</w:pPr>";
    return `<w:p>${ppr}${runsXml}</w:p>`;
  }
  function sectionHeading(text) {
    const upper = text.toUpperCase();
    if (tpl.heading === "bar") {
      return paragraph(run(upper, { bold: true, size: 24, color: accent }), { before: 340, after: 160, leftBar: true, indent: 160 });
    }
    if (tpl.heading === "plain") {
      return paragraph(run(upper, { bold: true, size: 22, color: accent, charSpacing: 40 }), { before: 420, after: 180, topRule: true });
    }
    return paragraph(run(upper, { bold: true, size: 24, color: accent }), { before: 340, after: 160, border: true });
  }

  const TAB_RIGHT = 9360; // usable width in twips: 12240 page width - 1440 (1in) margin each side
  const headerAlign = tpl.align === "center" ? "center" : undefined;

  let body = "";
  body += paragraph(run(data.name, { bold: true, size: 44, color: navy }), { after: 90, align: headerAlign });
  const titleText = tpl.titleStyle === "caps" ? (data.title || "").toUpperCase() : data.title;
  const titleOpts = tpl.titleStyle === "caps"
    ? { bold: true, size: 20, color: accent, charSpacing: 30 }
    : { bold: true, size: 27, color: accent };
  body += paragraph(run(titleText, titleOpts), { after: 200, align: headerAlign });

  const plainContact = getContactLineParts(data);
  const linkContact = getContactLinkParts(data);
  const contactSegments = [];
  if (plainContact.length) contactSegments.push({ text: plainContact.join("  |  ") });
  linkContact.forEach((l) => contactSegments.push({ text: l.label, url: l.url }));
  if (contactSegments.length) {
    let contact = "";
    contactSegments.forEach((seg, idx) => {
      contact += seg.url ? hyperlinkRun(seg.text, seg.url) : run(seg.text, { size: 21, color: grey });
      if (idx < contactSegments.length - 1) contact += run("  |  ", { size: 21, color: grey });
    });
    body += paragraph(contact, { after: tpl.headerRule ? 320 : 260, align: headerAlign, lightBottomRule: tpl.headerRule });
  }

  if (data.summary && data.summary.trim()) {
    body += sectionHeading(sectionTitle(data, "summary"));
    body += paragraph(run(data.summary, { size: 22, color: grey }), { after: 180 });
  }

  const validSkills = data.skills.filter((s) => (s.label && s.label.trim()) || (s.items && s.items.trim()));
  if (validSkills.length) {
    body += sectionHeading(sectionTitle(data, "skills"));
    validSkills.forEach((s) => {
      const r = run(`${s.label}: `, { bold: true, size: 22, color: navy }) + run(s.items, { size: 22, color: grey });
      body += paragraph(r, { after: 160 });
    });
  }

  const validExperience = data.experience.filter((job) => job.title && job.title.trim());
  if (validExperience.length) {
    body += sectionHeading(sectionTitle(data, "experience"));
    validExperience.forEach((job) => {
      const titleLine = run(job.title, { bold: true, size: 23, color: navy }) + tabRun() + run(job.dates || "", { italic: true, size: 21, color: grey });
      body += paragraph(titleLine, { before: 260, after: 50, tabRight: TAB_RIGHT });
      if (job.company && job.company.trim()) {
        body += paragraph(run(job.company, { italic: true, size: 22, color: accent }), { after: 150 });
      }
      (job.bullets || []).filter((b) => b && b.trim()).forEach((b) => {
        body += paragraph(run(b, { size: 22, color: grey }), { after: 130, bulleted: true });
      });
    });
  }

  const validProjects = data.projects.filter((p) => p.name && p.name.trim());
  if (validProjects.length) {
    body += sectionHeading(sectionTitle(data, "projects"));
    validProjects.forEach((p) => {
      let r = run(p.name, { bold: true, size: 22, color: navy });
      const links = (p.links || []).filter((l) => (l.label && l.label.trim()) || (l.url && l.url.trim()));
      if (links.length) {
        r += run("  —  ", { italic: true, size: 21, color: grey });
        links.forEach((l, idx) => {
          r += l.url && l.url.trim() ? hyperlinkRun(l.label || l.url, l.url.trim()) : run(l.label, { italic: true, size: 21, color: grey });
          if (idx < links.length - 1) r += run(" & ", { italic: true, size: 21, color: grey });
        });
        r += run(":  ", { italic: true, size: 21, color: grey });
      } else {
        r += run("  —  ", { italic: true, size: 21, color: grey });
      }
      r += run(p.description || "", { size: 22, color: grey });
      body += paragraph(r, { after: 150 });
    });
  }

  const validEducation = data.education.filter((e) => e.degree && e.degree.trim());
  if (validEducation.length) {
    body += sectionHeading(sectionTitle(data, "education"));
    validEducation.forEach((e) => {
      const degLine = run(e.degree, { bold: true, size: 22, color: navy }) + tabRun() + run(e.dates || "", { size: 21, color: grey });
      body += paragraph(degLine, { after: 30, tabRight: TAB_RIGHT });
      if (e.school && e.school.trim()) {
        body += paragraph(run(e.school, { italic: true, size: 21, color: grey }), { after: 150 });
      }
    });
  }

  const validAwards = (data.awards || []).filter((a) => a && a.trim());
  if (validAwards.length) {
    body += sectionHeading(sectionTitle(data, "awards"));
    validAwards.forEach((a) => {
      body += paragraph(run(a, { size: 22, color: grey }), { after: 130, bulleted: true });
    });
  }

  const sectPr = `<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>`;
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${body}${sectPr}</w:body></w:document>`;

  const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>`;
  const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const NUMBERING = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="360" w:hanging="216"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

  let docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>`;
  hyperlinkRels.forEach((h) => {
    docRels += `<Relationship Id="${h.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${xmlEscape(h.url)}" TargetMode="External"/>`;
  });
  docRels += `</Relationships>`;

  const zip = new JSZip();
  zip.file("[Content_Types].xml", CONTENT_TYPES);
  zip.folder("_rels").file(".rels", ROOT_RELS);
  const wordFolder = zip.folder("word");
  wordFolder.file("document.xml", documentXml);
  wordFolder.file("numbering.xml", NUMBERING);
  wordFolder.folder("_rels").file("document.xml.rels", docRels);

  return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}

/* ---------------------------------------------------------------------
   5. PDF GENERATION (jsPDF)
--------------------------------------------------------------------- */
function buildPdfBlob(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const marginX = 60, marginTop = 64, marginBottom = 56, pageWidth = 612, pageHeight = 792;
  const contentWidth = pageWidth - marginX * 2;
  let y = marginTop;

  const tpl = getTemplate(data.template);
  const NAVY = hexToRgb(tpl.colors.navy), ACCENT = hexToRgb(tpl.colors.accent), GREY = hexToRgb(tpl.colors.grey);
  const RULE = [227, 227, 227];
  const italicStyle = tpl.noItalic ? "normal" : "italic";
  const setColor = (rgb) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  function ensureSpace(h) { if (y + h > pageHeight - marginBottom) { doc.addPage(); y = marginTop; } }

  const headerAlign = tpl.align === "center" ? "center" : "left";
  const headerX = tpl.align === "center" ? pageWidth / 2 : marginX;

  doc.setFont("helvetica", "bold"); doc.setFontSize(20); setColor(NAVY);
  doc.text(data.name, headerX, y, { align: headerAlign }); y += 20;
  const titleText = tpl.titleStyle === "caps" ? (data.title || "").toUpperCase() : data.title;
  if (tpl.titleStyle === "caps") {
    doc.setFontSize(10.5); setColor(ACCENT);
    doc.text(titleText, headerX, y, { align: headerAlign, charSpace: 1.1 });
  } else {
    doc.setFontSize(13); setColor(ACCENT);
    doc.text(titleText, headerX, y, { align: headerAlign });
  }
  y += 18;

  const plainContactPdf = getContactLineParts(data);
  const linkContactPdf = getContactLinkParts(data);
  const pdfSegments = [];
  if (plainContactPdf.length) pdfSegments.push({ text: plainContactPdf.join("  |  ") });
  linkContactPdf.forEach((l) => pdfSegments.push({ text: l.label, url: l.url }));

  if (pdfSegments.length) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    const sep = "   |   ";
    let cx;
    if (tpl.align === "center") {
      let totalWidth = 0;
      pdfSegments.forEach((s, idx) => {
        totalWidth += doc.getTextWidth(s.text);
        if (idx < pdfSegments.length - 1) totalWidth += doc.getTextWidth(sep);
      });
      cx = pageWidth / 2 - totalWidth / 2;
    } else {
      cx = marginX;
    }
    pdfSegments.forEach((s, idx) => {
      if (s.url) { setColor(ACCENT); doc.textWithLink(s.text, cx, y, { url: s.url }); }
      else { setColor(GREY); doc.text(s.text, cx, y); }
      cx += doc.getTextWidth(s.text);
      if (idx < pdfSegments.length - 1) { setColor(GREY); doc.text(sep, cx, y); cx += doc.getTextWidth(sep); }
    });
    y += 24;
  }

  if (tpl.headerRule) {
    doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 18;
  }

  function sectionHeading(title) {
    ensureSpace(46);
    // Consistent breathing room before every heading, independent of whatever
    // gap the previous section happened to leave — avoids rules/text landing
    // right on top of the previous line (a real bug when this was computed
    // by looking backward from the heading's own position instead).
    y += 12;
    const upper = title.toUpperCase();
    if (tpl.heading === "bar") {
      doc.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
      doc.rect(marginX, y - 9, 3, 12, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); setColor(ACCENT);
      doc.text(upper, marginX + 9, y);
      y += 15;
    } else if (tpl.heading === "plain") {
      doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 14;
      doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); setColor(ACCENT);
      doc.text(upper, marginX, y, { charSpace: 1.3 });
      y += 15;
    } else {
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); setColor(ACCENT);
      doc.text(upper, marginX, y);
      y += 4;
      doc.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 15;
    }
  }
  function bodyText(text) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); setColor(GREY);
    const lines = doc.splitTextToSize(text, contentWidth);
    lines.forEach((line) => { ensureSpace(14); doc.text(line, marginX, y); y += 13; });
  }
  function bulletText(text) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); setColor(GREY);
    const lines = doc.splitTextToSize(text, contentWidth - 14);
    lines.forEach((line, i) => { ensureSpace(14); doc.text((i === 0 ? "•  " : "    ") + line, marginX, y); y += 13; });
    y += 3;
  }

  if (data.summary && data.summary.trim()) {
    sectionHeading(sectionTitle(data, "summary"));
    bodyText(data.summary);
    y += 8;
  }

  const validSkillsPdf = data.skills.filter((s) => (s.label && s.label.trim()) || (s.items && s.items.trim()));
  if (validSkillsPdf.length) {
    sectionHeading(sectionTitle(data, "skills"));
    validSkillsPdf.forEach((s) => {
      ensureSpace(14);
      doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); setColor(NAVY);
      const label = `${s.label}: `;
      doc.text(label, marginX, y);
      const labelW = doc.getTextWidth(label);
      doc.setFont("helvetica", "normal"); setColor(GREY);
      const wrapped = doc.splitTextToSize(s.items, contentWidth - labelW);
      doc.text(wrapped[0] || "", marginX + labelW, y); y += 13;
      for (let i = 1; i < wrapped.length; i++) { ensureSpace(13); doc.text(wrapped[i], marginX, y); y += 13; }
      y += 5;
    });
  }

  const validExperiencePdf = data.experience.filter((job) => job.title && job.title.trim());
  if (validExperiencePdf.length) {
    sectionHeading(sectionTitle(data, "experience"));
    validExperiencePdf.forEach((job) => {
      ensureSpace(30);
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); setColor(NAVY);
      doc.text(job.title, marginX, y);
      doc.setFont("helvetica", italicStyle); doc.setFontSize(10); setColor(GREY);
      doc.text(job.dates || "", pageWidth - marginX, y, { align: "right" });
      y += 14;
      if (job.company && job.company.trim()) {
        doc.setFont("helvetica", italicStyle); doc.setFontSize(10.5); setColor(ACCENT);
        doc.text(job.company, marginX, y);
        y += 14;
      }
      (job.bullets || []).filter((b) => b && b.trim()).forEach((b) => bulletText(b));
      y += 6;
    });
  }

  const validProjectsPdf = data.projects.filter((p) => p.name && p.name.trim());
  if (validProjectsPdf.length) {
    sectionHeading(sectionTitle(data, "projects"));
    validProjectsPdf.forEach((p) => {
      ensureSpace(14);
      doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); setColor(NAVY);
      doc.text(p.name, marginX, y);
      let xCursor = marginX + doc.getTextWidth(p.name);
      const links = (p.links || []).filter((l) => (l.label && l.label.trim()) || (l.url && l.url.trim()));
      if (links.length) {
        doc.setFont("helvetica", italicStyle); setColor(GREY);
        const dash = "  —  ";
        doc.text(dash, xCursor, y); xCursor += doc.getTextWidth(dash);
        links.forEach((l, idx) => {
          if (l.url && l.url.trim()) { setColor(ACCENT); doc.textWithLink(l.label || l.url, xCursor, y, { url: l.url }); }
          else { setColor(GREY); doc.text(l.label, xCursor, y); }
          xCursor += doc.getTextWidth(l.label || l.url);
          if (idx < links.length - 1) { setColor(GREY); doc.text(" & ", xCursor, y); xCursor += doc.getTextWidth(" & "); }
        });
        setColor(GREY); doc.text(":", xCursor, y);
      } else {
        doc.setFont("helvetica", italicStyle); setColor(GREY);
        doc.text("  —", xCursor, y);
      }
      y += 13;
      bodyText(p.description || "");
      y += 6;
    });
  }

  const validEducationPdf = data.education.filter((e) => e.degree && e.degree.trim());
  if (validEducationPdf.length) {
    sectionHeading(sectionTitle(data, "education"));
    validEducationPdf.forEach((e) => {
      ensureSpace(26);
      doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); setColor(NAVY);
      doc.text(e.degree, marginX, y);
      doc.setFont("helvetica", "normal"); setColor(GREY);
      doc.text(e.dates || "", pageWidth - marginX, y, { align: "right" });
      y += 13;
      if (e.school && e.school.trim()) {
        doc.setFont("helvetica", italicStyle); doc.setFontSize(10); setColor(GREY);
        doc.text(e.school, marginX, y);
        y += 16;
      } else {
        y += 3;
      }
    });
  }

  const validAwardsPdf = (data.awards || []).filter((a) => a && a.trim());
  if (validAwardsPdf.length) {
    sectionHeading(sectionTitle(data, "awards"));
    validAwardsPdf.forEach((a) => bulletText(a));
  }

  return doc.output("blob");
}

/* ---------------------------------------------------------------------
   6. DOWNLOAD HANDLER
--------------------------------------------------------------------- */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function closeDownloadMenu() {
  document.getElementById("downloadMenu").classList.remove("open");
}

document.getElementById("downloadBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  document.getElementById("downloadMenu").classList.toggle("open");
});
document.getElementById("downloadMenu").addEventListener("click", (e) => e.stopPropagation());
document.addEventListener("click", closeDownloadMenu);

document.getElementById("dlPdf").addEventListener("click", async () => {
  const status = document.getElementById("status");
  closeDownloadMenu();
  status.textContent = "Building PDF…";
  try {
    const blob = buildPdfBlob(resumeData);
    triggerDownload(blob, "Resume.pdf");
    status.textContent = "Downloaded Resume.pdf";
  } catch (err) {
    console.error(err);
    status.textContent = "Something went wrong building the PDF: " + err.message;
  }
});

document.getElementById("dlDocx").addEventListener("click", async () => {
  const status = document.getElementById("status");
  closeDownloadMenu();
  status.textContent = "Building DOCX…";
  try {
    const blob = await buildDocxBlob(resumeData);
    triggerDownload(blob, "Resume.docx");
    status.textContent = "Downloaded Resume.docx";
  } catch (err) {
    console.error(err);
    status.textContent = "Something went wrong building the DOCX: " + err.message;
  }
});

document.getElementById("dlJson").addEventListener("click", () => {
  const status = document.getElementById("status");
  closeDownloadMenu();
  try {
    const jsonText = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([jsonText], { type: "application/json" });
    triggerDownload(blob, "resume-data.json");
    status.textContent = "Downloaded resume-data.json";
  } catch (err) {
    console.error(err);
    status.textContent = "Something went wrong building the JSON: " + err.message;
  }
});
