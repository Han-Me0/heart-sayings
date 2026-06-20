/* ===== script.js (main list + carousel) ===== */

function getCardsPerPage() {
    return window.matchMedia("(max-width: 800px)").matches ? 2 : 6;
}

function addSwipeSupport(el, onSwipe) {
    if (!el) return;
    let startX = 0, startY = 0, dragging = false;

    el.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        dragging = true;
    }, { passive: true });

    el.addEventListener("touchend", (e) => {
        if (!dragging) return;
        dragging = false;

        const t = e.changedTouches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;

        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            onSwipe(dx < 0 ? "left" : "right");
        }
    }, { passive: true });
}

function renderCard(idiom) {
    const card = document.createElement("div");
    card.className = "idiom-card";
    card.dataset.conceptId = idiom.concept_id ?? "";
    card.dataset.conceptDescription = idiom.concept_description ?? "";
    card.innerHTML = `
    <div class="idiom-top">
    <div class="idiom-title">
        <span class="idiom-ribbon">
        <span class="idiom-ribbon__text">${idiom.idiom || ""}</span>
        </span>
    </div>
    <div class="lang-badge">${idiom.language || ""}</div>
    </div>
    <div class="idiom-meta">
    <div class="meta-item"><b>Idiom meaning:</b> ${idiom.meaning || ""}</div>
    <div class="meta-item"><b>Idiom translation:</b> ${idiom.idiom_translation || ""}</div>
    <div class="meta-item"><b>Meaning translation:</b> ${idiom.meaning_translation || ""}</div>
    </div>
    `;
    card.addEventListener("click", () => {
        const conceptId = card.dataset.conceptId ? parseInt(card.dataset.conceptId, 10) : null;
        if (conceptId === null || isNaN(conceptId)) {
            if (typeof hideConceptResults === "function") hideConceptResults();
            showInfoMessage("This idiom is not yet assigned to a concept.");
            return;
        }
        if (typeof showSameConceptIdioms === "function") {
            showSameConceptIdioms(conceptId, card.dataset.conceptDescription, idiom);
        }
    });
    return card;
}

function renderConceptCard(idiom, clickedIdiom) {
    const card = document.createElement("div");
    card.className = "idiom-card";

    card.dataset.conceptId = idiom.concept_id ?? "";
    card.dataset.conceptDescription = idiom.concept_description ?? "";

    const isClicked =
        clickedIdiom &&
        idiom.idiom === clickedIdiom.idiom &&
        idiom.language === clickedIdiom.language;

    card.innerHTML = `
    <div class="idiom-top">
      <div class="idiom-title">
        <span class="idiom-ribbon">
          <span class="idiom-ribbon__text">${idiom.idiom || ""}</span>
        </span>
      </div>
      <div class="lang-badge">${idiom.language || ""}</div>
    </div>

    <div class="idiom-meaning">${idiom.meaning || ""}</div>

    <div class="idiom-meta">
      <div><b>Idiom:</b> ${idiom.idiom_translation || ""}</div>
      <div><b>Meaning:</b> ${idiom.meaning_translation || ""}</div>
    </div>
  `;

    if (isClicked) card.classList.add("is-selected");

    card.addEventListener("click", () => {
        const conceptId = card.dataset.conceptId
            ? parseInt(card.dataset.conceptId, 10)
            : null;

        if (conceptId === null || isNaN(conceptId)) {
            const msg = document.getElementById("infoMessage");
            showInfoMessage("This idiom is not yet assigned to a concept.");
            return;
        }

        showSameConceptIdioms(conceptId, card.dataset.conceptDescription, idiom);
    });
    return card;
}

function showSameConceptIdioms(conceptId, conceptDescription, clickedIdiom) {
    const container = document.getElementById("conceptResults");
    const title = document.getElementById("conceptTitle");
    const desc = document.getElementById("conceptDescription");
    const conceptGrid = document.getElementById("conceptGrid");
    const idiomsSection = document.getElementById("idiomsSection");
    const backBtn = document.getElementById("backToListBtn");
    const pageTitle = document.querySelector(".concepts-page h1");
    const pageHint = document.querySelector(".concepts-page .hint");

    if (!container || !title || !desc || !conceptGrid) {
        console.error("Concept results DOM missing.");
        return;
    }

    // Guard: concept might be null in DB
    const cid = Number(conceptId);
    if (!cid || Number.isNaN(cid)) {
        console.warn("No concept_id for this idiom.");
        return;
    }

    // Switch view
    if (idiomsSection) idiomsSection.style.display = "none";
    if (backBtn) backBtn.style.display = "inline-block";
    container.style.display = "block";
    container.style.pointerEvents = "auto";

    const allIdioms = window.idioms || [];
    const sameConcept = allIdioms.filter(i => Number(i.concept_id) === cid);

    // clicked first
    const clickedFirst = [];
    const others = [];
    sameConcept.forEach(i => {
        if (clickedIdiom && i.idiom === clickedIdiom.idiom && i.language === clickedIdiom.language) clickedFirst.push(i);
        else others.push(i);
    });
    const finalList = clickedFirst.concat(others);

    title.textContent = "Idioms with the same meaning in different languages";
    desc.innerHTML =
        conceptDescription && String(conceptDescription).trim().length > 0
            ? `<span class="concept-title-badge">${conceptDescription}</span>`
            : `<span class="concept-title-badge">Concept ID: ${cid}</span>`;

    conceptGrid.innerHTML = "";
    finalList.forEach(item => conceptGrid.appendChild(renderConceptCard(item, clickedIdiom)));
}

