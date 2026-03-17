// app.js — Main application logic
import THEME from './theme.js';
import { generateContent } from './generator.js';
import { initSpeech } from './speech.js';
import {
  getDrafts, saveDraft, deleteDraft, getDraftsByDate,
  getScheduledDrafts, getUnscheduledDrafts,
  saveRating, getRatingForDraft, getPerformanceStats,
  exportDraftsAsText, downloadText, getStorageUsage
} from './storage.js';

// ── Global State ──
let currentTab = "create";
let currentOutputs = null;
let currentFormData = null;
let uploadedPhotos = [];
let calendarDate = new Date();

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCreateForm();
  initSpeech("rawNotes", "voiceBtn");
  showTab("create");

  // Toast system
  window.showAppToast = showToast;
});

// ── Navigation ──
function initNavigation() {
  document.querySelectorAll("[data-tab]").forEach(btn => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });
}

function showTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll("[data-tab]").forEach(el => el.classList.remove("active"));
  document.getElementById(`tab-${tab}`)?.classList.add("active");
  document.querySelectorAll(`[data-tab="${tab}"]`).forEach(el => el.classList.add("active"));

  if (tab === "calendar") renderCalendar();
  if (tab === "drafts") renderDrafts();
  if (tab === "performance") renderPerformance();
}

// ── Create Tab ──
function initCreateForm() {
  const contentType = document.getElementById("contentType");
  const eventFields = document.getElementById("eventFields");
  const adFields = document.getElementById("adFields");
  const paidToggle = document.getElementById("isPaid");

  contentType?.addEventListener("change", () => {
    const val = contentType.value;
    eventFields.classList.toggle("hidden", val !== "event");
    if (val === "event") eventFields.classList.add("visible");
  });

  paidToggle?.addEventListener("change", () => {
    adFields.classList.toggle("hidden", !paidToggle.checked);
    if (paidToggle.checked) adFields.classList.add("visible");
  });

  // Photo upload
  const photoInput = document.getElementById("photoInput");
  const photoArea = document.getElementById("photoDropArea");

  photoArea?.addEventListener("click", () => photoInput?.click());
  photoInput?.addEventListener("change", handlePhotoUpload);

  // Drag and drop
  photoArea?.addEventListener("dragover", (e) => { e.preventDefault(); photoArea.classList.add("drag-over"); });
  photoArea?.addEventListener("dragleave", () => photoArea.classList.remove("drag-over"));
  photoArea?.addEventListener("drop", (e) => {
    e.preventDefault();
    photoArea.classList.remove("drag-over");
    if (e.dataTransfer.files.length) handlePhotoFiles(e.dataTransfer.files);
  });

  // Generate button
  document.getElementById("generateBtn")?.addEventListener("click", handleGenerate);
}

function handlePhotoUpload(e) {
  if (e.target.files.length) handlePhotoFiles(e.target.files);
}

async function handlePhotoFiles(files) {
  const previews = document.getElementById("photoPreviews");
  for (const file of Array.from(files)) {
    if (uploadedPhotos.length >= 10) break;
    let processedFile = file;

    // HEIC conversion attempt
    if (file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic") {
      if (window.heic2any) {
        try {
          const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.85 });
          processedFile = new File([blob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
        } catch {
          showToast("Couldn't convert HEIC. Try saving as JPG first.");
          continue;
        }
      } else {
        showToast("HEIC files aren't supported in this browser. Try JPG or PNG.");
        continue;
      }
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const photoData = { dataUrl: ev.target.result, name: processedFile.name };
      uploadedPhotos.push(photoData);
      renderPhotoPreview(photoData, previews);
    };
    reader.readAsDataURL(processedFile);
  }
}

function renderPhotoPreview(photo, container) {
  const div = document.createElement("div");
  div.className = "photo-thumb";
  div.innerHTML = `
    <img src="${photo.dataUrl}" alt="${photo.name}">
    <button class="photo-remove" aria-label="Remove photo">&times;</button>
  `;
  div.querySelector(".photo-remove").addEventListener("click", () => {
    uploadedPhotos = uploadedPhotos.filter(p => p.dataUrl !== photo.dataUrl);
    div.remove();
  });
  container.appendChild(div);
}

