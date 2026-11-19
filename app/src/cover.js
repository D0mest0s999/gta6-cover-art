// Vice Grid Cover Studio — the cover renderer.
// Draws GTA-style multi-panel poster covers on a 2D canvas: nine layouts,
// six sunset/neon colour grades, four lettering styles, grain + vignette,
// and PNG export in the three common post sizes.

export const SIZES = {
  square: { id: 'square', w: 1080, h: 1080, label: '1080 × 1080 · Post' },
  portrait: { id: 'portrait', w: 1080, h: 1350, label: '1080 × 1350 · Portrait' },
  wide: { id: 'wide', w: 1920, h: 1080, label: '1920 × 1080 · Landscape' },
};
export const SIZE_ORDER = ['square', 'portrait', 'wide'];

export const GRADES = [
  { id: 'sunset', name: 'Vice Sunset', top: '#ff9a3d', bottom: '#ff2e7e', wash: '#ff6a00', overlay: 0.52, washAlpha: 0.28, accent: '#ff2e7e' },
  { id: 'neon', name: 'Neon Nights', top: '#ff2ea6', bottom: '#00e5ff', wash: '#8a2be2', overlay: 0.5, washAlpha: 0.3, accent: '#00e5ff' },
  { id: 'hotpink', name: 'Hot Pink', top: '#ff5e8a', bottom: '#e60073', wash: '#ff2e88', overlay: 0.46, washAlpha: 0.3, accent: '#ff2e88' },
  { id: 'tealheat', name: 'Teal Heat', top: '#00d1b2', bottom: '#ff7a00', wash: '#00b3a6', overlay: 0.5, washAlpha: 0.26, accent: '#00d1b2' },
  { id: 'goldenhour', name: 'Golden Hour', top: '#ffc46b', bottom: '#ff5e3a', wash: '#ffb347', overlay: 0.46, washAlpha: 0.26, accent: '#ffb347' },
  { id: 'noir', name: 'Mono Noir', top: '#ffffff', bottom: '#000000', wash: '#223344', overlay: 0.14, washAlpha: 0.2, accent: '#ffffff', filter: 'grayscale(1) contrast(1.18) brightness(1.06)' },
];

export const LETTERINGS = [
  { id: 'bold', name: 'Bold Block' },
  { id: 'halftone', name: 'Halftone Pop' },
  { id: 'neon', name: 'Neon Glow' },
  { id: 'outline', name: 'Outline' },
];

