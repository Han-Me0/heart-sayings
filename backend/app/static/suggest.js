async function suggestConcept() {
    const idiomEl = document.getElementById("idiom");
    const meaningEl = document.getElementById("meaning");
    const resultBox = document.getElementById("concept-result");
    const hiddenConcept = document.getElementById("suggested_concept");

    if (!idiomEl || !meaningEl || !resultBox) {
        console.error("Required concept elements not found.");
        return;
    }

    const idiom = idiomEl.value.trim();
    const meaning = meaningEl.value.trim();

    resultBox.innerHTML = "Checking suggestion...";

    try {
        const response = await fetch("/heart-sayings/api/suggest-concept", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idiom, meaning })
        });

        const data = await response.json();

        if (data.success) {
            resultBox.innerHTML = `
            <div style="padding:10px; border:1px solid #ccc; border-radius:8px; margin-top:10px;">
              <p><strong>AI suggestion:</strong> ${data.suggested_concept}</p>
              <p><strong>Confidence:</strong> ${Math.round((data.confidence || 0) * 100)}%</p>
              <p><strong>Why:</strong> ${data.reason || "No explanation available."}</p>
            </div>
          `;

            if (hiddenConcept) {
                hiddenConcept.value = data.suggested_concept || "";
            }
        } else {
            resultBox.innerHTML = `<p>${data.error || "No concept suggestion available."}</p>`;
        }
    } catch (error) {
        console.error("Concept suggestion error:", error);
        resultBox.innerHTML = `<p>Could not generate a suggestion.</p>`;
    }
}

async function generateMeaning() {
    const idiomEl = document.getElementById("idiom");
    const languageEl = document.getElementById("language");
    const translationEl = document.getElementById("idiom_translation");
    const meaningEl = document.getElementById("meaning");
    const resultBox = document.getElementById("meaning-result");

    if (!idiomEl || !resultBox || !meaningEl) {
        console.error("Required meaning elements not found.");
        return;
    }

    const idiom = idiomEl.value.trim();
    const language = languageEl ? languageEl.value.trim() : "";
    const idiom_translation = translationEl ? translationEl.value.trim() : "";

    if (!idiom) {
        resultBox.innerHTML = "<p>Please enter an idiom first.</p>";
        return;
    }

    resultBox.innerHTML = "<p>Generating meaning...</p>";

    try {
        const response = await fetch("/heart-sayings/api/generate-meaning", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idiom,
                language,
                idiom_translation
            })
        });

        const data = await response.json();

        if (data.success) {
            resultBox.innerHTML = `
            <div style="padding:10px; border:1px solid #ccc; border-radius:8px; margin-top:10px;">
              <p><strong>Generated meaning:</strong> ${data.generated_meaning}</p>
              <p><strong>Source:</strong> ${data.source}</p>
            </div>
          `;

            if (!meaningEl.value.trim()) {
                meaningEl.value = data.generated_meaning;
            }
        } else {
            resultBox.innerHTML = `<p>${data.error || "Could not generate meaning."}</p>`;
        }
    } catch (error) {
        console.error("Meaning generation error:", error);
        resultBox.innerHTML = "<p>Could not generate meaning.</p>";
    }
}
async function generateMeaningTranslation() {
    const meaningEl = document.getElementById("meaning");
    const translationEl = document.getElementById("meaning_translation");
    const resultBox = document.getElementById("translation-result");

    if (!meaningEl || !translationEl || !resultBox) {
        console.error("Required translation elements not found.");
        return;
    }

    const text = meaningEl.value.trim();
    console.log("TEXT SENT TO TRANSLATE:", text);

    if (!text) {
        resultBox.innerHTML = "<p>Please enter or generate a meaning first.</p>";
        return;
    }

    resultBox.innerHTML = "<p>Generating translation...</p>";

    try {
        const response = await fetch("/heart-sayings/api/generate-translation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                target_language: "English"
            })
        });

        const data = await response.json();

        if (data.success) {

            resultBox.innerHTML = `
    <div style="padding:10px; border:1px solid #ccc; border-radius:8px; margin-top:10px;">
        <p><strong>Generated translation:</strong> ${data.generated_translation}</p>
        <p><strong>Source:</strong> ${data.source}</p>
    </div>
`;

            if (!translationEl.value.trim()) {
                translationEl.value = data.generated_translation;
            }
        } else {
            resultBox.innerHTML = `<p>${data.error || "Could not generate translation."}</p>`;
        }
    } catch (error) {
        console.error("Translation generation error:", error);
        resultBox.innerHTML = "<p>Could not generate translation.</p>";
    }
}