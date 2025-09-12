/** ===== KONFIG BERSAMA ===== */
const API_URL   = "https://script.google.com/macros/s/AKfycbwVgPZ9TnMDG-5h3vUy8e8YG-n9cTT2U73PNdzOXjPLWQRVeoiljRWSGx3nheMDuV33Sw/exec"; // URL Web App GAS sudah di-set
const KEY_TOKEN = "prs_token";
const KEY_USER  = "prs_user";
const MANAGER_ROLES = ["manager","admin","owner","supervisor","lead"];

/** ===== UTIL ===== */
const $ = (s, r=document) => r.querySelector(s);
const isManager = (u) => MANAGER_ROLES.includes(String(u?.role||"").toLowerCase());

function api(fn, data){
  return fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams({ function: fn, data: JSON.stringify(data||{}) })
  }).then(r=>r.json());
}

function saveSession(token, user, remember){
  const store = remember ? localStorage : sessionStorage;
  store.setItem(KEY_TOKEN, token);
  store.setItem(KEY_USER, JSON.stringify(user||{}));
}
function clearSession(){
  localStorage.removeItem(KEY_TOKEN); localStorage.removeItem(KEY_USER);
  sessionStorage.removeItem(KEY_TOKEN); sessionStorage.removeItem(KEY_USER);
}
function readAnySession(){
  const t = localStorage.getItem(KEY_TOKEN) || sessionStorage.getItem(KEY_TOKEN) || "";
  const u = localStorage.getItem(KEY_USER)  || sessionStorage.getItem(KEY_USER)  || "{}";
  try { return { token:t, user: JSON.parse(u) }; } catch { return { token:t, user:{} }; }
}

/**
 * Guard halaman:
 * - mode: "manager" untuk index.html, "staff" untuk staff.html, atau "any"
 * - onReady: callback setelah lolos guard (opsional)
 */
async function requireAuth(mode="any", onReady){
  const { token } = readAnySession();
  if(!token){ location.href = "login.html"; return; }

  try{
    const res = await api("me", { token });
    if(!res.ok) throw new Error(res.error || "Auth gagal");
    const user = res.data?.user || res.data || {};
    saveSession(token, user, true);

    const manager = isManager(user);
    if (mode === "manager" && !manager){ location.href = "staff.html"; return; }
    if (mode === "staff"   &&  manager){ location.href = "index.html"; return; }

    if (typeof onReady === "function") onReady({ token, user });
  }catch(e){
    clearSession();
    location.href = "login.html";
  }
}

/** Logout helper */
async function doLogout(){
  const { token } = readAnySession();
  try{ await api("logout", { token }); }catch(_ ){}
  clearSession();
  location.href = "login.html";
}
