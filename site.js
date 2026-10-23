(function () {
  const works = window.PORTFOLIO_WORKS || [];
  const card = (work, index) =>
    '<a class="art-card reveal" data-id="' + work.id + '" data-year="' + work.year + '" data-category="' + work.category + '" href="work.html?id=' + work.id + '">' +
      '<div class="card-image"><img src="' + work.image + '" alt="' + work.title + '" loading="lazy"><span class="card-open">↗</span><span class="card-number">' + String(index + 1).padStart(2, "0") + '</span></div>' +
      '<div class="card-caption"><div><h3>' + work.title + '</h3><span>' + work.medium + ' · ' + work.size + '</span></div><time>' + work.year + '</time></div></a>';

  const featuredGrid = document.getElementById("featured-grid");
  if (featuredGrid) featuredGrid.innerHTML = works.filter((work) => work.featured).map(card).join("");

  const worksGrid = document.getElementById("works-grid");
  if (worksGrid) {
    const filters = Array.from(document.querySelectorAll("[data-year]"));
    const render = (year) => {
      const visible = works.filter((work) => year === "all" || String(work.year) === year);
      worksGrid.innerHTML = visible.map(card).join("");
      observeReveals();
    };
    filters.forEach((button) => button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      render(button.dataset.year);
    }));
    render("all");
  }

  const detail = document.getElementById("work-detail");
  if (detail && works.length) {
    const id = new URLSearchParams(location.search).get("id") || "zhiqijiao";
    const index = Math.max(0, works.findIndex((item) => item.id === id));
    const work = works[index] || works[0];
    document.title = work.title + " — 陈丹青";
    document.getElementById("detail-title").textContent = work.title;
    document.getElementById("detail-meta").textContent = work.year + " / " + work.medium + " / " + work.size;
    document.getElementById("detail-index").textContent = "作品详情 / " + String(index + 1).padStart(2, "0");
    document.getElementById("detail-description").textContent = work.description;
    document.getElementById("detail-placeholder").hidden = Boolean(work.description);
    const img = document.getElementById("detail-image");
    img.src = work.image;
    img.alt = work.title + "，" + work.medium + "，" + work.size;
    const prev = works[(index - 1 + works.length) % works.length];
    const next = works[(index + 1) % works.length];
    document.getElementById("prev-work").href = "work.html?id=" + prev.id;
    document.getElementById("prev-work").textContent = "← " + prev.title;
    document.getElementById("next-work").href = "work.html?id=" + next.id;
    document.getElementById("next-work").textContent = next.title + " →";
    document.getElementById("related-grid").innerHTML = works.filter((item) => item.id !== work.id).slice(0, 2).map(card).join("");
    const dialog = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    document.getElementById("open-lightbox").addEventListener("click", () => {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      dialog.showModal();
    });
    document.getElementById("close-lightbox").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  }

  function observeReveals() {
    const items = document.querySelectorAll("[data-reveal], .reveal");
    if (!("IntersectionObserver" in window)) { items.forEach((item) => item.classList.add("is-visible")); return; }
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); current.unobserve(entry.target); }
    }), {threshold:0.08});
    items.forEach((item) => { if (!item.classList.contains("is-visible")) observer.observe(item); });
  }
  document.querySelectorAll('a[href$=".html"], a[href*=".html?"]').forEach((link) => link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    event.preventDefault();
    document.documentElement.classList.add("leaving");
    window.setTimeout(() => { location.href = url.href; }, 320);
  }));
  observeReveals();
})();

