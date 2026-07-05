const STORAGE_KEY = "stockCountData_v1";
const COUNT_DAYS = [5, 10, 15, 20, 25, 30];

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function defaultData() {
  return {
    shopName: "No.9 Hostel & Cafe",
    countDate: todayISO(),
    signDate: todayISO(),
    checkedBy: "",
    stock: [
      ["Muay Thai", "Sawassdee"], ["Muay Thai", "Dumhua"], ["Coronado", "Big Weekend"],
      ["Alitude Brewing", "Board Meeting Pine Apple"], ["Bach Brewing", "Supajuice"],
      ["Bach Brewing", "WC Bright Deaf Kettle"], ["Bach Brewing", "Bedford"],
      ["Bach Brewing", "Breaking bud"], ["Vocation", "Death by Margarita"], ["Vocation", "Life Death"],
      ["Heart of Darkness", "One eye Harlequin"], ["Heart of Darkness", "Imperial New England"],
      ["Heart of Darkness", "Tangled Gloom Hazy"], ["Heart of Darkness", "Black Shadow"],
      ["Heart of Darkness", "TropicalBia mango & Passionfruit"], ["Maisel's", "Original"],
      ["Chiangmai beer", "Blossom Weizen"], ["Chiangmai beer", "Red Truck Red Ale"],
      ["Brothers", "Raspberry & Blackberry"], ["Brothers", "Pear & Apple"],
      ["Brothers", "Raspberry & Lime"], ["Brothers", "Orange & Lemon"], ["Brothers", "Toffee Apple"],
      ["Duncan's", "Yum Yum yuzu"], ["Duncan's", "Carrot Cake"], ["Duncan's", "Raspberry"],
      ["Duncan's", "Research"], ["Duncan's", "Whippy IPA"], ["Suntree", "Cheeva"],
      ["Suntree", "Tidlom"], ["Suntree", "Thaipei"], ["Honey day", "Mead Original"],
      ["Vana Brewing", "Whale"], ["Vana Brewing", "Raven"], ["Vana Brewing", "Mango & Passion Fruit Wheat"],
      ["Vana Brewing", "Pomegranate Wheat"], ["Brewdog", "Barn Dance"], ["Liberty", "Halo"],
      ["", "Singha(L)"], ["", "Singha(S)"], ["", "Chang(L)"], ["", "Chang(S)"], ["", "Asahi(S)"],
    ].map(([brand, name]) => ({ brand, name, pos: "", remain: "" })),
    taps: [
      "Meechai", "Wila Weizen", "Crispy boy", "Loose Rivet", "Dream Alone",
      "Peanut Butter", "", "Sunfree", "Dream Poy",
    ].map((name) => ({ name, remain: "" })),
    spares: [{ name: "", remain: "" }, { name: "", remain: "" }],
    fried: ["Fries", "Chinken Nugget", "Chinken Pop", "Peanut", "Green Soybean"].map((name) => ({
      name, remain: "", order: false,
    })),
    shopping: ["", "", ""],
  };
}

let data = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return defaultData();
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function checkReminder() {
  const day = new Date().getDate();
  const banner = document.getElementById("reminderBanner");
  banner.classList.toggle("hidden", !COUNT_DAYS.includes(day));
}

function render() {
  document.getElementById("shopName").value = data.shopName;
  document.getElementById("countDate").value = data.countDate;
  document.getElementById("signDate").value = data.signDate;
  document.getElementById("checkedBy").value = data.checkedBy;

  renderStock();
  renderTaps();
  renderSpares();
  renderFried();
  renderShopping();
}

function renderStock() {
  const body = document.getElementById("stockBody");
  body.innerHTML = "";
  data.stock.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="col-no">${i + 1}</td>
      <td><input data-path="stock.${i}.brand" value="${esc(row.brand)}"></td>
      <td><input data-path="stock.${i}.name" value="${esc(row.name)}"></td>
      <td><input type="number" data-path="stock.${i}.pos" value="${esc(row.pos)}"></td>
      <td><input type="number" data-path="stock.${i}.remain" value="${esc(row.remain)}"></td>
      <td class="col-del no-export"><button class="btn-del" data-del="stock.${i}">✕</button></td>
    `;
    body.appendChild(tr);
  });
}

function renderTaps() {
  const body = document.getElementById("tapBody");
  body.innerHTML = "";
  data.taps.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="col-tap">Tap ${i + 1}</td>
      <td><input data-path="taps.${i}.name" value="${esc(row.name)}"></td>
      <td class="col-pct"><input data-path="taps.${i}.remain" value="${esc(row.remain)}" placeholder="%"></td>
      <td class="col-del no-export">${i >= 9 ? `<button class="btn-del" data-del="taps.${i}">✕</button>` : ""}</td>
    `;
    body.appendChild(tr);
  });
}

