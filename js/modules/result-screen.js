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
  const accent = isLoss ? '#a9b9d3' : '#6feeff';
  const accentSoft = isLoss ? '#7f8da8' : '#00eeff';
  const accentHot = isLoss ? '#d7e2f5' : '#8ff4ff';
  const titleText = isLoss ? 'DEFEAT' : 'VICTORY';

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#090b12');
  bg.addColorStop(0.55, '#0a1018');
  bg.addColorStop(1, '#05070d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const flare = ctx.createRadialGradient(width * 0.72, 160, 20, width * 0.72, 160, 520);
  flare.addColorStop(0, isLoss ? 'rgba(190, 207, 230, 0.18)' : 'rgba(0, 238, 255, 0.22)');
  flare.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = flare;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    const y = 120 + i * 96;
    ctx.beginPath();
    ctx.moveTo(70, y);
    ctx.lineTo(width - 70, y);
    ctx.stroke();
  }

  const cardX = 86;
  const cardY = 84;
  const cardW = width - 172;
  const cardH = height - 168;
  const cardGradient = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
  cardGradient.addColorStop(0, 'rgba(15, 20, 32, 0.94)');
  cardGradient.addColorStop(1, 'rgba(8, 12, 20, 0.97)');
  ctx.fillStyle = cardGradient;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = isLoss ? 'rgba(166, 182, 204, 0.3)' : 'rgba(0, 238, 255, 0.28)';
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  ctx.strokeStyle = isLoss ? 'rgba(214, 225, 242, 0.18)' : 'rgba(111, 238, 255, 0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(cardX + 16, cardY + 16, cardW - 32, cardH - 32);

  ctx.fillStyle = '#eef6ff';
  ctx.font = '48px "Bebas Neue", sans-serif';
  ctx.fillText('VANISH', cardX + 44, cardY + 66);

  ctx.fillStyle = accent;
  ctx.font = '30px "Space Mono", monospace';
  ctx.fillText(dateLabel, cardX + cardW - 210, cardY + 62);

  ctx.fillStyle = accentHot;
  ctx.shadowColor = isLoss ? 'rgba(215, 226, 245, 0.22)' : 'rgba(0, 238, 255, 0.28)';
  ctx.shadowBlur = 22;
  ctx.font = '110px "Bebas Neue", sans-serif';
  ctx.fillText(titleText, cardX + 40, cardY + 208);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = '68px "Bebas Neue", sans-serif';
  ctx.fillText(playerText || 'VANISH', cardX + 40, cardY + 292);

  ctx.fillStyle = '#8ca0bf';
  ctx.font = '28px "Space Mono", monospace';
  ctx.fillText((flavorText || '').toUpperCase(), cardX + 42, cardY + 336);

  const summaryX = cardX + 40;
  const summaryY = cardY + 392;
  const summaryW = cardW - 80;
  const summaryH = 90 + rows.length * 82;
  const summaryGradient = ctx.createLinearGradient(summaryX, summaryY, summaryX, summaryY + summaryH);
  summaryGradient.addColorStop(0, 'rgba(18, 25, 39, 0.96)');
  summaryGradient.addColorStop(1, 'rgba(10, 14, 24, 0.98)');
  ctx.fillStyle = summaryGradient;
  ctx.fillRect(summaryX, summaryY, summaryW, summaryH);
  ctx.strokeStyle = isLoss ? 'rgba(142, 158, 182, 0.24)' : 'rgba(0, 238, 255, 0.18)';
  ctx.strokeRect(summaryX, summaryY, summaryW, summaryH);

  rows.forEach((row, index) => {
    const y = summaryY + 78 + index * 82;
    if (index > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath();
      ctx.moveTo(summaryX + 24, y - 42);
      ctx.lineTo(summaryX + summaryW - 24, y - 42);
      ctx.stroke();
    }
    ctx.fillStyle = '#73819b';
    ctx.font = '25px "Space Mono", monospace';
    ctx.fillText(row.label, summaryX + 28, y);
    ctx.fillStyle = '#edf5ff';
    ctx.font = '44px "Bebas Neue", sans-serif';
    const value = String(row.value || '');
    const measured = ctx.measureText(value).width;
    ctx.fillText(value, summaryX + summaryW - 28 - measured, y + 4);
  });

  ctx.strokeStyle = accentSoft;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cardX + 40, cardY + cardH - 182);
  ctx.lineTo(cardX + cardW - 40, cardY + cardH - 182);
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.font = '26px "Space Mono", monospace';
  ctx.fillText('NEON TACTICAL RECORD', cardX + 40, cardY + cardH - 130);
  ctx.fillStyle = '#71819b';
  ctx.fillText('xo.walterpng.github.io/vanish', cardX + 40, cardY + cardH - 84);

  const link = documentRef.createElement('a');
  link.download = `vanish-${filenameBase}-${dateLabel}.png`;
  link.href = canvas.toDataURL('image/png');
  documentRef.body.appendChild(link);
  link.click();
  link.remove();
}
