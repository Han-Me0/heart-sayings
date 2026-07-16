-- =========================================================
-- 003_idiom_suggestions.sql
-- Creates the user-suggestion table and its concept foreign key.
-- MySQL 8+. Safe to run more than once.
-- =========================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS idiom_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    language VARCHAR(255) NOT NULL,
    idiom VARCHAR(255) NOT NULL,
    meaning VARCHAR(255) NOT NULL,
    idiom_translation VARCHAR(255) NULL,
    meaning_translation VARCHAR(255) NULL,
    concept_id INT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    submitted_by_name VARCHAR(255) NULL,
    submitted_by_email VARCHAR(255) NULL,
    notify_user BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

ALTER TABLE idiom_suggestions
    CONVERT TO CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

DROP PROCEDURE IF EXISTS add_suggestions_concept_foreign_key;

DELIMITER $$

CREATE PROCEDURE add_suggestions_concept_foreign_key()
BEGIN
    UPDATE idiom_suggestions AS s
    LEFT JOIN concepts AS c ON s.concept_id = c.id
    SET s.concept_id = NULL
    WHERE s.concept_id IS NOT NULL
      AND c.id IS NULL;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'idiom_suggestions'
          AND COLUMN_NAME = 'concept_id'
          AND REFERENCED_TABLE_NAME = 'concepts'
          AND REFERENCED_COLUMN_NAME = 'id'
    ) THEN
        ALTER TABLE idiom_suggestions
            ADD CONSTRAINT fk_idiom_suggestions_concepts
            FOREIGN KEY (concept_id)
            REFERENCES concepts(id)
            ON DELETE SET NULL
            ON UPDATE CASCADE;
    END IF;
END$$

DELIMITER ;

CALL add_suggestions_concept_foreign_key();
DROP PROCEDURE add_suggestions_concept_foreign_key;