function renderSpares() {
  const body = document.getElementById("spareBody");
  body.innerHTML = "";
  data.spares.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input data-path="spares.${i}.name" value="${esc(row.name)}"></td>
      <td class="col-pct"><input data-path="spares.${i}.remain" value="${esc(row.remain)}" placeholder="%"></td>
      <td class="col-del no-export"><button class="btn-del" data-del="spares.${i}">✕</button></td>
    `;
    body.appendChild(tr);
  });
}

function renderFried() {
  const body = document.getElementById("friedBody");
  body.innerHTML = "";
  data.fried.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input data-path="fried.${i}.name" value="${esc(row.name)}"></td>
      <td class="col-pct"><input data-path="fried.${i}.remain" value="${esc(row.remain)}"></td>
      <td class="col-order"><input type="checkbox" data-path="fried.${i}.order" ${row.order ? "checked" : ""}></td>
      <td class="col-del no-export"><button class="btn-del" data-del="fried.${i}">✕</button></td>
    `;
    body.appendChild(tr);
  });
}

function renderShopping() {
  const list = document.getElementById("shoppingList");
  list.innerHTML = "";
  data.shopping.forEach((val, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="text" data-path="shopping.${i}" value="${esc(val)}">
      <button class="btn-del no-export" data-del="shopping.${i}">✕</button>
    `;
    list.appendChild(li);
  });
}

function esc(v) {
  if (v === undefined || v === null) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setPath(path, value) {
  const parts = path.split(".");
  let obj = data;
  for (let i = 0; i < parts.length - 1; i++) {
    obj = obj[parts[i]];
  }
  obj[parts[parts.length - 1]] = value;
}

function delPath(path) {
  const parts = path.split(".");
  const idx = Number(parts[1]);
  data[parts[0]].splice(idx, 1);
}

document.getElementById("formRoot").addEventListener("input", (e) => {
  const t = e.target;
  const path = t.dataset.path;
  if (!path) return;
  const value = t.type === "checkbox" ? t.checked : t.value;
  setPath(path, value);
  save();
});

document.getElementById("formRoot").addEventListener("click", (e) => {
  const del = e.target.dataset.del;
  if (del) {
    delPath(del);
    save();
    render();
  }
});

["shopName", "countDate", "signDate", "checkedBy"].forEach((id) => {
  document.getElementById(id).addEventListener("input", (e) => {
    data[id] = e.target.value;
    save();
  });
});

document.querySelectorAll("[data-add]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const kind = btn.dataset.add;
    if (kind === "stock") data.stock.push({ brand: "", name: "", pos: "", remain: "" });
    if (kind === "spare") data.spares.push({ name: "", remain: "" });
    if (kind === "fried") data.fried.push({ name: "", remain: "", order: false });
    if (kind === "shopping") data.shopping.push("");
    save();
    render();
  });
});

document.getElementById("btnResetCounts").addEventListener("click", () => {
  if (!confirm("ล้างจำนวนคงเหลือ/POS ทั้งหมด เพื่อเริ่มรอบนับใหม่? (ชื่อสินค้ายังอยู่)")) return;
  data.stock.forEach((r) => { r.pos = ""; r.remain = ""; });
  data.taps.forEach((r) => { r.remain = ""; });
  data.spares.forEach((r) => { r.remain = ""; });
  data.fried.forEach((r) => { r.remain = ""; r.order = false; });
  data.countDate = todayISO();
  data.signDate = todayISO();
  save();
  render();
});

document.getElementById("btnExport").addEventListener("click", async () => {
  const target = document.getElementById("formRoot");
  const canvas = await html2canvas(target, {
    scale: 2,
    backgroundColor: "#ffffff",
    ignoreElements: (el) => el.classList && el.classList.contains("no-export"),
  });
  const dateLabel = data.countDate || todayISO();
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-count-${dateLabel}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
});

checkReminder();
render();
