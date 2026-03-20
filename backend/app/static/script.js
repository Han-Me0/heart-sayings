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
            const row = createRow(idiom)
            tableBody.appendChild(row);
        });
        
    // Search for idioms by word, group of words, or phrase
    } else { 
        const searchedIdioms = idioms.filter(idiom =>
        idiom.idiom.toLowerCase().includes(searchTerm) || idiom.idiom_translation.toLowerCase().includes(searchTerm)
        );

        // Populate table
        searchedIdioms.forEach(idiom => {
        const row = createRow(idiom)
        tableBody.appendChild(row);
        });
    }
}

// Idiom filtering function by language
function filterByLanguage() {
    const languageFilter = document.getElementById("languageSelector").value;
    createTableHeader()
    loadIdioms(languageFilter, "");
}

// Idiom searchinf function
function searchIdioms() {
    const searchTerm = document.getElementById("searchBar").value.toLowerCase();
    createTableHeader()
    loadIdioms("", searchTerm);
}

 //Helper function to create a table header
function createTableHeader(){
    const tableHead = document.getElementById("idiomsTableHead");
    tableHead.innerHTML = `
        <tr><th>Language</th>
        <th>Idiom / Expression</th>
        <th>Meaning</th>
        <th>Translation of idiom / expression</th>
        <th>Translation of meaning</th></tr>
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
    return row;
}
