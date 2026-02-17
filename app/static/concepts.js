let selectedConceptId = null;

function uniqueLanguagesFromConcept(conceptId) {
    const set = new Set();
    (ALL_IDIOMS || []).forEach(i => {
        if (Number(i.concept_id) === Number(conceptId) && i.language && i.language.trim()) {
            set.add(i.language.trim());
        }
    });
    return Array.from(set).sort();
}

function renderConceptCards() {
    const wrap = document.getElementById("conceptCards");
    if (!wrap) return;

    wrap.innerHTML = "";

    (ALL_CONCEPTS || []).forEach(c => {
        const card = document.createElement("div");
        card.className = "concept-card";
        card.dataset.conceptId = c.id;

        // If you stored emoji in description already, keep it as is
        card.innerHTML = `
      <div class="concept-title">${c.description}</div>
      <div class="concept-sub">Click to view idioms across languages</div>
    `;

        card.addEventListener("click", () => {
            selectedConceptId = Number(c.id);
            openConceptResults();
        });

        wrap.appendChild(card);
    });
}

function openConceptResults() {
    const overview = document.getElementById("conceptOverview");
    const results = document.getElementById("conceptResultsView");
    if (overview) overview.style.display = "none";
    if (results) results.style.display = "block";

    fillLanguageDropdownForSelected();
    renderConceptResults();
}

function backToConcepts() {
    const overview = document.getElementById("conceptOverview");
    const results = document.getElementById("conceptResultsView");

    // reset
    selectedConceptId = null;
    const searchEl = document.getElementById("conceptSearch");
    if (searchEl) searchEl.value = "";

    if (results) results.style.display = "none";
    if (overview) overview.style.display = "block";
}

function fillLanguageDropdownForSelected() {
    const sel = document.getElementById("languageFilter");
    if (!sel) return;

    sel.innerHTML = `<option value="all">All languages</option>`;

    const langs = uniqueLanguagesFromConcept(selectedConceptId);
    langs.forEach(lang => {
        const opt = document.createElement("option");
        opt.value = lang;
        opt.textContent = lang;
        sel.appendChild(opt);
    });
}

function renderIdiomCard(i) {
    const card = document.createElement("div");
    card.className = "idiom-card"; // reuse your home card CSS

    const concept = i.concept_description && i.concept_description.trim()
        ? i.concept_description.trim()
        : "";

    // Keep it consistent with home cards; show only useful lines
    card.innerHTML = `
    <div class="idiom-top">
      <div class="idiom-title">${i.idiom || ""}</div>
      <div class="badge">${i.language || ""}</div>
    </div>
    <div class="idiom-meaning">${i.meaning || ""}</div>
    <div class="idiom-footer">
      ${concept ? `<div class="badge">${concept}</div>` : ``}
      ${(i.idiom_translation && i.idiom_translation !== "n/a") ? `<div class="badge">Idiom: ${i.idiom_translation}</div>` : ``}
      ${(i.meaning_translation && i.meaning_translation !== "n/a") ? `<div class="badge">Meaning: ${i.meaning_translation}</div>` : ``}
    </div>
  `;
    return card;
}

function renderConceptResults() {
    const title = document.getElementById("conceptTitle");
    const meta = document.getElementById("conceptMeta");
    const grid = document.getElementById("conceptIdiomsGrid");

    const langSel = document.getElementById("languageFilter");
    const searchEl = document.getElementById("conceptSearch");

    if (!grid) return;

    const lang = langSel ? langSel.value : "all";
    const term = (searchEl ? searchEl.value : "").toLowerCase().trim();

    const conceptObj = (ALL_CONCEPTS || []).find(c => Number(c.id) === Number(selectedConceptId));
    if (title) title.textContent = conceptObj ? conceptObj.description : `Concept ${selectedConceptId}`;
    if (meta) meta.textContent = "Filter by language or search within this concept.";

    let rows = (ALL_IDIOMS || []).filter(i => Number(i.concept_id) === Number(selectedConceptId));

    if (lang !== "all") rows = rows.filter(i => i.language === lang);

    if (term) {
        rows = rows.filter(i => {
            const fields = [i.idiom, i.meaning, i.idiom_translation, i.meaning_translation];
            return fields.some(f => typeof f === "string" && f.toLowerCase().includes(term));
        });
    }

    grid.innerHTML = "";
    rows.forEach(i => grid.appendChild(renderIdiomCard(i)));
}

function init() {
    renderConceptCards();

    const langSel = document.getElementById("languageFilter");
    const searchEl = document.getElementById("conceptSearch");
    const backBtn = document.getElementById("backToConceptsBtn");

    if (langSel) langSel.addEventListener("change", renderConceptResults);
    if (searchEl) searchEl.addEventListener("input", renderConceptResults);
    if (backBtn) backBtn.addEventListener("click", backToConcepts);
}

document.addEventListener("DOMContentLoaded", init);
