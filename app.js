const STORAGE_KEY = "pixel-tools-hub-order-v1";
const LONG_PRESS_MS = 420;

const phone = document.querySelector("#phone");
const appGrid = document.querySelector("#apps");
const modeHint = document.querySelector("#mode-hint");
const toggleEditBtn = document.querySelector("#toggle-edit");
const resetLayoutBtn = document.querySelector("#reset-layout");

const baseApps = Array.isArray(window.PIXEL_APPS) ? window.PIXEL_APPS : [];
let apps = loadOrderedApps(baseApps);
let editMode = false;
let longPressTimer = null;
let suppressNextTap = false;
let dragSourceId = null;

function loadOrderedApps(sourceApps) {
  let savedOrder = [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    savedOrder = raw ? JSON.parse(raw) : [];
  } catch (_error) {
    savedOrder = [];
  }

  const byId = new Map(sourceApps.map((item) => [item.id, item]));
  const ordered = [];

  for (const id of savedOrder) {
    if (byId.has(id)) {
      ordered.push(byId.get(id));
      byId.delete(id);
    }
  }

  for (const item of byId.values()) {
    ordered.push(item);
  }

  return ordered;
}

function saveOrder() {
  const ids = apps.map((item) => item.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function clearLongPress() {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
}

function updateEditUI() {
  phone.classList.toggle("editing", editMode);
  toggleEditBtn.textContent = editMode ? "DONE" : "EDIT";
  modeHint.textContent = editMode
    ? "Edit mode: drag cards or use UP / DOWN"
    : "Hold an app to enter edit mode";
}

function reorderByStep(id, step) {
  const index = apps.findIndex((item) => item.id === id);
  const target = index + step;

  if (index < 0 || target < 0 || target >= apps.length) {
    return;
  }

  const next = apps.slice();
  const [moved] = next.splice(index, 1);
  next.splice(target, 0, moved);
  apps = next;

  saveOrder();
  renderApps();
}

function reorderByDrop(fromId, toId) {
  if (!fromId || !toId || fromId === toId) {
    return;
  }

  const fromIndex = apps.findIndex((item) => item.id === fromId);
  const toIndex = apps.findIndex((item) => item.id === toId);

  if (fromIndex < 0 || toIndex < 0) {
    return;
  }

  const next = apps.slice();
  const [moved] = next.splice(fromIndex, 1);
  const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
  next.splice(insertIndex, 0, moved);

  apps = next;
  saveOrder();
  renderApps();
}

function setEditMode(nextMode) {
  editMode = nextMode;
  updateEditUI();
  renderApps();
}

function buildIcon(item) {
  const icon = document.createElement("span");
  icon.className = "icon";

  if (item.iconSrc) {
    const image = document.createElement("img");
    image.src = item.iconSrc;
    image.alt = "";
    image.loading = "lazy";
    icon.append(image);
  } else {
    icon.textContent = item.fallback || "AP";
  }

  return icon;
}

function buildBadge(item) {
  if (!item.badge) {
    return null;
  }

  const badge = document.createElement("span");
  badge.className = `app-badge ${item.badge}`;
  badge.setAttribute("aria-hidden", "true");

  if (item.badge === "question") {
    badge.textContent = "?";
  }

  if (item.intro) {
    badge.classList.add("has-tip");
    badge.setAttribute("aria-hidden", "false");
    badge.setAttribute("role", "button");
    badge.setAttribute("tabindex", "0");
    badge.setAttribute("aria-label", `${item.name} intro`);

    const tip = document.createElement("span");
    tip.className = "badge-tip";
    tip.textContent = item.intro;
    badge.append(tip);

    const toggleTip = () => {
      const shouldShow = !badge.classList.contains("show-tip");
      closeBadgeTips();
      if (shouldShow) {
        badge.classList.add("show-tip");
      }
    };

    badge.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleTip();
    });

    badge.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleTip();
      }

      if (event.key === "Escape") {
        badge.classList.remove("show-tip");
      }
    });
  }

  return badge;
}

