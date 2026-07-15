let selectedConceptId = null;

const conceptIcons = {
    "Kind-hearted": "fa-solid fa-heart",
    "Emotion / Strong feelings": "fa-solid fa-fire",
    "Honesty / Openness": "fa-solid fa-bullseye",
    "Fear / Nervousness": "fa-solid fa-triangle-exclamation",
    "Disinterest / Boredom": "fa-solid fa-thumbs-down",
    "Sadness / Melancholy": "fa-solid fa-droplet"
};

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
        const iconClass = conceptIcons[c.description] || "fa-solid fa-circle";

        card.innerHTML = `
        <div class="concept-row">
            <i class="${iconClass}"></i>
            <span>${c.description}</span>
        </div>
    `;

        card.addEventListener("click", () => {
            console.log("Concept card clicked:", c);
            selectedConceptId = Number(c.id);
            openConceptResults();
        });

        wrap.appendChild(card);
    });
}

function getConceptIcon(conceptName) {
    const icons = {
        "Kind-hearted": "❤️",
        "Emotion / Strong feelings": "🔥",
        "Honesty / Openness": "🎯",
        "Fear / Nervousness": "⚠️",
        "Sadness / Melancholy": "💧",
        "Disinterest / Boredom": "👎"
    };

    return icons[conceptName] || "💡";
}

function openConceptResults() {
    console.log("openConceptResults selectedConceptId:", selectedConceptId);

    const overview = document.getElementById("conceptOverview");
    const results = document.getElementById("conceptResultsView");
    const pageTitle = document.querySelector(".concepts-page h1");
    const pageHint = document.querySelector(".concepts-page .hint");

    if (pageTitle) pageTitle.style.display = "none";
    if (pageHint) pageHint.style.display = "none";
    if (!overview) console.error("conceptOverview element not found");
    if (!results) console.error("conceptResultsView element not found");

    if (overview) overview.style.display = "none";
    if (results) results.style.display = "block";

    fillLanguageDropdownForSelected();
    document.getElementById("backToListBtn").style.display = "inline-flex";
    renderConceptResults();
}

function backToConcepts() {
    const overview = document.getElementById("conceptOverview");
    const results = document.getElementById("conceptResultsView");
    const searchEl = document.getElementById("conceptSearch");
    const langSel = document.getElementById("languageFilter");
    const grid = document.getElementById("conceptIdiomsGrid");

    const pageTitle = document.querySelector(".concepts-page h1");
    const pageHint = document.querySelector(".concepts-page .hint");

    if (pageTitle) pageTitle.style.display = "block";
    if (pageHint) pageHint.style.display = "block";

    selectedConceptId = null;

    if (searchEl) searchEl.value = "";
    if (langSel) langSel.value = "all";
    if (grid) grid.innerHTML = "";

    if (results) results.style.display = "none";
    if (overview) overview.style.display = "block";

    document.getElementById("backToListBtn").style.display = "none";

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

        

        <div class="idiom-meta">
            <div class="meta-item">${i.meaning || ""}</div>
            <div class="meta-item"><b>Idiom:</b> ${i.idiom_translation || "n/a"}</div>
            <div class="meta-item"><b>Meaning:</b> ${i.meaning_translation || "n/a"}</div>
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

    const conceptObj = concepts.find(c => Number(c.id) === Number(selectedConceptId));

    if (title) {
        const conceptName = conceptObj ? conceptObj.description : `Concept ${selectedConceptId}`;
        const iconClass = conceptObj ? conceptIcons[conceptObj.description] : "fa-solid fa-circle";

        title.innerHTML = `
        <span class="concept-result-title">
            <i class="${iconClass}"></i>
            <span>${conceptName}</span>
        </span>
    `;
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
    renderConceptCards();

    const langSel = document.getElementById("languageFilter");
    const searchEl = document.getElementById("conceptSearch");
    const backBtn = document.getElementById("backToListBtn");

    if (langSel) langSel.addEventListener("change", renderConceptResults);
    if (searchEl) searchEl.addEventListener("input", renderConceptResults);
    if (backBtn) backBtn.addEventListener("click", backToConcepts);
}

document.addEventListener("DOMContentLoaded", initConceptPage);