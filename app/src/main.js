// Vice Grid Cover Studio — the editor.
// Loads the sample photos (or the user's own), wires every control to the
// live preview, and runs the ?shot= scenes the screenshots are taken from:
//   ?shot=cover   full-window exported cover (any size/layout/grade)
//   ?shot=editor  the editor with a photo loaded and a preset applied

import {
  SIZES, SIZE_ORDER, GRADES, LAYOUTS, LETTERINGS,
  layoutById, gradeById, letteringById,
  defaultState, renderCover, renderCoverToCanvas,
  exportCoverPNG, exportAllSizes, downloadBlob, slugifyTitle,
} from './cover.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const shot = params.get('shot');

const state = defaultState();
// URL presets (used by the screenshot scenes and shareable links).
if (params.get('layout')) state.layout = params.get('layout');
if (params.get('grade')) state.grade = params.get('grade');
if (params.get('lettering')) state.lettering = params.get('lettering');
if (params.get('title')) state.title = params.get('title');
if (params.get('subtitle')) state.subtitle = params.get('subtitle');
if (params.get('size')) state.size = params.get('size');

const photos = []; // { name, img, src }
let previewRaf = 0;

function loadImage(src, name) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ name, img, src });
    img.onerror = () => reject(new Error('could not load ' + name));
    img.src = src;
  });
}

async function loadSamples() {
  const defs = [
    { src: 'samples/boulevard.jpg', name: 'Boulevard — golden hour' },
    { src: 'samples/neon.jpg', name: 'Neon street — night' },
  ];
  for (const d of defs) {
    try {
      photos.push(await loadImage(d.src, d.name));
    } catch (e) {
      console.warn(e.message);
    }
  }
}

function currentSize() {
  return SIZES[state.size] || SIZES.square;
}

// ---- live preview -------------------------------------------------------
function renderPreview() {
  const canvas = $('preview');
  if (!canvas) return;
  const size = currentSize();
  const aspect = size.w / size.h;
  const displayW = 960;
  canvas.width = displayW;
  canvas.height = Math.round(displayW / aspect);
  renderCover(canvas, canvas.width, canvas.height, state, photos.map((p) => p.img));
  canvas.dataset.layout = state.layout;
  canvas.dataset.grade = state.grade;
}

function schedulePreview() {
  if (previewRaf) return;
  previewRaf = requestAnimationFrame(() => {
    previewRaf = 0;
    renderPreview();
  });
}

// ---- controls -----------------------------------------------------------
function buildLayoutGrid() {
  const grid = $('layoutGrid');
  grid.innerHTML = '';
  for (const layout of LAYOUTS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'layout-btn' + (layout.id === state.layout ? ' active' : '');
    btn.dataset.layout = layout.id;
    btn.title = layout.name + ' — ' + layout.panels + ' panels';
    const mini = document.createElement('span');
    mini.className = 'mini';
    for (const r of layout.rects) {
      if (r.backdrop) continue;
      const cell = document.createElement('i');
      cell.style.left = r.x * 100 + '%';
      cell.style.top = r.y * 100 + '%';
      cell.style.width = r.w * 100 + '%';
      cell.style.height = r.h * 100 + '%';
      if (r.tilt) cell.style.transform = `rotate(${r.tilt}deg)`;
      mini.appendChild(cell);
    }
    const label = document.createElement('span');
    label.className = 'layout-name';
    label.textContent = layout.name;
    const count = document.createElement('span');
    count.className = 'layout-count';
    count.textContent = layout.panels + ' panels';
    btn.append(mini, label, count);
    btn.addEventListener('click', () => {
      state.layout = layout.id;
      state.selectedPanel = 0;
      syncControls();
      schedulePreview();
    });
    grid.appendChild(btn);
  }
}

function buildGradeSwatches() {
  const wrap = $('gradeRow');
  wrap.innerHTML = '';
  for (const grade of GRADES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'grade-btn' + (grade.id === state.grade ? ' active' : '');
    btn.dataset.grade = grade.id;
    btn.style.background = `linear-gradient(135deg, ${grade.top}, ${grade.bottom})`;
    btn.title = grade.name;
    const label = document.createElement('span');
    label.textContent = grade.name;
    btn.appendChild(label);
    btn.addEventListener('click', () => {
      state.grade = grade.id;
      syncControls();
      schedulePreview();
    });
    wrap.appendChild(btn);
  }
}

function buildLetteringRow() {
  const wrap = $('letteringRow');
  wrap.innerHTML = '';
  for (const item of LETTERINGS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip' + (item.id === state.lettering ? ' active' : '');
    btn.textContent = item.name;
    btn.addEventListener('click', () => {
      state.lettering = item.id;
      syncControls();
      schedulePreview();
    });
    wrap.appendChild(btn);
  }
}