function handleGenerate() {
  const formData = collectFormData();
  if (!formData.platforms.length) {
    showToast("Paws needs at least one platform to work with!");
    return;
  }

  currentFormData = formData;
  currentOutputs = generateContent(formData);
  renderOutputs(currentOutputs);
  document.getElementById("outputSection").classList.remove("hidden");
  document.getElementById("outputSection").scrollIntoView({ behavior: "smooth" });
}

function collectFormData() {
  const platforms = [];
  document.querySelectorAll(".platform-check:checked").forEach(cb => platforms.push(cb.value));

  return {
    contentType: document.getElementById("contentType")?.value || "general",
    eventType: document.getElementById("eventType")?.value || "general",
    platforms,
    rawNotes: document.getElementById("rawNotes")?.value || "",
    eventName: document.getElementById("eventName")?.value || "",
    date: document.getElementById("eventDate")?.value || "",
    time: document.getElementById("eventTime")?.value || "",
    price: document.getElementById("eventPrice")?.value || "",
    partner: document.getElementById("eventPartner")?.value || "",
    audience: document.getElementById("targetAudience")?.value || "",
    customHashtags: document.getElementById("customHashtags")?.value || "",
    toneOverride: document.getElementById("toneOverride")?.value || "default",
    isPaid: document.getElementById("isPaid")?.checked || false,
    campaignGoal: document.getElementById("campaignGoal")?.value || "awareness",
    postDate: document.getElementById("postDate")?.value || "",
    photos: uploadedPhotos,
  };
}

// ── Output Rendering ──
function renderOutputs(outputs) {
  const container = document.getElementById("outputCards");
  container.innerHTML = "";

  const platformLabels = {
    instagram: "Instagram Caption",
    story: "Instagram Story",
    facebook: "Facebook Post",
    tiktok: "TikTok Description",
    eventbrite: "Eventbrite Listing",
    "ad-copy": "Ad Copy",
  };

  for (const [platform, content] of Object.entries(outputs)) {
    if (platform === "ad-copy") {
      renderAdCopyCards(content, container);
      continue;
    }

    const card = document.createElement("div");
    card.className = "output-card";

    let bodyHtml = "";
    let hashtagHtml = "";
    let metaHtml = "";

    if (platform === "story") {
      bodyHtml = `
        <div class="story-preview">
          ${uploadedPhotos.length ? `<img src="${uploadedPhotos[0].dataUrl}" class="story-bg" alt="">` : '<div class="story-bg-placeholder"></div>'}
          <div class="story-overlay">
            <div class="story-line1">${content.line1}</div>
            <div class="story-line2">${content.line2}</div>
            <div class="story-line3">${content.line3}</div>
          </div>
        </div>`;
    } else if (platform === "eventbrite") {
      bodyHtml = `
        <div class="output-field"><span class="field-label">Title:</span> ${content.title}</div>
        <div class="output-field"><span class="field-label">Short:</span> ${content.shortDesc}</div>
        <div class="output-text">${content.fullDesc.replace(/\n/g, "<br>")}</div>`;
      metaHtml = `<div class="output-meta">Tags: ${content.tags}</div>`;
    } else {
      bodyHtml = `<div class="output-text">${content.text.replace(/\n/g, "<br>")}</div>`;
      if (content.hashtags) {
        hashtagHtml = `<div class="output-hashtags">${content.hashtags}</div>`;
      }
      if (content.charCount) {
        const warn = platform === "tiktok" && content.charCount > 150;
        metaHtml = `<div class="output-meta ${warn ? "warn" : ""}">${content.charCount} characters${warn ? " (over 150 target)" : ""}</div>`;
      }
    }

    card.innerHTML = `
      <div class="card-header">
        <h3>${platformLabels[platform] || platform}</h3>
        <button class="btn-icon regen-btn" data-platform="${platform}" aria-label="Regenerate" title="Regenerate">↻</button>
      </div>
      ${bodyHtml}
      ${hashtagHtml}
      ${metaHtml}
      <div class="card-actions">
        ${platform === "story" && uploadedPhotos.length ?
          `<button class="btn btn-sm save-story-btn" data-platform="${platform}">Save with Text</button>` : ""}
        <button class="btn btn-sm copy-btn" data-platform="${platform}" data-type="text">Copy Text</button>
        ${content.hashtags ? `<button class="btn btn-sm copy-btn" data-platform="${platform}" data-type="hashtags">Copy Tags</button>` : ""}
        ${canShare() ? `<button class="btn btn-sm share-btn" data-platform="${platform}">Share</button>` : ""}
      </div>
    `;
    container.appendChild(card);
  }

  // Attach event listeners
  container.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => handleCopy(btn.dataset.platform, btn.dataset.type));
  });
  container.querySelectorAll(".share-btn").forEach(btn => {
    btn.addEventListener("click", () => handleShare(btn.dataset.platform));
  });
  container.querySelectorAll(".regen-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentOutputs = generateContent(currentFormData);
      renderOutputs(currentOutputs);
    });
  });
  container.querySelectorAll(".save-story-btn").forEach(btn => {
    btn.addEventListener("click", () => saveStoryImage());
  });

  // Save/export buttons
  renderOutputActions();
}

