const home = window.PIXEL_HOME || {};
const apps = Array.isArray(home.apps) ? home.apps : [];
const sections = Array.isArray(home.sections) ? home.sections : [];

const titleNode = document.querySelector("#home-title");
const subtitleNode = document.querySelector("#home-subtitle");
const sectionsRoot = document.querySelector("#app-sections");

const appById = new Map(apps.map((item) => [item.id, item]));

function syncHeader() {
  if (home.header?.title) {
    titleNode.textContent = home.header.title;
  }

  if (home.header?.subtitle) {
    subtitleNode.textContent = home.header.subtitle;
  }
}

function createIcon(item, size = "default") {
  const icon = document.createElement("span");
  icon.className = `icon icon-${size}`;

  if (item.theme) {
    icon.classList.add(`theme-${item.theme}`);
  }

  if (item.iconFit === "cover") {
    icon.classList.add("icon-cover");
  }

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

function createTooltip(item) {
  const tooltip = document.createElement("span");
  tooltip.className = "card-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.textContent = item.longDesc || item.shortDesc;
  return tooltip;
}

function createAppCard(item, tone = "tools") {
  const card = document.createElement("article");
  card.className = `app-card app-card-${tone} theme-${item.theme || "sky"}`;

  const link = document.createElement("a");
  link.className = "app-link";
  link.href = item.href;
  link.setAttribute("aria-label", `${item.name}: ${item.shortDesc}`);

  const head = document.createElement("div");
  head.className = "app-head";
  head.append(createIcon(item));

  const meta = document.createElement("div");
  meta.className = "app-meta";

  const title = document.createElement("h3");
  title.textContent = item.name;

  const shortDesc = document.createElement("p");
  shortDesc.className = "app-short";
  shortDesc.textContent = item.shortDesc;

  const longDesc = document.createElement("p");
  longDesc.className = "app-long";
  longDesc.textContent = item.longDesc || item.shortDesc;

  meta.append(title, shortDesc);
  head.append(meta);
  link.append(head, longDesc, createTooltip(item));
  card.append(link);

  return card;
}

function renderSections() {
  sectionsRoot.innerHTML = "";

  for (const section of sections) {
    const tone = section.tone || "tools";
    const wrapper = document.createElement("section");
    wrapper.className = `app-section app-section-${tone}`;
    wrapper.setAttribute("aria-labelledby", `${section.id}-title`);

    const heading = document.createElement("div");
    heading.className = "section-heading";

    const title = document.createElement("h2");
    title.id = `${section.id}-title`;
    title.textContent = section.title;

    heading.append(title);

    const grid = document.createElement("div");
    grid.className = `app-grid app-grid-${tone}`;

    let count = 0;

    for (const id of section.items || []) {
      const item = appById.get(id);
      if (!item) {
        continue;
      }

      grid.append(createAppCard(item, tone));
      count += 1;
    }

    if (tone === "tools" || tone === "content") {
      const remainder = count % 3;
      if (remainder !== 0) {
        for (let i = remainder; i < 3; i += 1) {
          const spacer = document.createElement("div");
          spacer.className = "app-card app-card-spacer";
          spacer.setAttribute("aria-hidden", "true");
          grid.append(spacer);
        }
      }
    }

    wrapper.append(heading, grid);
    sectionsRoot.append(wrapper);
  }
}

syncHeader();
renderSections();
