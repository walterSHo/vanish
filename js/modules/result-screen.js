export function buildExportSummaryRows({
  labels,
  playerText,
  titleText,
  modeText,
  timeText,
  showDifficulty,
  difficultyText,
  dateLabel,
}) {
  const rows = [
    { label: labels.player, value: playerText || '' },
  ];

  if (titleText) {
    rows.push({ label: labels.title, value: titleText });
  }

  rows.push(
    { label: labels.mode, value: modeText || '' },
    { label: labels.time, value: timeText || '--:--' },
  );

  if (showDifficulty) {
    rows.push({ label: labels.difficulty, value: difficultyText || '' });
  }

  rows.push({ label: labels.date, value: dateLabel || '' });
  return rows;
}

export function applyResultSummary({
  elements,
  values,
}) {
  const {
    stateEl,
    playerEl,
    titleRow,
    titleEl,
    modeEl,
    difficultyRow,
    difficultyEl,
  } = elements;

  const {
    hasSummary,
    stateText,
    playerText,
    titleText,
    modeText,
    showDifficulty,
    difficultyText,
  } = values;

  stateEl.textContent = hasSummary ? stateText : '';
  playerEl.textContent = hasSummary ? playerText : '';
  titleRow.style.display = hasSummary && titleText ? '' : 'none';
  titleEl.textContent = hasSummary ? titleText : '';
  modeEl.textContent = hasSummary ? modeText : '';
  difficultyRow.style.display = showDifficulty ? '' : 'none';
  difficultyEl.textContent = showDifficulty ? difficultyText : '';
}