function renderAdCopyCards(adContent, container) {
  // Meta
  const metaCard = document.createElement("div");
  metaCard.className = "output-card ad-card";
  let metaHtml = `<div class="card-header"><h3>Meta Ads</h3></div>`;
  adContent.meta.forEach((v, i) => {
    metaHtml += `
      <div class="ad-variant">
        <div class="variant-label">Variant ${i + 1}</div>
        <div class="output-field"><span class="field-label">Primary:</span> ${v.primaryText}</div>
        <div class="output-field"><span class="field-label">Headline:</span> ${v.headline}</div>
        <div class="output-field"><span class="field-label">Description:</span> ${v.description}</div>
        <div class="output-field"><span class="field-label">CTA:</span> ${v.cta}</div>
        <button class="btn btn-sm copy-btn" data-copy="${escapeHtml(v.primaryText + '\n' + v.headline + '\n' + v.description)}">Copy</button>
      </div>`;
  });
  metaCard.innerHTML = metaHtml;
  container.appendChild(metaCard);

  // Google
  const googleCard = document.createElement("div");
  googleCard.className = "output-card ad-card";
  let googleHtml = `<div class="card-header"><h3>Google Ads</h3></div>`;
  adContent.google.headlines.forEach((h, i) => {
    googleHtml += `<div class="output-field"><span class="field-label">H${i + 1}:</span> ${h} <span class="char-count">(${h.length}/30)</span></div>`;
  });
  adContent.google.descriptions.forEach((d, i) => {
    googleHtml += `<div class="output-field"><span class="field-label">D${i + 1}:</span> ${d} <span class="char-count">(${d.length}/90)</span></div>`;
  });
  googleHtml += `<button class="btn btn-sm copy-btn" data-copy="${escapeHtml(adContent.google.headlines.join('\n') + '\n' + adContent.google.descriptions.join('\n'))}">Copy All</button>`;
  googleCard.innerHTML = googleHtml;
  container.appendChild(googleCard);

  // TikTok
  const ttCard = document.createElement("div");
  ttCard.className = "output-card ad-card";
  let ttHtml = `<div class="card-header"><h3>TikTok Ads</h3></div>`;
  adContent.tiktok.forEach((v, i) => {
    ttHtml += `
      <div class="ad-variant">
        <div class="variant-label">Variant ${i + 1}</div>
        <div class="output-field">${v.text} <span class="char-count">(${v.text.length}/100)</span></div>
        <button class="btn btn-sm copy-btn" data-copy="${escapeHtml(v.text)}">Copy</button>
      </div>`;
  });
  ttCard.innerHTML = ttHtml;
  container.appendChild(ttCard);

  // Generic copy listeners for ad cards
  container.querySelectorAll(".copy-btn[data-copy]").forEach(btn => {
    btn.addEventListener("click", () => copyToClipboard(btn.dataset.copy, btn));
  });
}