function closeBadgeTips() {
  for (const node of appGrid.querySelectorAll(".app-badge.has-tip.show-tip")) {
    node.classList.remove("show-tip");
  }
}

function buildCard(item, index) {
  const card = document.createElement("article");
  card.className = "app";
  card.dataset.id = item.id;
  card.draggable = editMode;

  const launch = document.createElement("button");
  launch.type = "button";
  launch.className = "app-launch";
  launch.setAttribute("aria-label", item.name);

  const meta = document.createElement("span");
  meta.className = "meta";
  meta.innerHTML = `<h2>${item.name}</h2><p>${item.note}</p>`;

  launch.append(buildIcon(item), meta);

  const badge = buildBadge(item);
  if (badge) {
    card.append(badge);
  }

  launch.addEventListener("pointerdown", (event) => {
    if (editMode) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    clearLongPress();
    longPressTimer = setTimeout(() => {
      suppressNextTap = true;
      setEditMode(true);
    }, LONG_PRESS_MS);
  });

  launch.addEventListener("pointerup", clearLongPress);
  launch.addEventListener("pointercancel", clearLongPress);
  launch.addEventListener("pointerleave", clearLongPress);

  launch.addEventListener("click", () => {
    if (suppressNextTap) {
      suppressNextTap = false;
      return;
    }

    if (editMode) {
      return;
    }

    window.location.href = item.href;
  });

  card.addEventListener("dragstart", (event) => {
    if (!editMode) {
      event.preventDefault();
      return;
    }

    dragSourceId = item.id;
    card.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.id);
  });

  card.addEventListener("dragover", (event) => {
    if (!editMode || !dragSourceId || dragSourceId === item.id) {
      return;
    }

    event.preventDefault();
    card.classList.add("drag-target");
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("drag-target");
  });

  card.addEventListener("drop", (event) => {
    if (!editMode) {
      return;
    }

    event.preventDefault();
    card.classList.remove("drag-target");

    const payload = event.dataTransfer.getData("text/plain");
    const sourceId = payload || dragSourceId;
    dragSourceId = null;

    reorderByDrop(sourceId, item.id);
  });

  card.addEventListener("dragend", () => {
    dragSourceId = null;
    card.classList.remove("dragging");

    for (const node of appGrid.querySelectorAll(".app")) {
      node.classList.remove("drag-target");
      node.classList.remove("dragging");
    }
  });

  const controls = document.createElement("div");
  controls.className = "reorder-controls";

  const up = document.createElement("button");
  up.type = "button";
  up.className = "move-btn";
  up.textContent = "UP";
  up.disabled = index === 0;
  up.addEventListener("click", () => reorderByStep(item.id, -1));

  const down = document.createElement("button");
  down.type = "button";
  down.className = "move-btn";
  down.textContent = "DOWN";
  down.disabled = index === apps.length - 1;
  down.addEventListener("click", () => reorderByStep(item.id, 1));

  controls.append(up, down);
  card.append(launch, controls);

  return card;
}

function renderApps() {
  appGrid.innerHTML = "";

  apps.forEach((item, index) => {
    appGrid.append(buildCard(item, index));
  });
}

function resetLayout() {
  apps = [...baseApps];
  localStorage.removeItem(STORAGE_KEY);
  setEditMode(false);
}

function syncClock() {
  const node = document.querySelector("#clock");
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  node.textContent = `${hh}:${mm}`;
}

toggleEditBtn.addEventListener("click", () => {
  setEditMode(!editMode);
});

resetLayoutBtn.addEventListener("click", resetLayout);
document.addEventListener("click", (event) => {
  if (!event.target.closest(".app-badge.has-tip")) {
    closeBadgeTips();
  }
});

updateEditUI();
renderApps();
syncClock();
setInterval(syncClock, 30_000);
