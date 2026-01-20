let selectedCoceptId = null;

function uniqueLanguages(idioms) {
    const set = new Set();
    (idioms || []).forEach(i => {
        if (i && typeof i.language === "string" && i.language.trim()) {
            set.add(i.language.trim());
        }
    });
    return Array.from(set).sort();
}

function renderConceptList(concepts) {
    const ul = document.getElementById("conceptList");
    ul.innerHTML = "";

    concepts.forEach(c => {
        const li = document.createElement("li");
        li.textContent = `${c.id}. ${c.description}`;
        li.dataset.conceptId = c.id;

        li.addEventListener("click", () => {
            selectedConceptId = c.id;

            // active highlight
            document.querySelectorAll("#conceptList li").forEach(x => x.classList.remove("active"));
            li.classList.add("active");

            renderConceptResults();
        });

        ul.appendChild(li);
    });
}

function fillLanguageDropdown() {
    const sel = document.getElementById("languageFilter");
    if (!sel) return;

    // Clear existing (keep the first option if we have languages")
    sel.innerHTML = `<option value="all">All languages</option>`;

    const langs = uniqueLanguages(ALL_IDIOMS);

    console.log("Languages found:", langs); // should print an array

    langs.forEach(lang => {
        const opt = document.createElement("option");
        opt.value = lang;
        opt.textContent = lang;
        sel.appendChild(opt);
    });

    sel.addEventListener("change", renderConceptResults);
}


function renderConceptResults() {
    const title = document.getElementById("conceptTitle");
    const meta = document.getElementById("conceptMeta");
    const tbody = document.getElementById("conceptTableBody");

    const langSel = document.getElementById("languageFilter");
    const searchEl = document.getElementById("conceptSearch");

    const lang = langSel ? langSel.value : "all";
    const term = (searchEl ? searchEl.value : "").toLowerCase();

    if (!selectedConceptId) {
        title.textContent = "Select a concept (left) to view idioms";
        meta.textContent = "Choose a concept, then filter by language or search.";
        tbody.innerHTML = "";
        return;
    }

    const concept = (ALL_CONCEPTS || []).find(
        c => Number(c.id) === Number(selectedConceptId)
    );

    title.textContent = concept
        ? concept.description
        : `Concept ${selectedConceptId}`;

    let rows = (ALL_IDIOMS || []).filter(
        i => Number(i.concept_id) === Number(selectedConceptId)
    );

    if (lang !== "all") {
        rows = rows.filter(i => i.language === lang);
    }

    if (term) {
        rows = rows.filter(i => {
            const fields = [
                i.language,
                i.idiom,
                i.meaning,
                i.idiom_translation,
                i.meaning_translation
            ];
            return fields.some(
                f => typeof f === "string" && f.toLowerCase().includes(term)
            );
        });
    }

    tbody.innerHTML = "";
    rows.forEach(i => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${i.language || ""}</td>
            <td><b>${i.idiom || ""}</b></td>
            <td>${i.meaning || ""}</td>
            <td>${i.idiom_translation || ""}</td>
            <td>${i.meaning_translation || ""}</td>
        `;
        tbody.appendChild(tr);
    });
}


function init() {
    console.log("ALL_IDIOMS length:", ALL_IDIOMS?.length);
    console.log("Sample idiom:", ALL_IDIOMS?.[0]);

    renderConceptList(ALL_CONCEPTS);
    fillLanguageDropdown();

    const searchEl = document.getElementById("conceptSearch");
    if (searchEl) {
        searchEl.addEventListener("input", renderConceptResults);
        // Optional: render initial instructions in the right panel
        renderConceptResults();
    }

}

if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