// Every layout is a list of panels in unit coordinates (0..1 of the cover)
// plus a title zone. `tilt` rotates a snapshot panel; `backdrop` marks the
// full-bleed photo behind the tilted snapshots.
export const LAYOUTS = [
  {
    id: 'hero3', name: 'Hero + 3', panels: 4,
    rects: [
      { x: 0, y: 0, w: 0.62, h: 1 },
      { x: 0.62, y: 0, w: 0.38, h: 0.34 },
      { x: 0.62, y: 0.34, w: 0.38, h: 0.33 },
      { x: 0.62, y: 0.67, w: 0.38, h: 0.33 },
    ],
    title: { x: 0.03, y: 0.7, w: 0.56, h: 0.27, align: 'left' },
  },
  {
    id: 'nine', name: 'Nine Grid', panels: 9,
    rects: [
      { x: 0, y: 0, w: 0.333, h: 0.333 }, { x: 0.333, y: 0, w: 0.334, h: 0.333 }, { x: 0.667, y: 0, w: 0.333, h: 0.333 },
      { x: 0, y: 0.333, w: 0.333, h: 0.334 }, { x: 0.333, y: 0.333, w: 0.334, h: 0.334 }, { x: 0.667, y: 0.333, w: 0.333, h: 0.334 },
      { x: 0, y: 0.667, w: 0.333, h: 0.333 }, { x: 0.333, y: 0.667, w: 0.334, h: 0.333 }, { x: 0.667, y: 0.667, w: 0.333, h: 0.333 },
    ],
    title: { x: 0.04, y: 0.68, w: 0.92, h: 0.28, align: 'left' },
  },
  {
    id: 'bleed', name: 'Full Bleed', panels: 1,
    rects: [{ x: 0, y: 0, w: 1, h: 1 }],
    title: { x: 0.04, y: 0.68, w: 0.92, h: 0.28, align: 'left' },
  },
  {
    id: 'duo', name: 'Split Duo', panels: 2,
    rects: [{ x: 0, y: 0, w: 0.5, h: 1 }, { x: 0.5, y: 0, w: 0.5, h: 1 }],
    title: { x: 0.04, y: 0.72, w: 0.92, h: 0.24, align: 'left' },
  },
  {
    id: 'tilt', name: 'Tilted Snaps', panels: 4,
    rects: [
      { x: 0, y: 0, w: 1, h: 1, backdrop: true },
      { x: 0.07, y: 0.07, w: 0.4, h: 0.44, tilt: -6 },
      { x: 0.53, y: 0.05, w: 0.4, h: 0.44, tilt: 4 },
      { x: 0.3, y: 0.49, w: 0.4, h: 0.36, tilt: -2 },
    ],
    title: { x: 0.05, y: 0.86, w: 0.9, h: 0.12, align: 'left' },
  },
  {
    id: 'quad', name: 'Quad', panels: 4,
    rects: [
      { x: 0, y: 0, w: 0.5, h: 0.5 }, { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 }, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
    title: { x: 0.04, y: 0.7, w: 0.92, h: 0.26, align: 'left' },
  },
  {
    id: 'magazine', name: 'Magazine', panels: 4,
    rects: [
      { x: 0, y: 0, w: 1, h: 0.62 },
      { x: 0, y: 0.62, w: 0.333, h: 0.38 },
      { x: 0.333, y: 0.62, w: 0.334, h: 0.38 },
      { x: 0.667, y: 0.62, w: 0.333, h: 0.38 },
    ],
    title: { x: 0.04, y: 0.4, w: 0.92, h: 0.2, align: 'left' },
  },
  {
    id: 'strips', name: 'Vertical Strips', panels: 4,
    rects: [
      { x: 0, y: 0, w: 0.25, h: 1 }, { x: 0.25, y: 0, w: 0.25, h: 1 },
      { x: 0.5, y: 0, w: 0.25, h: 1 }, { x: 0.75, y: 0, w: 0.25, h: 1 },
    ],
    title: { x: 0.04, y: 0.72, w: 0.92, h: 0.24, align: 'left' },
  },
  {
    id: 'center', name: 'Centre Hero', panels: 5,
    rects: [
      { x: 0, y: 0, w: 0.25, h: 0.5 }, { x: 0, y: 0.5, w: 0.25, h: 0.5 },
      { x: 0.25, y: 0, w: 0.5, h: 1 },
      { x: 0.75, y: 0, w: 0.25, h: 0.5 }, { x: 0.75, y: 0.5, w: 0.25, h: 0.5 },
    ],
    title: { x: 0.28, y: 0.74, w: 0.44, h: 0.22, align: 'center' },
  },
];

export function layoutById(id) {
  return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];
}
export function gradeById(id) {
  return GRADES.find((g) => g.id === id) || GRADES[0];
}
export function letteringById(id) {
  return LETTERINGS.find((l) => l.id === id) || LETTERINGS[0];
}

export function defaultPanels() {
  // Nine slots; each layout reads only the slots it needs. Photos alternate
  // between the two samples so every layout looks full on first open.
  const crops = [
    { photo: 0, zoom: 1.12, x: 0.08, y: 0 },
    { photo: 1, zoom: 1.15, x: 0, y: 0.05 },
    { photo: 0, zoom: 1.3, x: -0.1, y: 0.05 },
    { photo: 1, zoom: 1.2, x: 0.1, y: 0 },
    { photo: 0, zoom: 1.25, x: 0.05, y: -0.05 },
    { photo: 1, zoom: 1.35, x: -0.08, y: 0.08 },
    { photo: 0, zoom: 1.18, x: 0, y: 0.1 },
    { photo: 1, zoom: 1.1, x: 0, y: -0.05 },
    { photo: 0, zoom: 1.4, x: -0.05, y: 0 },
  ];
  return crops.map((c) => ({ ...c }));
}

export function defaultState() {
  return {
    layout: 'nine',
    grade: 'sunset',
    lettering: 'halftone',
    title: 'NEON SHORE',
    subtitle: 'golden hour · fast cars',
    size: 'square',
    frame: true,
    grain: true,
    vignette: true,
    badge: true,
    heat: 4,
    selectedPanel: 0,
    panels: defaultPanels(),
  };
}