function renderOutputActions() {
  const actions = document.getElementById("outputActions");
  if (!actions) return;
  actions.innerHTML = `
    <button class="btn btn-primary" id="saveDraftBtn">Save Draft</button>
    <button class="btn" id="exportBtn">Export as .txt</button>
  `;
  document.getElementById("saveDraftBtn").addEventListener("click", handleSaveDraft);
  document.getElementById("exportBtn").addEventListener("click", () => {
    const text = exportDraftsAsText([{ formData: currentFormData, outputs: currentOutputs, postDate: currentFormData.postDate }]);
    downloadText(text, `homedog-content-${new Date().toISOString().slice(0, 10)}.txt`);
  });
}

function handleSaveDraft() {
  const draft = {
    formData: currentFormData,
    outputs: currentOutputs,
    postDate: currentFormData.postDate || "",
    // Store small photo thumbnails only to save space
    photoThumbs: uploadedPhotos.slice(0, 3).map(p => p.dataUrl.substring(0, 200)),
  };
  const result = saveDraft(draft);
  if (result === "quota") {
    showToast("Storage is almost full. Delete old drafts to save new ones.");
  } else {
    showToast("Paws saved your draft! 🐾");
  }
}

// ── Copy / Share ──
async function handleCopy(platform, type) {
  const content = currentOutputs[platform];
  if (!content) return;

  let text = "";
  if (platform === "story") {
    text = `${content.line1}\n${content.line2}\n${content.line3}`;
  } else if (platform === "eventbrite") {
    text = type === "text" ? `${content.title}\n\n${content.fullDesc}` : content.tags;
  } else {
    text = type === "hashtags" ? content.hashtags : (content.text + (content.hashtags ? "\n\n" + content.hashtags : ""));
  }

  const btn = document.querySelector(`.copy-btn[data-platform="${platform}"][data-type="${type}"]`);
  await copyToClipboard(text, btn);
}

async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  if (btn) {
    const original = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = original; btn.classList.remove("copied"); }, 1500);
  }
}

function canShare() {
  return !!navigator.share;
}

async function handleShare(platform) {
  const content = currentOutputs[platform];
  if (!content || !navigator.share) return;

  let text = "";
  if (platform === "story") {
    text = `${content.line1}\n${content.line2}\n${content.line3}`;
  } else if (content.text) {
    text = content.text + (content.hashtags ? "\n\n" + content.hashtags : "");
  }

  try {
    await navigator.share({ text });
  } catch { /* user cancelled */ }
}

