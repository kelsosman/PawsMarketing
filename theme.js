/* style.css — HomeDog Content Generator — Mobile First */

/* ── Variables ── */
:root {
  --primary: #D4793A;
  --primary-dark: #B8622A;
  --secondary: #2A6B5A;
  --secondary-dark: #1E5245;
  --accent: #E8C547;
  --bg: #FAF7F2;
  --card: #FFFFFF;
  --text: #2C2C2C;
  --text-muted: #7A7570;
  --border: #E8E0D6;
  --success: #4CAF50;
  --warning: #FF9800;
  --error: #E53935;
  --star: #F4B942;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-lg: 0 4px 20px rgba(0,0,0,0.12);
  --nav-height: 64px;
  --font: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'Outfit', 'DM Sans', sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1A1A1A;
    --card: #2A2A2A;
    --text: #E8E4DF;
    --text-muted: #9A9590;
    --border: #3A3A3A;
    --shadow: 0 2px 8px rgba(0,0,0,0.3);
    --shadow-lg: 0 4px 20px rgba(0,0,0,0.4);
  }
}

/* ── Reset & Base ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
  min-height: 100dvh;
  padding-bottom: calc(var(--nav-height) + 16px);
  overflow-x: hidden;
}

/* ── Typography ── */
h1, h2, h3 { font-family: var(--font-display); font-weight: 700; }
h1 { font-size: 1.5rem; }
h2 { font-size: 1.25rem; }
h3 { font-size: 1.1rem; }

/* ── Header ── */
.app-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}
.app-header img {
  height: 32px;
  width: auto;
}
.app-header h1 {
  font-size: 1.1rem;
  color: var(--primary);
  line-height: 1.1;
}
.header-subtitle {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 400;
  letter-spacing: 0.5px;
}

/* ── Bottom Navigation (Mobile) ── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: var(--card);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 200;
  padding-bottom: env(safe-area-inset-bottom, 0);
}
.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-family: var(--font);
  cursor: pointer;
  min-width: 64px;
  min-height: 44px;
  transition: color 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.nav-btn .nav-icon { font-size: 1.4rem; }
.nav-btn.active { color: var(--primary); }
.nav-btn.active .nav-icon { transform: scale(1.1); }

/* ── Tab Content ── */
.tab-content { display: none; padding: 16px; }
.tab-content.active { display: block; }

/* ── Form Elements ── */
.form-group { margin-bottom: 16px; }
.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: var(--text);
}
input[type="text"], input[type="date"], input[type="time"],
select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-family: var(--font);
  background: var(--card);
  color: var(--text);
  -webkit-appearance: none;
  appearance: none;
  transition: border-color 0.2s;
}
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(212, 121, 58, 0.15);
}
textarea { min-height: 120px; resize: vertical; }

/* Raw notes with voice button */
.notes-wrapper {
  position: relative;
}
.notes-wrapper textarea { padding-right: 52px; }
#voiceBtn {
  position: absolute;
  right: 8px;
  top: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--card);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
#voiceBtn.recording {
  background: var(--error);
  color: white;
  border-color: var(--error);
  animation: pulse 1.2s infinite;
}
#voiceBtn.disabled { opacity: 0.4; cursor: not-allowed; }

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* ── Platform Checkboxes ── */
.platform-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.platform-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}
.platform-option:has(input:checked) {
  border-color: var(--primary);
  background: rgba(212, 121, 58, 0.08);
}
.platform-option input { accent-color: var(--primary); }

/* ── Paid Toggle ── */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}
.toggle-switch {
  position: relative;
  width: 48px;
  height: 28px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  inset: 0;
  background: var(--border);
  border-radius: 14px;
  cursor: pointer;
  transition: 0.3s;
}
.toggle-slider::before {
  content: "";
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  left: 3px;
  top: 3px;
  transition: 0.3s;
}
.toggle-switch input:checked + .toggle-slider { background: var(--primary); }
.toggle-switch input:checked + .toggle-slider::before { transform: translateX(20px); }

/* ── Photo Upload ── */
.photo-drop-area {
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-muted);
}
.photo-drop-area:hover, .photo-drop-area.drag-over {
  border-color: var(--primary);
  background: rgba(212, 121, 58, 0.05);
}
.photo-drop-area .upload-icon { font-size: 1.8rem; }
.photo-drop-area .upload-text { font-size: 0.85rem; }

.photo-previews {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.photo-thumb {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.photo-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--card);
  color: var(--text);
  font-family: var(--font);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.btn:active { transform: scale(0.97); }
.btn-primary {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}
.btn-primary:hover { background: var(--primary-dark); }
.btn-sm { padding: 8px 14px; font-size: 0.8rem; min-height: 36px; }
.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
}

#generateBtn {
  position: sticky;
  bottom: calc(var(--nav-height) + 12px);
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  z-index: 50;
  box-shadow: var(--shadow-lg);
}

/* ── Conditional/Hidden Fields ── */
.hidden { display: none !important; }
.visible { display: block !important; }

/* ── Output Cards ── */
#outputSection { margin-top: 24px; }
.output-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: var(--shadow);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.card-header h3 { color: var(--primary); font-size: 0.95rem; }
.regen-btn { font-size: 1.3rem; }

.output-text {
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
  margin-bottom: 8px;
}
.output-hashtags {
  font-size: 0.8rem;
  color: var(--secondary);
  margin-bottom: 8px;
  word-break: break-all;
}
.output-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.output-meta.warn { color: var(--warning); }
.output-field { font-size: 0.85rem; margin-bottom: 6px; }
.field-label { font-weight: 600; color: var(--text-muted); }
.char-count { font-size: 0.7rem; color: var(--text-muted); }

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.copy-btn.copied {
  background: var(--success);
  color: white;
  border-color: var(--success);
}

