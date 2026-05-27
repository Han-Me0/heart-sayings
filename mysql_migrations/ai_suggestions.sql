CREATE TABLE IF NOT EXISTS ai_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    suggestion_id INT NULL,
    suggested_concept VARCHAR(255),
    ai_translation VARCHAR(255),
    ai_meaning TEXT,
    provider ENUM('semantic_rules', 'openai_llm', 'rasa') NOT NULL,
    confidence DECIMAL(5,2),
    explanation TEXT,
    fallback_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (suggestion_id)
        REFERENCES idiom_suggestions(id)
        ON DELETE SET NULL
);