function hideConceptResults() {
    const container = document.getElementById("conceptResults");
    const idiomsSection = document.getElementById("idiomsSection");
    const backBtn = document.getElementById("backToListBtn");

    if (container) {
        container.style.display = "none";
        container.style.pointerEvents = "none";
    }
    if (idiomsSection) idiomsSection.style.display = "block";
    if (backBtn) backBtn.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const backBtn = document.getElementById("backToListBtn");
    if (backBtn) backBtn.addEventListener("click", () => {
        hideConceptResults();
    });
});

function renderIdiomsCarousel(idiomList) {
    const track = document.getElementById("idiomsTrack");
    const dots = document.getElementById("idiomsDots");

    if (!track) {
        console.error("#idiomsTrack not found.");
        return;
    }

    const list = Array.isArray(idiomList) ? idiomList : [];

    track.innerHTML = "";

    if (dots) {
        dots.innerHTML = "";
        dots.style.display = "none";
    }

    track.style.transform = "none";

    if (list.length === 0) {
        return;
    }

    track.className = "idioms-page-grid";

    list.forEach(idiom => {
        track.appendChild(renderCard(idiom));
    });
}

function filterIdioms(allIdioms, languageFilter, searchTerm) {
    const term = (searchTerm || "").toLowerCase().trim();

    // nothing selected and no term => show nothing
    if ((languageFilter === "none" || !languageFilter) && term.length === 0) return [];

    // language only
    if (languageFilter && languageFilter !== "none" && languageFilter !== "all" && term.length === 0) {
        return allIdioms.filter(i => i.language === languageFilter);
    }

    // all + no term
    if (term.length === 0) return allIdioms;

    // global search
    return allIdioms.filter(i => {
        const fields = [
            i.language,
            i.idiom,
            i.idiom_translation,
            i.meaning,
            i.meaning_translation,
            i.concept_description
        ];
        return fields.some(f => typeof f === "string" && f.toLowerCase().includes(term));
    });
}

function loadIdioms(languageFilter = "none", searchTerm = "") {
    const allIdioms = window.idioms || []; // ✅ use injected data
    const clickHint = document.getElementById("clickHint");

    const filtered = filterIdioms(allIdioms, languageFilter, searchTerm);

    if (clickHint) clickHint.style.display = filtered.length > 0 ? "block" : "none";

    renderIdiomsCarousel(filtered);
}

/* ---- Bind UI events ---- */
function init() {
    const languageSelector = document.getElementById("languageSelector");
    const searchBar = document.getElementById("searchBar");

    if (!languageSelector) console.warn("#languageSelector not found");
    if (!searchBar) console.warn("#searchBar not found");

    // Language change
    languageSelector?.addEventListener("change", () => {
        if (typeof hideConceptResults === "function") hideConceptResults();
        if (searchBar) searchBar.value = "";
        loadIdioms(languageSelector.value || "none", "");
    });

    // Search
    searchBar?.addEventListener("input", () => {
        if (typeof hideConceptResults === "function") hideConceptResults();

        // Match prior behavior: search across all languages
        if (languageSelector) languageSelector.value = "none";

        const term = (searchBar.value || "").toLowerCase().trim();
        loadIdioms("none", term);
    });

    // Re-chunk carousel on breakpoint change
    let last = getCardsPerPage();
    window.addEventListener("resize", () => {
        const now = getCardsPerPage();
        if (now !== last) {
            last = now;
            const lang = languageSelector ? languageSelector.value : "none";
            const term = searchBar ? (searchBar.value || "").toLowerCase().trim() : "";
            loadIdioms(lang, term);
        }
    }, { passive: true });

    // initial state: show nothing until user selects/searches
    loadIdioms("none", "");
}

document.addEventListener("DOMContentLoaded", init);

// Alert msg for no concept_id idioms
function showInfoMessage(text) {
    const msg = document.getElementById("infoMessage");
    if (!msg) return;

    msg.textContent = text;
    msg.style.display = "block";
    msg.scrollIntoView({ behavior: "smooth", block: "center" });

    clearTimeout(msg._hideTimer);
    msg._hideTimer = setTimeout(() => {
        msg.style.display = "none";
    }, 3000);
}