.output-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

/* ── Story Preview ── */
.story-preview {
  position: relative;
  width: 100%;
  max-width: 270px;
  aspect-ratio: 9/16;
  margin: 0 auto 12px;
  border-radius: var(--radius);
  overflow: hidden;
  background: #1a1a1a;
}
.story-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.story-bg-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
}
.story-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  background: rgba(0,0,0,0.25);
}
.story-line1 {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}
.story-line2 {
  font-size: 0.8rem;
  color: white;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}
.story-line3 {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ── Ad Variants ── */
.ad-variant {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.ad-variant:last-child { border-bottom: none; }
.variant-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

/* ── Calendar ── */
.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.cal-header h2 { font-size: 1.1rem; }
.cal-nav { font-size: 1.5rem; color: var(--primary); }
.cal-today-btn { text-align: center; margin-bottom: 12px; }

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.cal-day-label {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  padding: 4px 0;
}
.cal-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  position: relative;
  cursor: default;
  gap: 2px;
}
.cal-cell.empty { background: transparent; }
.cal-cell.today {
  background: rgba(212, 121, 58, 0.12);
  font-weight: 700;
}
.cal-cell.has-posts {
  cursor: pointer;
  background: rgba(42, 107, 90, 0.1);
}
.cal-cell.has-posts:active { background: rgba(42, 107, 90, 0.2); }
.cal-day-num { font-size: 0.85rem; }
.cal-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--secondary);
  color: white;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.cal-unscheduled {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.cal-unscheduled h3 { font-size: 0.9rem; margin-bottom: 8px; color: var(--text-muted); }

#calendarDetail {
  margin-top: 16px;
  padding: 16px;
  background: var(--card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}
#calendarDetail h3 { margin-bottom: 12px; }

/* ── Drafts ── */
.draft-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  margin-bottom: 10px;
}
.draft-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.draft-type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(212, 121, 58, 0.12);
  color: var(--primary);
}
.draft-date { font-size: 0.8rem; color: var(--text-muted); }
.draft-card-header .delete-draft {
  margin-left: auto;
  font-size: 1.2rem;
  color: var(--text-muted);
}
.draft-preview-text {
  font-size: 0.85rem;
  color: var(--text);
  margin-bottom: 6px;
}
.draft-platforms {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.draft-rating {
  color: var(--star);
  font-size: 0.9rem;
  margin-top: 4px;
}
.draft-saved {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 4px;
}
.draft-card-mini {
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
}
.draft-mini {
  padding: 8px;
  border-bottom: 1px solid var(--border);
  font-size: 0.8rem;
}
.draft-mini .draft-type { font-weight: 600; margin-right: 6px; }

.drafts-actions { margin-bottom: 12px; }
.storage-warning {
  background: rgba(255, 152, 0, 0.12);
  color: var(--warning);
  padding: 10px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  margin-bottom: 12px;
}

/* ── Performance ── */
.perf-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}
.perf-stat {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
}
.perf-num {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  font-family: var(--font-display);
}
.perf-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.perf-section { margin-bottom: 24px; }
.perf-section h3 { margin-bottom: 12px; font-size: 0.95rem; }

.perf-bars { display: flex; flex-direction: column; gap: 8px; }
.perf-bar-row {
  display: grid;
  grid-template-columns: 80px 1fr 30px;
  align-items: center;
  gap: 8px;
}
.perf-bar-label { font-size: 0.75rem; font-weight: 600; text-transform: capitalize; }
.perf-bar-track {
  height: 12px;
  background: var(--border);
  border-radius: 6px;
  overflow: hidden;
}
.perf-bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 6px;
  transition: width 0.5s ease;
}
.perf-bar-val { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }

/* ── Rating ── */
.rating-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  margin-bottom: 10px;
}
.star-rating {
  display: flex;
  gap: 4px;
  margin: 8px 0;
}
.star-btn {
  font-size: 1.6rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--border);
  padding: 0 2px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
}
.star-btn.active, .star-btn:hover { color: var(--star); }
.rating-notes {
  margin-bottom: 8px;
}

/* ── Toast ── */
#toast {
  position: fixed;
  bottom: calc(var(--nav-height) + 20px);
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--text);
  color: var(--bg);
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 300;
  white-space: nowrap;
}
#toast.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ── Empty States ── */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
}
.empty-state h3 { margin-bottom: 8px; color: var(--text); }
.empty-state p { font-size: 0.9rem; }

/* ── Desktop Enhancements ── */
@media (min-width: 768px) {
  body { padding-bottom: 0; }
  .bottom-nav {
    position: static;
    border-top: none;
    border-bottom: 1px solid var(--border);
    justify-content: flex-start;
    gap: 0;
    padding: 0 16px;
  }
  .nav-btn {
    flex-direction: row;
    gap: 6px;
    padding: 16px 20px;
    font-size: 0.85rem;
    border-bottom: 2px solid transparent;
    border-radius: 0;
  }
  .nav-btn.active { border-bottom-color: var(--primary); }
  .nav-btn .nav-icon { font-size: 1.1rem; }

  .tab-content { max-width: 800px; margin: 0 auto; padding: 24px; }
  .platform-grid { grid-template-columns: 1fr 1fr 1fr; }
  .perf-overview { grid-template-columns: repeat(4, 1fr); }

  #generateBtn {
    position: static;
    box-shadow: none;
    max-width: 300px;
  }

  .cal-cell { font-size: 0.9rem; }
}

/* ── Font Import ── */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700&display=swap');