// Draw one photo into a panel rect, cover-fit, with the panel's crop.
function drawPanelPhoto(ctx, img, rect, crop, grade) {
  const zoom = crop.zoom || 1;
  const s = Math.max(rect.w / img.naturalWidth, rect.h / img.naturalHeight) * zoom;
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  const dx = rect.x + (rect.w - dw) / 2 + (crop.x || 0) * rect.w * 0.45;
  const dy = rect.y + (rect.h - dh) / 2 + (crop.y || 0) * rect.h * 0.45;
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  if (grade.filter) ctx.filter = grade.filter;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.filter = 'none';
  // Sunset / neon colour grade: a two-stop overlay wash + a soft-light tint.
  const g = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
  g.addColorStop(0, grade.top);
  g.addColorStop(1, grade.bottom);
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = grade.overlay;
  ctx.fillStyle = g;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = grade.washAlpha;
  ctx.fillStyle = grade.wash;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
}

// A snapshot panel: white polaroid border, slight rotation, soft shadow.
function drawSnapshotPanel(ctx, img, rectPx, crop, grade, W) {
  const cx = rectPx.x + rectPx.w / 2;
  const cy = rectPx.y + rectPx.h / 2;
  const tilt = ((rectPx.tilt || 0) * Math.PI) / 180;
  const border = Math.max(4, W * 0.008);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = W * 0.02;
  ctx.shadowOffsetY = W * 0.008;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-rectPx.w / 2 - border, -rectPx.h / 2 - border, rectPx.w + border * 2, rectPx.h + border * 2);
  ctx.shadowColor = 'transparent';
  ctx.restore();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  drawPanelPhoto(ctx, img, { x: -rectPx.w / 2, y: -rectPx.h / 2, w: rectPx.w, h: rectPx.h }, crop, grade);
  ctx.restore();
}

function halftonePattern(accent) {
  const c = document.createElement('canvas');
  c.width = 14;
  c.height = 14;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 14, 14);
  g.fillStyle = accent;
  g.beginPath();
  g.arc(3.5, 3.5, 2.2, 0, Math.PI * 2);
  g.arc(10.5, 10.5, 2.2, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = 'rgba(0,0,0,0.25)';
  g.beginPath();
  g.arc(10.5, 3.5, 1.1, 0, Math.PI * 2);
  g.arc(3.5, 10.5, 1.1, 0, Math.PI * 2);
  g.fill();
  return c;
}

let grainTile = null;
function grainPattern() {
  if (grainTile) return grainTile;
  const c = document.createElement('canvas');
  c.width = 160;
  c.height = 160;
  const g = c.getContext('2d');
  const data = g.createImageData(160, 160);
  for (let i = 0; i < data.data.length; i += 4) {
    const v = 110 + Math.floor(Math.random() * 90);
    data.data[i] = v;
    data.data[i + 1] = v;
    data.data[i + 2] = v;
    data.data[i + 3] = 255;
  }
  g.putImageData(data, 0, 0);
  grainTile = c;
  return grainTile;
}

function wrapTitle(ctx, text, maxWidth) {
  const words = text.toUpperCase().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width <= maxWidth || !line) line = test;
    else {
      lines.push(line);
      line = word;
    }
    if (lines.length === 2) break;
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function drawStars(ctx, x, y, size, filled, total) {
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < total; i++) {
    const cx = i * size * 1.5;
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const r = k % 2 === 0 ? size : size * 0.45;
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      const px = cx + Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = i < filled ? '#ffd23e' : 'rgba(255,255,255,0.35)';
    ctx.fill();
  }
  ctx.restore();
}