export function downloadResultCard({
  documentRef = document,
  devicePixelRatio = window.devicePixelRatio || 1,
  resultState,
  resultTitle,
  playerText,
  flavorText,
  rows,
  dateLabel,
  filenameBase = 'vanish',
}) {
  const canvas = documentRef.createElement('canvas');
  const scale = Math.max(2, Math.min(3, devicePixelRatio || 1));
  const width = 1080;
  const height = 1350;
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(scale, scale);

  const isLoss = resultState === 'loss';
  const accent = isLoss ? '#cfd8e9' : '#7ef7ff';
  const accentStrong = isLoss ? '#e6eefc' : '#9ffaff';
  const accentSoft = isLoss ? '#94a4be' : '#24dfff';
  const accentDim = isLoss ? '#5e6d84' : '#0f7083';
  const titleText = resultTitle || (isLoss ? 'DEFEAT' : 'VICTORY');
  const safeRows = Array.isArray(rows) ? rows : [];
  const playerName = playerText || 'VANISH';
  const flavor = flavorText || '';
  const titleRow = safeRows.find(row => /title/i.test(String(row.label)));
  const detailRows = safeRows.filter(row => row !== titleRow);

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#05070c');
  bg.addColorStop(0.45, '#09111a');
  bg.addColorStop(1, '#04050a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const starGlow = ctx.createRadialGradient(width * 0.78, 180, 20, width * 0.78, 180, 540);
  starGlow.addColorStop(0, isLoss ? 'rgba(205, 219, 242, 0.16)' : 'rgba(0, 238, 255, 0.2)');
  starGlow.addColorStop(0.48, isLoss ? 'rgba(120, 142, 170, 0.1)' : 'rgba(0, 130, 160, 0.08)');
  starGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = starGlow;
  ctx.fillRect(0, 0, width, height);

  const sideGlow = ctx.createRadialGradient(120, height - 160, 10, 120, height - 160, 520);
  sideGlow.addColorStop(0, isLoss ? 'rgba(116, 130, 154, 0.12)' : 'rgba(0, 238, 255, 0.14)');
  sideGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sideGlow;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.035)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 14; i++) {
    const y = 96 + i * 90;
    ctx.beginPath();
    ctx.moveTo(56, y);
    ctx.lineTo(width - 56, y);
    ctx.stroke();
  }
  for (let i = 0; i < 6; i++) {
    const x = 74 + i * 186;
    ctx.beginPath();
    ctx.moveTo(x, 56);
    ctx.lineTo(x, height - 56);
    ctx.stroke();
  }

  const cardX = 72;
  const cardY = 72;
  const cardW = width - 144;
  const cardH = height - 144;
  const outerGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  outerGradient.addColorStop(0, 'rgba(10, 14, 24, 0.96)');
  outerGradient.addColorStop(0.55, 'rgba(8, 14, 22, 0.98)');
  outerGradient.addColorStop(1, 'rgba(7, 10, 18, 0.99)');
  ctx.fillStyle = outerGradient;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  ctx.strokeStyle = isLoss ? 'rgba(182, 197, 220, 0.3)' : 'rgba(79, 232, 255, 0.28)';
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(cardX + 18, cardY + 18, cardW - 36, cardH - 36);

  const topBandY = cardY + 42;
  ctx.strokeStyle = accentSoft;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX + 34, topBandY);
  ctx.lineTo(cardX + 180, topBandY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cardX + cardW - 180, topBandY);
  ctx.lineTo(cardX + cardW - 34, topBandY);
  ctx.stroke();

  ctx.fillStyle = '#f4f8ff';
  ctx.font = '42px "Bebas Neue", sans-serif';
  ctx.fillText('VANISH', cardX + 36, cardY + 64);

  ctx.fillStyle = accent;
  ctx.font = '24px "Space Mono", monospace';
  const dateWidth = ctx.measureText(dateLabel || '').width;
  ctx.fillText(dateLabel || '', cardX + cardW - 38 - dateWidth, cardY + 60);

  ctx.fillStyle = accentSoft;
  ctx.font = '18px "Space Mono", monospace';
  ctx.fillText('TACTICAL RESULT // SHARE CARD', cardX + 36, cardY + 96);

  const titlePanelX = cardX + 34;
  const titlePanelY = cardY + 130;
  const titlePanelW = cardW - 68;
  const titlePanelH = 290;
  const titlePanelGradient = ctx.createLinearGradient(titlePanelX, titlePanelY, titlePanelX, titlePanelY + titlePanelH);
  titlePanelGradient.addColorStop(0, isLoss ? 'rgba(24, 31, 45, 0.92)' : 'rgba(10, 26, 36, 0.92)');
  titlePanelGradient.addColorStop(1, 'rgba(10, 15, 25, 0.86)');
  ctx.fillStyle = titlePanelGradient;
  ctx.fillRect(titlePanelX, titlePanelY, titlePanelW, titlePanelH);
  ctx.strokeStyle = isLoss ? 'rgba(177, 191, 214, 0.18)' : 'rgba(73, 223, 247, 0.2)';
  ctx.strokeRect(titlePanelX, titlePanelY, titlePanelW, titlePanelH);

  const panelGlow = ctx.createRadialGradient(titlePanelX + titlePanelW * 0.78, titlePanelY + 90, 16, titlePanelX + titlePanelW * 0.78, titlePanelY + 90, 240);
  panelGlow.addColorStop(0, isLoss ? 'rgba(201, 214, 236, 0.16)' : 'rgba(0, 238, 255, 0.18)');
  panelGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = panelGlow;
  ctx.fillRect(titlePanelX, titlePanelY, titlePanelW, titlePanelH);

  ctx.fillStyle = accentSoft;
  ctx.font = '22px "Space Mono", monospace';
  ctx.fillText('FINAL OUTCOME', titlePanelX + 30, titlePanelY + 42);

  ctx.strokeStyle = accentDim;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(titlePanelX + 30, titlePanelY + 58);
  ctx.lineTo(titlePanelX + 210, titlePanelY + 58);
  ctx.stroke();

  ctx.fillStyle = accentStrong;
  ctx.shadowColor = isLoss ? 'rgba(230, 238, 252, 0.25)' : 'rgba(126, 247, 255, 0.28)';
  ctx.shadowBlur = 24;
  ctx.font = '124px "Bebas Neue", sans-serif';
  ctx.fillText(titleText, titlePanelX + 26, titlePanelY + 170);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = '78px "Bebas Neue", sans-serif';
  ctx.fillText(playerName, titlePanelX + 28, titlePanelY + 246);

  if (titleRow && titleRow.value) {
    const chipX = titlePanelX + 30;
    const chipY = titlePanelY + 258;
    const chipW = Math.min(titlePanelW - 60, Math.max(260, ctx.measureText(String(titleRow.value)).width + 56));
    const chipH = 42;
    ctx.fillStyle = isLoss ? 'rgba(26, 33, 46, 0.94)' : 'rgba(7, 28, 34, 0.94)';
    ctx.fillRect(chipX, chipY, chipW, chipH);
    ctx.strokeStyle = isLoss ? 'rgba(178, 192, 214, 0.18)' : 'rgba(75, 219, 244, 0.2)';
    ctx.strokeRect(chipX, chipY, chipW, chipH);
    ctx.fillStyle = accent;
    ctx.font = '20px "Space Mono", monospace';
    ctx.fillText(String(titleRow.label || '').toUpperCase(), chipX + 14, chipY + 27);
    ctx.fillStyle = '#eff6ff';
    ctx.font = '30px "Bebas Neue", sans-serif';
    ctx.fillText(String(titleRow.value), chipX + 116, chipY + 30);
  }

  ctx.fillStyle = '#8d9bb3';
  ctx.font = '26px "Space Mono", monospace';
  ctx.fillText(flavor.toUpperCase(), titlePanelX + 30, titlePanelY + titlePanelH - 18);

  const summaryX = cardX + 34;
  const summaryY = titlePanelY + titlePanelH + 34;
  const summaryW = cardW - 68;
  const summaryH = 68 + detailRows.length * 72;
  const summaryGradient = ctx.createLinearGradient(summaryX, summaryY, summaryX + summaryW, summaryY + summaryH);
  summaryGradient.addColorStop(0, 'rgba(13, 18, 29, 0.98)');
  summaryGradient.addColorStop(1, 'rgba(8, 11, 18, 0.98)');
  ctx.fillStyle = summaryGradient;
  ctx.fillRect(summaryX, summaryY, summaryW, summaryH);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.strokeRect(summaryX, summaryY, summaryW, summaryH);

  ctx.fillStyle = accentSoft;
  ctx.font = '20px "Space Mono", monospace';
  ctx.fillText('MATCH PROFILE', summaryX + 28, summaryY + 34);

  detailRows.forEach((row, index) => {
    const y = summaryY + 82 + index * 72;
    if (index > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath();
      ctx.moveTo(summaryX + 22, y - 40);
      ctx.lineTo(summaryX + summaryW - 22, y - 40);
      ctx.stroke();
    }

    ctx.fillStyle = '#74839b';
    ctx.font = '22px "Space Mono", monospace';
    ctx.fillText(String(row.label || '').toUpperCase(), summaryX + 28, y);

    ctx.fillStyle = '#eef6ff';
    ctx.font = '38px "Bebas Neue", sans-serif';
    const value = String(row.value || '');
    const measured = ctx.measureText(value).width;
    ctx.fillText(value, summaryX + summaryW - 28 - measured, y + 2);
  });

  const footerY = cardY + cardH - 94;
  ctx.strokeStyle = accentSoft;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX + 34, footerY);
  ctx.lineTo(cardX + cardW - 34, footerY);
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.font = '22px "Space Mono", monospace';
  ctx.fillText('NEON TACTICAL RECORD', cardX + 36, footerY + 36);
  ctx.fillStyle = '#708199';
  ctx.fillText('xo.walterpng.github.io/vanish', cardX + 36, footerY + 66);

  ctx.strokeStyle = isLoss ? 'rgba(170, 184, 208, 0.14)' : 'rgba(63, 220, 248, 0.16)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + cardW - 250, footerY + 34);
  ctx.lineTo(cardX + cardW - 36, footerY + 34);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cardX + cardW - 210, footerY + 64);
  ctx.lineTo(cardX + cardW - 36, footerY + 64);
  ctx.stroke();

  const link = documentRef.createElement('a');
  link.download = `vanish-${filenameBase}-${dateLabel}.png`;
  link.href = canvas.toDataURL('image/png');
  documentRef.body.appendChild(link);
  link.click();
  link.remove();
}
