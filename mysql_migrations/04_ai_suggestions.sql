-- =========================================================
-- 004_ai_suggestions.sql
-- Creates the AI suggestion metadata table and its foreign key.
-- MySQL 8+. Safe to run more than once.
-- =========================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS ai_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    suggestion_id INT NULL,
    suggested_concept VARCHAR(255) NULL,
    ai_translation VARCHAR(255) NULL,
    ai_meaning TEXT NULL,
    provider ENUM('semantic_rules', 'openai_llm', 'rasa') NOT NULL,
    confidence DECIMAL(5,2) NULL,
    explanation TEXT NULL,
    fallback_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

ALTER TABLE ai_suggestions
    CONVERT TO CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

DROP PROCEDURE IF EXISTS add_ai_suggestions_foreign_key;

DELIMITER $$

CREATE PROCEDURE add_ai_suggestions_foreign_key()
BEGIN
    UPDATE ai_suggestions AS a
    LEFT JOIN idiom_suggestions AS s ON a.suggestion_id = s.id
    SET a.suggestion_id = NULL
    WHERE a.suggestion_id IS NOT NULL
      AND s.id IS NULL;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'ai_suggestions'
          AND COLUMN_NAME = 'suggestion_id'
          AND REFERENCED_TABLE_NAME = 'idiom_suggestions'
          AND REFERENCED_COLUMN_NAME = 'id'
    ) THEN
        ALTER TABLE ai_suggestions
            ADD CONSTRAINT fk_ai_suggestions_idiom_suggestions
            FOREIGN KEY (suggestion_id)
            REFERENCES idiom_suggestions(id)
            ON DELETE SET NULL
            ON UPDATE CASCADE;
    END IF;
END$$

DELIMITER ;

CALL add_ai_suggestions_foreign_key();
DROP PROCEDURE add_ai_suggestions_foreign_key;