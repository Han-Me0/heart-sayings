function loadIdioms(languageFilter = "none", searchTerm = "") {
    const grid = document.getElementById("idiomsGrid");
    const searchBar = document.getElementById("searchBar");
    const clickHint = document.getElementById("clickHint");

    if (!grid) {
        console.error("idiomsGrid not found in HTML");
        return;
    }

    // Clear results
    grid.innerHTML = "";

    // Reset concept panel when main results change
    //hideConceptResults();

    // If nothing selected and no search term -> show nothing
    const term = (searchTerm || "").toLowerCase().trim();
    if ((languageFilter === "none" || !languageFilter) && term.length === 0) {
        if (clickHint) clickHint.style.display = "none";
        return;
    }

    if (searchBar) searchBar.disabled = false;

    let filteredIdioms = [];

    // Filter by language only
    if (languageFilter && languageFilter !== "none" && languageFilter !== "all" && term.length === 0) {
        filteredIdioms = idioms.filter(i => i.language === languageFilter);
    } else if (term.length === 0) {
        // "all" selected and no search term -> show everything
        filteredIdioms = idioms;
    } else {
        // global search across all languages
        filteredIdioms = idioms.filter(i => {
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

    // Show hint only when we have results
    if (clickHint) clickHint.style.display = filteredIdioms.length > 0 ? "block" : "none";

    // Render cards
    filteredIdioms.forEach(i => {
        const card = renderCard(i);
        grid.appendChild(card);
    });
}



// Idiom filtering function by language
function filterByLanguage() {
    hideConceptResults(); // user changed filter → exit concept view

    const languageFilter = document.getElementById("languageSelector").value;

    const searchBar = document.getElementById("searchBar");
    if (searchBar) searchBar.value = "";

    loadIdioms(languageFilter, "");
}


// Idiom searching function
function searchIdioms() {
    hideConceptResults(); // user started searching → exit concept view

    const searchTerm = document.getElementById("searchBar").value.toLowerCase().trim();

    const languageSelector = document.getElementById("languageSelector");
    if (languageSelector) languageSelector.value = "none";

    loadIdioms("none", searchTerm);
}

// Helper function to create a table header
function createTableHeader() {
    const tableHead = document.getElementById("idiomsTableHead");
    tableHead.innerHTML = `
        <tr>
            <th>Language</th>
            <th>Idiom / Expression</th>
            <th>Meaning</th>
            <th>Translation of idiom / expression</th>
            <th>Translation of meaning</th>
        </tr>
    `;
}

// Helper function to create a table row
function createRow(idiom) {
    const row = document.createElement("tr");

    // Attach concept info for click behaviour
    row.dataset.conceptId = idiom.concept_id;
    row.dataset.conceptDescription = idiom.concept_description || "";

    row.innerHTML = `
        <td>${idiom.language}</td>
        <td><b>${idiom.idiom}</b></td>
        <td>${idiom.meaning}</td>
        <td>${idiom.idiom_translation}</td>
        <td>${idiom.meaning_translation}</td>
    `;


    // When row clicked → show other idioms with the same concept
    row.addEventListener("click", () => {
        const conceptId = row.dataset.conceptId
            ? parseInt(row.dataset.conceptId, 10)
            : null;

        if (!conceptId || isNaN(conceptId)) {
            // No concept assigned → hide extra panel
            hideConceptResults();
            return;
        }

        showSameConceptIdioms(conceptId, row.dataset.conceptDescription, idiom);
    });

    return row;
}

// ---------- Concept-based "same meaning across languages" ----------

function showSameConceptIdioms(conceptId, conceptDescription, clickedIdiom) {
    const container = document.getElementById("conceptResults");
    const title = document.getElementById("conceptTitle");
    const desc = document.getElementById("conceptDescription");
    const tbody = document.getElementById("conceptResultsBody");
    const idiomsSection = document.getElementById("idiomsSection");
    const grid = document.getElementById("idiomsGrid");
    const backBtn = document.getElementById("backToListBtn");

    // Guard FIRST (avoid JS crash that kills all handlers)
    if (!container || !title || !desc || !tbody) {
        console.error("Concept results DOM missing (conceptResults/conceptTitle/conceptDescription/conceptResultsBody).");
        return;
    }

    // Switch to "concept mode"
    if (idiomsSection) idiomsSection.style.display = "none";
    if (grid) grid.style.display = "none";
    if (backBtn) backBtn.style.display = "inline-block";

    container.style.display = "block";
    container.style.pointerEvents = "auto";

    // Ensure numeric comparison (DB may return strings)
    const cid = Number(conceptId);

    // All idioms with this concept
    const sameConcept = (idioms || []).filter(i => Number(i.concept_id) === cid);

    // Put clicked idiom first
    const clickedFirst = [];
    const others = [];

    sameConcept.forEach(i => {
        if (i.idiom === clickedIdiom.idiom && i.language === clickedIdiom.language) {
            clickedFirst.push(i);
        } else {
            others.push(i);
        }
    });

    const finalList = clickedFirst.concat(others);

    // Title/description
    title.textContent = "Idioms with the same meaning in different languages";
    if (conceptDescription && conceptDescription.trim().length > 0) {
        desc.textContent = `Concept: ${conceptDescription}`;
    } else {
        desc.textContent = `Concept ID: ${cid}`;
    }

    // Render rows
    tbody.innerHTML = "";
    finalList.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.language || ""}</td>
            <td><b>${row.idiom || ""}</b></td>
            <td>${row.meaning || ""}</td>
            <td>${row.idiom_translation || ""}</td>
            <td>${row.meaning_translation || ""}</td>
        `;
        tbody.appendChild(tr);
    });
}


function hideConceptResults() {
    const container = document.getElementById("conceptResults");
    const idiomsSection = document.getElementById("idiomsSection");
    const grid = document.getElementById("idiomsGrid");
    const backBtn = document.getElementById("backToListBtn");

    if (container) {
        container.style.display = "none";
        container.style.pointerEvents = "none";
    }

    // Restore list mode
    if (idiomsSection) idiomsSection.style.display = "block";
    if (grid) grid.style.display = "grid";
    if (backBtn) backBtn.style.display = "none";
}


function backToIdioms() {
    hideConceptResults();
}

function renderCurrentIdiomsState() {
    const languageSelector = document.getElementById("languageSelector");
    const searchBar = document.getElementById("searchBar");

    const lang = languageSelector ? languageSelector.value : "none";
    const term = searchBar ? (searchBar.value || "").toLowerCase().trim() : "";

    if (term.length > 0) {
        // Global search mode → language must reset to match logic
        if (languageSelector) languageSelector.value = "none";
        loadIdioms("none", term);
    } else {
        // Language mode
        loadIdioms(lang || "none", "");
    }
}

function renderCard(idiom) {
    const card = document.createElement("div");
    card.className = "idiom-card";

    // store concept info same way you did for rows
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
    <div class="idiom-meaning">${idiom.meaning || ""}</div>
    <div class="idiom-meta">
        <div><b>Idiom:</b> ${idiom.idiom_translation || ""}</div>
        <div><b>Meaning:</b> ${idiom.meaning_translation || ""}</div>
    </div>
    `;

    // click → same concept view
    card.addEventListener("click", () => {
        const conceptId = card.dataset.conceptId ? parseInt(card.dataset.conceptId, 10) : null;
        if (!conceptId || isNaN(conceptId)) {
            hideConceptResults();
            return;
        }
        showSameConceptIdioms(conceptId, card.dataset.conceptDescription, idiom);
    });

    return card;
}

(function attachBackButtonHandler() {
    function bind() {
        const backBtn = document.getElementById("backToListBtn");
        if (!backBtn) {
            console.warn("backToListBtn not found (yet).");
            return;
        }

        backBtn.addEventListener("click", () => {
            console.log("Back button clicked");
            hideConceptResults();
            renderCurrentIdiomsState();
        });

        console.log("Back button handler attached");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bind);
    } else {
        bind();
    }
})();