// Draw the title block: scrim, title in the chosen lettering, script subtitle,
// heat stars and (optionally) the badge pill.
function drawTitleBlock(ctx, W, H, state, grade) {
  const layout = layoutById(state.layout);
  const tz = layout.title;
  const tx = tz.x * W;
  const ty = tz.y * H;
  const tw = tz.w * W;
  const th = tz.h * H;
  const align = tz.align || 'left';
  const pad = W * 0.02;

  // Legibility scrim under the title zone.
  const scrim = ctx.createLinearGradient(0, ty - th * 0.25, 0, ty + th);
  scrim.addColorStop(0, 'rgba(0,0,0,0)');
  scrim.addColorStop(0.45, 'rgba(0,0,0,0.45)');
  scrim.addColorStop(1, 'rgba(0,0,0,0.72)');
  ctx.fillStyle = scrim;
  ctx.fillRect(0, ty - th * 0.25, W, th * 1.25);

  const titleText = (state.title || 'NEON SHORE').toUpperCase();
  const subText = state.subtitle || '';
  const maxTitleW = tw - pad * 2;
  const starSize = Math.max(7, W * 0.009);
  let fontSize = Math.min(th * 0.52, W * 0.115);
  // Lay the block out bottom-up inside the title zone so the subtitle and
  // the heat stars never run off the bottom edge of the cover.
  const layoutBlock = (size) => {
    ctx.font = `${size}px Anton, 'Arial Narrow', sans-serif`;
    const ls = wrapTitle(ctx, titleText, maxTitleW);
    const lh = size * 0.98;
    const subGap = subText ? size * 0.42 : size * 0.2;
    const starGap = size * 0.3;
    const total = (ls.length - 1) * lh + subGap + starGap + starSize * 2 + size * 0.12;
    return { lines: ls, lineH: lh, subGap, starGap, total };
  };
  let block = layoutBlock(fontSize);
  while (block.total > th * 0.98 && fontSize > W * 0.03) {
    fontSize *= 0.92;
    block = layoutBlock(fontSize);
  }
  const lines = block.lines;
  const lineH = block.lineH;
  const starsBottom = ty + th - fontSize * 0.12;
  const starCentreY = starsBottom - starSize;
  const subY = starCentreY - starSize - fontSize * 0.1;
  const lastBaseline = subY - block.subGap;
  const by = lastBaseline - (lines.length - 1) * lineH;
  const baseX = align === 'center' ? tx + tw / 2 : tx + pad;
  ctx.textAlign = align === 'center' ? 'center' : 'left';
  ctx.textBaseline = 'alphabetic';

  const lettering = letteringById(state.lettering);
  lines.forEach((lineText, i) => {
    const y = by + i * lineH;
    ctx.save();
    if (lettering.id === 'bold') {
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = fontSize * 0.16;
      ctx.strokeText(lineText, baseX, y);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(lineText, baseX, y);
    } else if (lettering.id === 'halftone') {
      // Halftone-dot fill inside the letterforms, white outline outside.
      const off = document.createElement('canvas');
      off.width = Math.ceil(maxTitleW + fontSize);
      off.height = Math.ceil(fontSize * 1.4);
      const og = off.getContext('2d');
      og.font = `${fontSize}px Anton, 'Arial Narrow', sans-serif`;
      og.textAlign = ctx.textAlign;
      og.textBaseline = 'alphabetic';
      const ox = align === 'center' ? off.width / 2 : pad;
      og.fillStyle = '#ffffff';
      og.fillText(lineText, ox, fontSize * 1.05);
      og.globalCompositeOperation = 'source-in';
      const pat = og.createPattern(halftonePattern(grade.accent), 'repeat');
      og.fillStyle = pat;
      og.fillRect(0, 0, off.width, off.height);
      ctx.drawImage(off, align === 'center' ? baseX - off.width / 2 : baseX - pad, y - fontSize * 1.05);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = fontSize * 0.05;
      ctx.strokeText(lineText, baseX, y);
    } else if (lettering.id === 'neon') {
      ctx.shadowColor = '#ff2ea6';
      ctx.shadowBlur = fontSize * 0.28;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#ff2ea6';
      ctx.lineWidth = fontSize * 0.06;
      ctx.strokeText(lineText, baseX, y);
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = fontSize * 0.14;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(lineText, baseX, y);
      ctx.shadowBlur = 0;
    } else {
      // outline
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = fontSize * 0.13;
      ctx.strokeText(lineText, baseX, y);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = fontSize * 0.045;
      ctx.strokeText(lineText, baseX, y);
    }
    ctx.restore();
  });

  // Script subtitle in Pacifico, then the heat-meter stars (positions were
  // laid out bottom-up above, so they always sit inside the cover).
  if (subText) {
    ctx.save();
    ctx.font = `${Math.max(14, fontSize * 0.34)}px Pacifico, cursive`;
    ctx.fillStyle = lettering.id === 'neon' ? '#7df9ff' : '#ffd9ec';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = fontSize * 0.06;
    ctx.fillText(subText, baseX, subY);
    ctx.restore();
  }
  drawStars(ctx, baseX, starCentreY, starSize, state.heat ?? 4, 5);
  ctx.textAlign = 'left';
}

