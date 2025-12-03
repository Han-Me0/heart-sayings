function loadIdioms(languageFilter = "none", searchTerm = "") {
    const tableBody = document.getElementById("idiomsTable");
    const searchBar = document.getElementById("searchBar");

    // Clear the table 
    tableBody.innerHTML = "";

    // Reset concept results when reloading main table
    hideConceptResults();

    if (languageFilter === "none" && !searchTerm) {
        // If nothing is selected/searched, you can choose to show nothing,
        // or show all idioms. For now, we keep your existing behavior: do nothing.
        return;
    }

    if (searchBar) {
        searchBar.disabled = false;
    }

    let filteredIdioms;

    // Filter idioms by language (no search term)
    if (languageFilter !== "none" && searchTerm === "") {
        filteredIdioms = idioms.filter(idiom =>
            idiom.language === languageFilter
        );

        // Search for idioms by word, group of words, or phrase
    } else {
        const term = (searchTerm || "").toLowerCase();

        filteredIdioms = idioms.filter(idiom => {
            const fields = [
                idiom.idiom,
                idiom.idiom_translation,
                idiom.meaning,
                idiom.meaning_translation,
                idiom.concept_description
            ];

            return fields.some(f =>
                typeof f === "string" && f.toLowerCase().includes(term)
            );
        });
    }

    // Populate table
    filteredIdioms.forEach(idiom => {
        const row = createRow(idiom);
        tableBody.appendChild(row);
    });
}

// Idiom filtering function by language
function filterByLanguage() {
    const languageFilter = document.getElementById("languageSelector").value;
    createTableHeader();
    loadIdioms(languageFilter, "");
}

// Idiom searching function
function searchIdioms() {
    const searchTerm = document.getElementById("searchBar").value.toLowerCase();
    createTableHeader();
    loadIdioms("", searchTerm);
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
    row.innerHTML = `
        <td>${idiom.language}</td>
        <td><b>${idiom.idiom}</b></td>
        <td>${idiom.meaning}</td>
        <td>${idiom.idiom_translation}</td>
        <td>${idiom.meaning_translation}</td>
    `;

    // Attach concept info for click behaviour
    row.dataset.conceptId = idiom.concept_id;
    row.dataset.conceptDescription = idiom.concept_description || "";

    // When you click a row → show other idioms with the same concept
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

    if (!container || !title || !desc || !tbody) return;

    // All idioms with this concept
    const sameConcept = idioms.filter(i => i.concept_id === conceptId);

    // Put the clicked idiom first in the list
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

    // Fill title/description
    title.textContent = "Idioms with the same meaning in different languages";
    if (conceptDescription && conceptDescription.trim().length > 0) {
        desc.textContent = `Concept: ${conceptDescription}`;
    } else {
        desc.textContent = `Concept ID: ${conceptId}`;
    }

    // Fill table
    tbody.innerHTML = "";
    finalList.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.language}</td>
            <td><b>${row.idiom}</b></td>
            <td>${row.meaning}</td>
            <td>${row.idiom_translation}</td>
            <td>${row.meaning_translation}</td>
        `;
        tbody.appendChild(tr);
    });

    container.style.display = "block";
}

function hideConceptResults() {
    const container = document.getElementById("conceptResults");
    if (container) {
        container.style.display = "none";
    }
}