function buildSizeTabs() {
  const wrap = $('sizeTabs');
  wrap.innerHTML = '';
  for (const id of SIZE_ORDER) {
    const size = SIZES[id];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'size-tab' + (id === state.size ? ' active' : '');
    btn.textContent = size.label;
    btn.addEventListener('click', () => {
      state.size = id;
      syncControls();
      schedulePreview();
    });
    wrap.appendChild(btn);
  }
}

function buildPhotoThumbs() {
  const wrap = $('photoThumbs');
  wrap.innerHTML = '';
  photos.forEach((photo, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'thumb';
    btn.title = photo.name + ' — click to put it in the selected panel';
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.name;
    const label = document.createElement('span');
    label.textContent = photo.name.split(' — ')[0];
    btn.append(img, label);
    btn.addEventListener('click', () => {
      state.panels[state.selectedPanel].photo = i;
      schedulePreview();
    });
    wrap.appendChild(btn);
  });
  const hint = document.createElement('p');
  hint.className = 'thumb-hint';
  hint.textContent = photos.length
    ? 'Click a photo to fill the selected panel. Upload your own below.'
    : 'Loading samples…';
  wrap.appendChild(hint);
}

function syncControls() {
  document.querySelectorAll('.layout-btn').forEach((b) => b.classList.toggle('active', b.dataset.layout === state.layout));
  document.querySelectorAll('.grade-btn').forEach((b) => b.classList.toggle('active', b.dataset.grade === state.grade));
  document.querySelectorAll('#letteringRow .chip').forEach((b) => b.classList.toggle('active', b.textContent === letteringById(state.lettering).name));
  document.querySelectorAll('.size-tab').forEach((b) => b.classList.toggle('active', b.textContent === currentSize().label));
  $('titleInput').value = state.title;
  $('subtitleInput').value = state.subtitle;
  $('frameChk').checked = state.frame;
  $('grainChk').checked = state.grain;
  $('vignetteChk').checked = state.vignette;
  $('badgeChk').checked = state.badge;
  $('heatRange').value = String(state.heat);
  $('heatVal').textContent = '★'.repeat(state.heat) + '☆'.repeat(5 - state.heat);
  const layout = layoutById(state.layout);
  $('panelLabel').textContent = `Panel ${state.selectedPanel + 1} of ${layout.panels} — ${layout.name}`;
  const crop = state.panels[state.selectedPanel];
  $('zoomRange').value = String(crop.zoom);
  $('panXRange').value = String(crop.x);
  $('panYRange').value = String(crop.y);
  $('zoomVal').textContent = Math.round(crop.zoom * 100) + '%';
  $('panelPhotoLabel').textContent = photos[crop.photo] ? photos[crop.photo].name : '—';
  $('layoutName').textContent = layout.name;
  $('gradeName').textContent = gradeById(state.grade).name;
  $('sizeName').textContent = currentSize().label;
}

// ---- panel picking on the preview ---------------------------------------
function panelAtPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const ux = (clientX - rect.left) / rect.width;
  const uy = (clientY - rect.top) / rect.height;
  const layout = layoutById(state.layout);
  for (let i = layout.rects.length - 1; i >= 0; i--) {
    const r = layout.rects[i];
    if (r.backdrop) continue;
    if (ux >= r.x && ux <= r.x + r.w && uy >= r.y && uy <= r.y + r.h) return i;
  }
  return -1;
}

