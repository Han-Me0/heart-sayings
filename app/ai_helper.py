import os
from openai import OpenAI


def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        return None

    return OpenAI(api_key=api_key)


def call_openai(prompt: str):
    client = get_openai_client()

    if not client:
        return {
            "source": "fallback",
            "text": "",
            "error": "OPENAI_API_KEY is not configured."
        }

    try:
        response = client.responses.create(
            model="gpt-4.1-mini",
            input=prompt
        )

        text = getattr(response, "output_text", "").strip()

        return {
            "source": "api",
            "text": text,
            "error": None
        }

    except Exception as e:
        print("OpenAI request failed:", e)

        return {
            "source": "fallback",
            "text": "",
            "error": str(e)
        }


def suggest_concept_from_text(idiom: str, meaning: str):
    text = f"{idiom} {meaning}".lower().strip()

    concept_rules = {
        "Kind-hearted": {
            "keywords": ["kind", "generous", "good", "compassion", "helpful", "caring", "selfless"],
            "reason": "The idiom suggests kindness, care, or compassion."
        },
        "Emotion / strong feelings": {
            "keywords": ["emotion", "feeling", "love", "sad", "shock", "heartbroken", "moved", "grief", "pain"],
            "reason": "The idiom expresses strong emotions or emotional reaction."
        },
        "Honesty / openness": {
            "keywords": ["honest", "truth", "open", "sincere", "frank", "confess", "direct"],
            "reason": "The idiom is about honesty, sincerity, or speaking openly."
        },
        "Fear / nervousness": {
            "keywords": ["fear", "nervous", "scared", "afraid", "anxious", "panic", "terrified"],
            "reason": "The idiom relates to fear, tension, or nervousness."
        },
    }

    scores = {}

    for concept, data in concept_rules.items():
        scores[concept] = sum(1 for keyword in data["keywords"] if keyword in text)

    idiom_lower = idiom.lower()

    if "heart of gold" in idiom_lower or "all heart" in idiom_lower:
        scores["Kind-hearted"] += 3

    if "open your heart" in idiom_lower or "bare your heart" in idiom_lower:
        scores["Honesty / openness"] += 3

    if "heart in your mouth" in idiom_lower:
        scores["Fear / nervousness"] += 3

    if "broken heart" in idiom_lower or "my heart bleeds" in idiom_lower:
        scores["Emotion / strong feelings"] += 3

    best_concept = max(scores, key=scores.get)
    best_score = scores[best_concept]

    if best_score == 0:
        return {
            "suggested_concept": "Emotion / strong feelings",
            "confidence": 0.35,
            "reason": "No exact rule matched, so a general heart-related emotional concept was suggested.",
            "source": "rules"
        }

    return {
        "suggested_concept": best_concept,
        "confidence": round(min(0.45 + best_score * 0.12, 0.95), 2),
        "reason": concept_rules[best_concept]["reason"],
        "source": "rules"
    }


def generate_meaning_with_llm(idiom: str, language: str = "", idiom_translation: str = ""):
    prompt = f"""
You are helping an idiom database admin.

Task:
Generate a short, clear draft meaning for a submitted idiom.

Idiom: {idiom}
Language: {language}
Literal translation: {idiom_translation}

Instructions:
- Write the generated meaning in this exact language: {language}.
- Do not use English unless the language field is empty or English.
- Write 1 or 2 short sentences.
- Explain the figurative meaning, not only the literal meaning.
- If the idiom is unclear or possibly not a standard idiom, say that cautiously.
- Be concise and neutral.
"""

    result = call_openai(prompt)

    if result["text"]:
        return {
            "source": result["source"],
            "generated_meaning": result["text"]
        }

    return {
        "source": "fallback",
        "generated_meaning": f"Could not generate a draft meaning for '{idiom}' at this time."
    }


def generate_translation_with_llm(text: str, target_language: str = "English"):
    prompt = f"""
Translate this idiom-related text into {target_language}.

Text:
{text}

Rules:
- Keep it short and clear.
- If it is an idiom, translate the meaning naturally, not word by word.
"""

    result = call_openai(prompt)

    if result["text"]:
        return {
            "source": result["source"],
            "generated_translation": result["text"]
        }

    return {
        "source": "fallback",
        "generated_translation": "Translation could not be generated at this time."
    }