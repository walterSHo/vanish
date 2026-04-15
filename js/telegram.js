// ─── TELEGRAM INTEGRATION (UI only, no security assumptions) ─────────────────
let tgUser = null;

function getTelegramUser() {
  try {
    const tg = window.Telegram && window.Telegram.WebApp;
    if (!tg) return null;
    if (tg.ready) tg.ready();
    const user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    if (!user) return null;
    return user;
  } catch (e) {
    return null;
  }
}