function wirePreview() {
  const canvas = $('preview');
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  canvas.addEventListener('pointerdown', (e) => {
    const idx = panelAtPoint(canvas, e.clientX, e.clientY);
    if (idx >= 0) {
      state.selectedPanel = idx;
      syncControls();
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const crop = state.panels[state.selectedPanel];
    const layout = layoutById(state.layout);
    const r = layout.rects[state.selectedPanel];
    crop.x = Math.max(-1, Math.min(1, crop.x + ((e.clientX - lastX) / rect.width) / r.w * 1.6));
    crop.y = Math.max(-1, Math.min(1, crop.y + ((e.clientY - lastY) / rect.height) / r.h * 1.6));
    lastX = e.clientX;
    lastY = e.clientY;
    syncControls();
    schedulePreview();
  });
  canvas.addEventListener('pointerup', () => { dragging = false; });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const crop = state.panels[state.selectedPanel];
    crop.zoom = Math.max(1, Math.min(3, crop.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
    syncControls();
    schedulePreview();
  }, { passive: false });
}

// ---- export -------------------------------------------------------------
function setStatus(text) {
  $('statusLine').textContent = text;
}

async function exportOne() {
  setStatus('Rendering ' + currentSize().label + '…');
  try {
    const result = await exportCoverPNG(state.size, state, photos.map((p) => p.img));
    downloadBlob(result.blob, `vice-grid-${slugifyTitle(state.title)}-${result.w}x${result.h}.png`);
    setStatus(`Exported ${result.w} × ${result.h} PNG (${Math.round(result.bytes / 1024)} KB) — check your downloads.`);
  } catch (e) {
    setStatus('Export failed: ' + e.message);
  }
}

async function exportAll() {
  setStatus('Rendering all 3 sizes…');
  try {
    const results = await exportAllSizes(state, photos.map((p) => p.img));
    for (const r of results) {
      downloadBlob(r.blob, `vice-grid-${slugifyTitle(state.title)}-${r.w}x${r.h}.png`);
    }
    setStatus(`Exported all 3 sizes — 1080×1080, 1080×1350, 1920×1080 PNGs (${results.map((r) => Math.round(r.bytes / 1024) + ' KB').join(' · ')}).`);
  } catch (e) {
    setStatus('Export failed: ' + e.message);
  }
}

function wireControls() {
  $('titleInput').addEventListener('input', (e) => { state.title = e.target.value; schedulePreview(); });
  $('subtitleInput').addEventListener('input', (e) => { state.subtitle = e.target.value; schedulePreview(); });
  $('frameChk').addEventListener('change', (e) => { state.frame = e.target.checked; schedulePreview(); });
  $('grainChk').addEventListener('change', (e) => { state.grain = e.target.checked; schedulePreview(); });
  $('vignetteChk').addEventListener('change', (e) => { state.vignette = e.target.checked; schedulePreview(); });
  $('badgeChk').addEventListener('change', (e) => { state.badge = e.target.checked; schedulePreview(); });
  $('heatRange').addEventListener('input', (e) => { state.heat = Number(e.target.value); syncControls(); schedulePreview(); });
  $('zoomRange').addEventListener('input', (e) => {
    state.panels[state.selectedPanel].zoom = Number(e.target.value);
    syncControls(); schedulePreview();
  });
  $('panXRange').addEventListener('input', (e) => {
    state.panels[state.selectedPanel].x = Number(e.target.value);
    schedulePreview();
  });
  $('panYRange').addEventListener('input', (e) => {
    state.panels[state.selectedPanel].y = Number(e.target.value);
    schedulePreview();
  });
  $('fillAllBtn').addEventListener('click', () => {
    const photo = state.panels[state.selectedPanel].photo;
    for (const p of state.panels) p.photo = photo;
    schedulePreview();
    setStatus('All panels now use “' + (photos[photo]?.name || 'photo') + '”.');
  });
  $('shuffleBtn').addEventListener('click', () => {
    state.layout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)].id;
    state.grade = GRADES[Math.floor(Math.random() * GRADES.length)].id;
    state.lettering = LETTERINGS[Math.floor(Math.random() * LETTERINGS.length)].id;
    syncControls();
    schedulePreview();
    setStatus('Surprise look: ' + layoutById(state.layout).name + ' · ' + gradeById(state.grade).name + ' · ' + letteringById(state.lettering).name + '.');
  });
  $('exportBtn').addEventListener('click', exportOne);
  $('exportAllBtn').addEventListener('click', exportAll);
  $('uploadInput').addEventListener('change', async (e) => {
    const files = [...e.target.files].filter((f) => f.type.startsWith('image/'));
    for (const file of files) {
      const src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      try {
        const loaded = await loadImage(src, file.name.replace(/\.[^.]+$/, ''));
        photos.push(loaded);
        state.panels[state.selectedPanel].photo = photos.length - 1;
      } catch (err) {
        console.warn(err.message);
      }
    }
    buildPhotoThumbs();
    syncControls();
    schedulePreview();
    e.target.value = '';
  });
}

// ---- shot scenes (for the screenshots) ----------------------------------
async function runCoverShot() {
  document.body.classList.add('shot-cover');
  const size = currentSize();
  const canvas = $('shotCanvas');
  await document.fonts.ready;
  renderCover(canvas, size.w, size.h, state, photos.map((p) => p.img));
  document.body.dataset.ready = '1';
  window.__coverReady = true;
}

async function runEditorShot() {
  await document.fonts.ready;
  buildLayoutGrid();
  buildGradeSwatches();
  buildLetteringRow();
  buildSizeTabs();
  buildPhotoThumbs();
  wireControls();
  wirePreview();
  syncControls();
  renderPreview();
  document.body.dataset.ready = '1';
  window.__coverReady = true;
}

async function boot() {
  await loadSamples();
  if (shot === 'cover') {
    await runCoverShot();
    return;
  }
  await runEditorShot();
}

document.addEventListener('DOMContentLoaded', boot);
