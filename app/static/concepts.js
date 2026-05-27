let selectedConceptId = null;

function getAllIdioms() {
    return window.ALL_IDIOMS || [];
}

function getAllConcepts() {
    return window.ALL_CONCEPTS || [];
}

function uniqueLanguagesFromConcept(conceptId) {
    const set = new Set();

    getAllIdioms().forEach(i => {
        if (
            Number(i.concept_id) === Number(conceptId) &&
            i.language &&
            i.language.trim()
        ) {
            set.add(i.language.trim());
        }
    });

    return Array.from(set).sort();
}

function renderConceptCards() {
    const wrap = document.getElementById("conceptCards");
    if (!wrap) {
        console.error("conceptCards element not found");
        return;
    }

    wrap.innerHTML = "";

    const concepts = getAllConcepts();
    console.log("renderConceptCards concepts:", concepts);

    if (!concepts.length) {
        wrap.innerHTML = `<p>No concepts available.</p>`;
        return;
    }

    concepts.forEach(c => {
        const card = document.createElement("div");
        card.className = "concept-card";
        card.dataset.conceptId = c.id;

        card.innerHTML = `
            <div class="concept-title">${c.description || ""}</div>
            <div class="concept-sub">Click to view idioms across languages</div>
        `;

        card.addEventListener("click", () => {
            console.log("Concept card clicked:", c);
            selectedConceptId = Number(c.id);
            openConceptResults();
        });

        wrap.appendChild(card);
    });
}

function openConceptResults() {
    console.log("openConceptResults selectedConceptId:", selectedConceptId);

    const overview = document.getElementById("conceptOverview");
    const results = document.getElementById("conceptResultsView");

    if (!overview) console.error("conceptOverview element not found");
    if (!results) console.error("conceptResultsView element not found");

    if (overview) overview.style.display = "none";
    if (results) results.style.display = "block";

    fillLanguageDropdownForSelected();
    renderConceptResults();
}

function backToConcepts() {
    const overview = document.getElementById("conceptOverview");
    const results = document.getElementById("conceptResultsView");
    const searchEl = document.getElementById("conceptSearch");
    const langSel = document.getElementById("languageFilter");
    const grid = document.getElementById("conceptIdiomsGrid");

    selectedConceptId = null;

    if (searchEl) searchEl.value = "";
    if (langSel) langSel.value = "all";
    if (grid) grid.innerHTML = "";

    if (results) results.style.display = "none";
    if (overview) overview.style.display = "block";
}

function fillLanguageDropdownForSelected() {
    const sel = document.getElementById("languageFilter");
    if (!sel) {
        console.error("languageFilter element not found");
        return;
    }

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
    card.className = "idiom-card";

    card.innerHTML = `
        <div class="idiom-top">
            <div class="idiom-title">
                <span class="idiom-ribbon">
                    <span class="idiom-ribbon__text">${i.idiom || ""}</span>
                </span>
            </div>
            <div class="lang-badge">${i.language || ""}</div>
        </div>

        <div class="idiom-meaning">${i.meaning || ""}</div>

        <div class="idiom-meta">
            <div><b>Idiom:</b> ${i.idiom_translation || "n/a"}</div>
            <div><b>Meaning:</b> ${i.meaning_translation || "n/a"}</div>
        </div>
    `;

    return card;
}

function renderEmptyConceptState(grid, message = "No idioms found for this filter.") {
    if (!grid) return;

    grid.innerHTML = `
        <div class="empty-state-card">
            <p>${message}</p>
        </div>
    `;
}

function renderConceptResults() {
    const title = document.getElementById("conceptTitle");
    const meta = document.getElementById("conceptMeta");
    const grid = document.getElementById("conceptIdiomsGrid");
    const langSel = document.getElementById("languageFilter");
    const searchEl = document.getElementById("conceptSearch");

    if (!grid) {
        console.error("conceptIdiomsGrid element not found");
        return;
    }

    if (!selectedConceptId) {
        renderEmptyConceptState(grid, "No concept selected.");
        return;
    }

    const lang = langSel ? langSel.value : "all";
    const term = (searchEl ? searchEl.value : "").toLowerCase().trim();

    const concepts = getAllConcepts();
    const idioms = getAllIdioms();

    console.log("renderConceptResults selectedConceptId:", selectedConceptId);
    console.log("ALL_CONCEPTS:", concepts);
    console.log("ALL_IDIOMS:", idioms);

    const conceptObj = concepts.find(c => Number(c.id) === Number(selectedConceptId));

    if (title) {
        title.textContent = conceptObj
            ? conceptObj.description
            : `Concept ${selectedConceptId}`;
    }

    if (meta) {
        meta.textContent = "Filter by language or search within this concept.";
    }

    let rows = idioms.filter(i => Number(i.concept_id) === Number(selectedConceptId));

    if (lang !== "all") {
        rows = rows.filter(i => i.language === lang);
    }

    if (term) {
        rows = rows.filter(i => {
            const fields = [
                i.idiom,
                i.meaning,
                i.idiom_translation,
                i.meaning_translation,
                i.language,
                i.concept_description
            ];
            return fields.some(f => typeof f === "string" && f.toLowerCase().includes(term));
        });
    }

    grid.innerHTML = "";

    if (!rows.length) {
        renderEmptyConceptState(grid, "No idioms found for this concept with the current filters.");
        return;
    }

    rows.forEach(i => {
        grid.appendChild(renderIdiomCard(i));
    });
}

function initConceptPage() {
    console.log("initConceptPage running");
    console.log("window.ALL_CONCEPTS:", window.ALL_CONCEPTS);
    console.log("window.ALL_IDIOMS:", window.ALL_IDIOMS);

    renderConceptCards();

    const langSel = document.getElementById("languageFilter");
    const searchEl = document.getElementById("conceptSearch");
    const backBtn = document.getElementById("backToConceptsBtn");

    if (langSel) langSel.addEventListener("change", renderConceptResults);
    if (searchEl) searchEl.addEventListener("input", renderConceptResults);
    if (backBtn) backBtn.addEventListener("click", backToConcepts);
}

document.addEventListener("DOMContentLoaded", initConceptPage);