// The full cover render. `photos` is an array of loaded HTMLImageElements
// (or null slots). Returns the canvas it drew on.
export function renderCover(canvas, W, H, state, photos) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const layout = layoutById(state.layout);
  const grade = gradeById(state.grade);
  const gap = Math.max(2, Math.round(W * 0.006));

  ctx.fillStyle = '#0b0b12';
  ctx.fillRect(0, 0, W, H);

  layout.rects.forEach((r, i) => {
    const crop = state.panels[i] || { photo: 0, zoom: 1, x: 0, y: 0 };
    const img = photos[crop.photo];
    if (!img) return;
    const rectPx = { x: r.x * W, y: r.y * H, w: r.w * W, h: r.h * H, tilt: r.tilt };
    if (r.backdrop) {
      // Darkened backdrop behind the tilted snapshots.
      ctx.save();
      ctx.globalAlpha = 0.55;
      drawPanelPhoto(ctx, img, { x: 0, y: 0, w: W, h: H }, { ...crop, zoom: (crop.zoom || 1) * 1.25 }, grade);
      ctx.restore();
      ctx.fillStyle = 'rgba(5,5,16,0.45)';
      ctx.fillRect(0, 0, W, H);
      return;
    }
    if (r.tilt) {
      drawSnapshotPanel(ctx, img, rectPx, crop, grade, W);
      return;
    }
    const inset = {
      x: rectPx.x + gap / 2,
      y: rectPx.y + gap / 2,
      w: rectPx.w - gap,
      h: rectPx.h - gap,
    };
    drawPanelPhoto(ctx, img, inset, crop, grade);
  });

  drawTitleBlock(ctx, W, H, state, grade);

  // Badge pill, top right.
  if (state.badge) {
    const pillH = Math.max(22, H * 0.032);
    const pillText = 'COVER Nº 01 · SUNSET SERIES';
    ctx.save();
    ctx.font = `bold ${Math.round(pillH * 0.42)}px Arial, sans-serif`;
    const pillW = ctx.measureText(pillText).width + pillH * 1.1;
    const px = W - pillW - W * 0.02;
    const py = H * 0.02;
    ctx.fillStyle = 'rgba(8,8,14,0.78)';
    ctx.beginPath();
    ctx.roundRect(px, py, pillW, pillH, pillH / 2);
    ctx.fill();
    ctx.strokeStyle = grade.accent;
    ctx.lineWidth = Math.max(1.5, W * 0.0015);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(pillText, px + pillH * 0.55, py + pillH / 2 + 1);
    ctx.restore();
  }

  // White poster frame.
  if (state.frame) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(3, W * 0.012);
    ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, W - ctx.lineWidth, H - ctx.lineWidth);
    ctx.restore();
  }

  // Grain + vignette finish.
  if (state.grain) {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = ctx.createPattern(grainPattern(), 'repeat');
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  if (state.vignette) {
    const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.34)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }
  return canvas;
}

// Render one size to a fresh canvas (used by export and by the shot scenes).
export function renderCoverToCanvas(W, H, state, photos) {
  return renderCover(document.createElement('canvas'), W, H, state, photos);
}

export function exportCoverPNG(sizeId, state, photos) {
  const size = SIZES[sizeId] || SIZES.square;
  const canvas = renderCoverToCanvas(size.w, size.h, state, photos);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error('PNG encode failed'));
      else resolve({ size: sizeId, w: size.w, h: size.h, blob, bytes: blob.size });
    }, 'image/png');
  });
}

export async function exportAllSizes(state, photos) {
  const out = [];
  for (const id of SIZE_ORDER) out.push(await exportCoverPNG(id, state, photos));
  return out;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function slugifyTitle(title) {
  return (title || 'cover').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'cover';
}