// ── Story Image Save ──
function saveStoryImage() {
  if (!uploadedPhotos.length) return;
  const content = currentOutputs?.story;
  if (!content) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    // 9:16 story aspect ratio
    canvas.width = 1080;
    canvas.height = 1920;
    ctx.drawImage(img, 0, 0, 1080, 1920);

    // Semi-transparent overlay
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, 0, 1080, 1920);

    // Text
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 8;

    ctx.font = "bold 64px sans-serif";
    ctx.fillText(content.line1, 540, 750);
    ctx.font = "48px sans-serif";
    ctx.fillText(content.line2, 540, 850);
    ctx.font = "bold 44px sans-serif";
    ctx.fillText(content.line3, 540, 960);

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `homedog-story-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Paws saved your story image! 🐾");
    }, "image/png");
  };
  img.src = uploadedPhotos[0].dataUrl;
}

// ── Calendar Tab ──
function renderCalendar() {
  const container = document.getElementById("calendarView");
  if (!container) return;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = calendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const today = new Date();
  const scheduled = getScheduledDrafts();

  let html = `
    <div class="cal-header">
      <button class="btn btn-icon cal-nav" id="calPrev" aria-label="Previous month">‹</button>
      <h2>${monthName}</h2>
      <button class="btn btn-icon cal-nav" id="calNext" aria-label="Next month">›</button>
    </div>
    <div class="cal-today-btn"><button class="btn btn-sm" id="calToday">Today</button></div>
    <div class="cal-grid">
      <div class="cal-day-label">Sun</div><div class="cal-day-label">Mon</div>
      <div class="cal-day-label">Tue</div><div class="cal-day-label">Wed</div>
      <div class="cal-day-label">Thu</div><div class="cal-day-label">Fri</div>
      <div class="cal-day-label">Sat</div>
  `;

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-cell empty"></div>`;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayDrafts = scheduled.filter(d => d.postDate === dateStr);
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    const hasPosts = dayDrafts.length > 0;

    html += `
      <div class="cal-cell ${isToday ? "today" : ""} ${hasPosts ? "has-posts" : ""}" data-date="${dateStr}">
        <span class="cal-day-num">${day}</span>
        ${hasPosts ? `<span class="cal-dot">${dayDrafts.length}</span>` : ""}
      </div>`;
  }

  html += `</div>`;

  // Unscheduled section
  const unscheduled = getUnscheduledDrafts();
  if (unscheduled.length) {
    html += `
      <div class="cal-unscheduled">
        <h3>Unscheduled (${unscheduled.length})</h3>
        ${unscheduled.map(d => `
          <div class="draft-mini" data-id="${d.id}">
            <span class="draft-type">${d.formData?.contentType || "Post"}</span>
            <span class="draft-preview">${(d.outputs?.instagram?.text || d.outputs?.facebook?.text || "Untitled").substring(0, 50)}...</span>
          </div>
        `).join("")}
      </div>`;
  }

  container.innerHTML = html;

  // Day detail panel
  const detailPanel = document.getElementById("calendarDetail");

  // Listeners
  document.getElementById("calPrev")?.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
  });
  document.getElementById("calNext")?.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
  });
  document.getElementById("calToday")?.addEventListener("click", () => {
    calendarDate = new Date();
    renderCalendar();
  });

  container.querySelectorAll(".cal-cell.has-posts").forEach(cell => {
    cell.addEventListener("click", () => {
      const dateStr = cell.dataset.date;
      const dayDrafts = getDraftsByDate(dateStr);
      if (detailPanel) {
        detailPanel.innerHTML = `
          <h3>${new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
          ${dayDrafts.map(d => `
            <div class="draft-card-mini">
              <div class="draft-type-badge">${d.formData?.contentType || "Post"}</div>
              <p>${(d.outputs?.instagram?.text || d.outputs?.facebook?.text || "").substring(0, 100)}...</p>
              <div class="draft-platforms">${(d.formData?.platforms || []).join(", ")}</div>
            </div>
          `).join("")}
        `;
        detailPanel.classList.remove("hidden");
      }
    });
  });
}

// ── Drafts Tab ──
function renderDrafts() {
  const container = document.getElementById("draftsList");
  if (!container) return;

  const drafts = getDrafts();
  if (!drafts.length) {
    container.innerHTML = `<div class="empty-state"><p>No saved drafts yet.</p><p>Let Paws cook up some content, then hit Save Draft!</p></div>`;
    return;
  }

  const storage = getStorageUsage();
  let html = "";

  if (storage.nearLimit) {
    html += `<div class="storage-warning">Storage is ${storage.usedMB}MB / 5MB. Consider deleting old drafts.</div>`;
  }

  html += `<div class="drafts-actions">
    <button class="btn btn-sm" id="exportAllDrafts">Export All (.txt)</button>
  </div>`;

  for (const draft of drafts) {
    const preview = draft.outputs?.instagram?.text || draft.outputs?.facebook?.text || draft.outputs?.tiktok?.text || "Untitled";
    const rating = getRatingForDraft(draft.id);
    html += `
      <div class="draft-card" data-id="${draft.id}">
        <div class="draft-card-header">
          <span class="draft-type-badge">${draft.formData?.contentType || "Post"}</span>
          <span class="draft-date">${draft.postDate || "Unscheduled"}</span>
          <button class="btn-icon delete-draft" data-id="${draft.id}" aria-label="Delete draft">&times;</button>
        </div>
        <p class="draft-preview-text">${preview.substring(0, 120)}...</p>
        <div class="draft-platforms">${(draft.formData?.platforms || []).join(" • ")}</div>
        ${rating ? `<div class="draft-rating">${"★".repeat(rating.stars)}${"☆".repeat(5 - rating.stars)}</div>` : ""}
        <div class="draft-saved">Saved ${new Date(draft.savedAt).toLocaleDateString()}</div>
      </div>`;
  }

  container.innerHTML = html;

  container.querySelectorAll(".delete-draft").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("Delete this draft?")) {
        deleteDraft(btn.dataset.id);
        renderDrafts();
      }
    });
  });

  document.getElementById("exportAllDrafts")?.addEventListener("click", () => {
    const text = exportDraftsAsText(drafts);
    downloadText(text, `homedog-all-drafts-${new Date().toISOString().slice(0, 10)}.txt`);
  });
}

