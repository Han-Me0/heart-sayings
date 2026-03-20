function loadIdioms(languageFilter = "none", searchTerm = "") {
    const tableBody = document.getElementById("idiomsTable");
    const searchBar = document.getElementById("searchBar");

    // Clear the table 
    tableBody.innerHTML = " ";

    if (languageFilter === "none") {
        tableBody.disabled = false;
        return;
    }
    searchBar.disabled = false;

    // Filter idioms by language
    if(languageFilter !== "none" && searchTerm == "" ){ 
        const filteredIdioms = idioms.filter(idiom =>
            idiom.language === languageFilter
        );

        // Populate table
        filteredIdioms.forEach(idiom => {
            const row = createRow(idiom, languageFilter)
            tableBody.appendChild(row);
        });
        
    // Search for idioms by word, group of words, or phrase
    } else { 
        const searchedIdioms = idioms.filter(idiom =>
        idiom.idiom.toLowerCase().includes(searchTerm) || (idiom.idiom_translation && idiom.idiom_translation.toLowerCase().includes(searchTerm))
        );

        // Populate table
        searchedIdioms.forEach(idiom => {
        const row = createRow(idiom, languageFilter)
        tableBody.appendChild(row);
        });
    }
}

// Idiom filtering function by language
function filterByLanguage() {
    const languageFilter = document.getElementById("languageSelector").value;
    createTableHeader(languageFilter);
    loadIdioms(languageFilter, "");
}

// Idiom searching function
function searchIdioms() {
    const searchTerm = document.getElementById("searchBar").value.toLowerCase();
    createTableHeader("none"); // Default header for search
    loadIdioms("none", searchTerm);
}

// Helper function to create a table header
function createTableHeader(languageFilter) {
    const tableHead = document.getElementById("idiomsTableHead");
    const isEnglish = languageFilter === "English";
    
    tableHead.innerHTML = `
        <tr>
            <th>Language</th>
            <th>Idiom / Expression</th>
            <th>Meaning</th>
            ${isEnglish ? '' : `
                <th>Translation of idiom / expression</th>
                <th>Translation of meaning</th>
            `}
        </tr>
    `;
}

// Helper function to create a table row
function createRow(idiom, languageFilter) {
    const row = document.createElement("tr");
    const isFilteringEnglish = languageFilter === "English";
    const isIdiomEnglish = idiom.language === "English";
    
    // Check if we should entirely OMIT the columns (only if the whole table is English)
    if (isFilteringEnglish) {
        row.innerHTML = `
            <td data-label="Language">${idiom.language}</td>
            <td data-label="Idiom / Expression"><b>${idiom.idiom}</b></td>
            <td data-label="Meaning">${idiom.meaning}</td>
        `;
    } else {
        // We are in a mixed view (search) or another language view
        // Show English rows with empty translation cells to maintain table structure
        row.innerHTML = `
            <td data-label="Language">${idiom.language}</td>
            <td data-label="Idiom / Expression"><b>${idiom.idiom}</b></td>
            <td data-label="Meaning">${idiom.meaning}</td>
            <td data-label="Translation">${isIdiomEnglish ? '-' : idiom.idiom_translation}</td>
            <td data-label="Meaning Translation">${isIdiomEnglish ? '-' : idiom.meaning_translation}</td>
        `;
    }
    return row;
}