// ── Performance Tab ──
function renderPerformance() {
  const container = document.getElementById("performanceView");
  if (!container) return;

  const stats = getPerformanceStats();
  const drafts = getDrafts();

  if (!stats || !stats.totalRated) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Paws is waiting for feedback</h3>
        <p>After you publish a post, come back here to rate how it performed. Paws gets smarter with every rating.</p>
      </div>
      ${drafts.length ? renderRatingForms(drafts) : ""}`;
    return;
  }

  let html = `
    <div class="perf-overview">
      <div class="perf-stat">
        <span class="perf-num">${stats.totalRated}</span>
        <span class="perf-label">Rated Posts</span>
      </div>
      <div class="perf-stat">
        <span class="perf-num">${stats.avgRating}</span>
        <span class="perf-label">Avg Rating</span>
      </div>
      <div class="perf-stat">
        <span class="perf-num">${stats.organicAvg}</span>
        <span class="perf-label">Organic Avg</span>
      </div>
      <div class="perf-stat">
        <span class="perf-num">${stats.paidAvg}</span>
        <span class="perf-label">Paid Avg</span>
      </div>
    </div>

    <div class="perf-section">
      <h3>By Platform</h3>
      <div class="perf-bars">
        ${Object.entries(stats.byPlatform).map(([k, v]) => `
          <div class="perf-bar-row">
            <span class="perf-bar-label">${k}</span>
            <div class="perf-bar-track"><div class="perf-bar-fill" style="width:${v / 5 * 100}%"></div></div>
            <span class="perf-bar-val">${v}</span>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="perf-section">
      <h3>By Content Type</h3>
      <div class="perf-bars">
        ${Object.entries(stats.byContentType).map(([k, v]) => `
          <div class="perf-bar-row">
            <span class="perf-bar-label">${k}</span>
            <div class="perf-bar-track"><div class="perf-bar-fill" style="width:${v / 5 * 100}%"></div></div>
            <span class="perf-bar-val">${v}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  html += renderRatingForms(drafts);
  container.innerHTML = html;
  attachRatingListeners(container);
}

function renderRatingForms(drafts) {
  const unrated = drafts.filter(d => !getRatingForDraft(d.id)).slice(0, 10);
  if (!unrated.length) return "";

  let html = `<div class="perf-section"><h3>Rate Your Posts</h3>`;
  for (const draft of unrated) {
    const preview = draft.outputs?.instagram?.text || draft.outputs?.facebook?.text || "Untitled";
    html += `
      <div class="rating-card" data-draft-id="${draft.id}">
        <p class="draft-preview-text">${preview.substring(0, 80)}...</p>
        <div class="star-rating">
          ${[1, 2, 3, 4, 5].map(i => `<button class="star-btn" data-stars="${i}" aria-label="${i} stars">☆</button>`).join("")}
        </div>
        <input type="text" class="rating-notes" placeholder="Quick notes (optional)" maxlength="100">
        <button class="btn btn-sm save-rating-btn">Save Rating</button>
      </div>`;
  }
  html += `</div>`;
  return html;
}

function attachRatingListeners(container) {
  container.querySelectorAll(".rating-card").forEach(card => {
    let selectedStars = 0;
    card.querySelectorAll(".star-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        selectedStars = parseInt(btn.dataset.stars);
        card.querySelectorAll(".star-btn").forEach((b, i) => {
          b.textContent = i < selectedStars ? "★" : "☆";
          b.classList.toggle("active", i < selectedStars);
        });
      });
    });

    card.querySelector(".save-rating-btn")?.addEventListener("click", () => {
      if (!selectedStars) { showToast("Give Paws some stars first!"); return; }
      const notes = card.querySelector(".rating-notes")?.value || "";
      saveRating(card.dataset.draftId, { stars: selectedStars, notes });
      showToast("Rating saved! Paws is learning 🐾");
      renderPerformance();
    });
  });
}

// ── Toast ──
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2500);
}

// ── Utility ──
function escapeHtml(str) {
  return str.replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
