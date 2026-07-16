-- =========================================================
-- 002_concepts.sql
-- Creates the concepts table, adds idioms.concept_id,
-- seeds the six plain-text concepts, assigns idioms,
-- and adds the foreign key.
-- MySQL 8+. Safe to run more than once.
-- =========================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS concepts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(225) NOT NULL,
    CONSTRAINT uq_concepts_description UNIQUE (description)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

ALTER TABLE concepts
    CONVERT TO CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

DROP PROCEDURE IF EXISTS migrate_concepts_table;

DELIMITER $$

CREATE PROCEDURE migrate_concepts_table()
BEGIN
    /* Add the concept reference to older idioms tables. */
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'idioms'
          AND COLUMN_NAME = 'concept_id'
    ) THEN
        ALTER TABLE idioms
            ADD COLUMN concept_id INT NULL;
    END IF;

    /* Remove duplicate plain-text descriptions before adding the index. */
    DELETE duplicate_row
    FROM concepts AS duplicate_row
    JOIN concepts AS keep_row
      ON duplicate_row.description = keep_row.description
     AND duplicate_row.id > keep_row.id;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'concepts'
          AND INDEX_NAME = 'uq_concepts_description'
    ) THEN
        ALTER TABLE concepts
            ADD CONSTRAINT uq_concepts_description
            UNIQUE (description);
    END IF;
END$$

DELIMITER ;

CALL migrate_concepts_table();
DROP PROCEDURE migrate_concepts_table;

INSERT INTO concepts (description)
VALUES
    ('Kind-hearted'),
    ('Emotion / Strong feelings'),
    ('Honesty / Openness'),
    ('Fear / Nervousness'),
    ('Disinterest / Boredom'),
    ('Sadness / Melancholy')
ON DUPLICATE KEY UPDATE
    description = VALUES(description);

SET @kind_id := (
    SELECT id FROM concepts
    WHERE description = 'Kind-hearted'
    LIMIT 1
);

SET @emotion_id := (
    SELECT id FROM concepts
    WHERE description = 'Emotion / Strong feelings'
    LIMIT 1
);

SET @honesty_id := (
    SELECT id FROM concepts
    WHERE description = 'Honesty / Openness'
    LIMIT 1
);

SET @fear_id := (
    SELECT id FROM concepts
    WHERE description = 'Fear / Nervousness'
    LIMIT 1
);

SET @disinterest_id := (
    SELECT id FROM concepts
    WHERE description = 'Disinterest / Boredom'
    LIMIT 1
);

SET @sadness_id := (
    SELECT id FROM concepts
    WHERE description = 'Sadness / Melancholy'
    LIMIT 1
);

UPDATE idioms
SET concept_id = @kind_id
WHERE idiom IN (
    'Heart of gold',
    'Heart in the right place',
    'All heart',
    'Hjärtat på rätt ställe',
    'Skänka någon sitt hjärta',
    'Велике серце',
    'Мати Бога в серці',
    'Das Herz am rechten Fleck haben',
    'Ein Herz und eine Seele'
);

UPDATE idioms
SET concept_id = @emotion_id
WHERE idiom IN (
    'My heart bleeds',
    'Warm the cockles of your heart',
    'From the bottom of your heart',
    'Bli varm om hjärtat',
    'Тане серце',
    'Change of heart',
    'Absence makes the heart grow fonder',
    'Heart misses a beat',
    'My heart goes out to someone'
);

UPDATE idioms
SET concept_id = @honesty_id
WHERE idiom IN (
    'Open your heart',
    'Bare your heart',
    'Put your hand on your heart',
    'Hand on heart',
    'Handen på hjärtat',
    'Hand aufs Herz!',
    'Komma från hjärtat',
    'Aus seinem Herzen keine Mördergrube machen',
    'Das Herz auf der Zunge tragen',
    'Відкрите серце',
    'Покласти руку на серце'
);

UPDATE idioms
SET concept_id = @fear_id
WHERE idiom IN (
    'Heart in your mouth',
    'Med hjärtat i halsgropen'
);

UPDATE idioms
SET concept_id = @disinterest_id
WHERE idiom IN (
    'Heart is not in it',
    'Eat your heart out',
    'Скрипіти серцем'
);

UPDATE idioms
SET concept_id = @sadness_id
WHERE idiom IN (
    'Heart in your boots',
    'Broken heart',
    'Ha ett brustet hjärta',
    'Krossa någons hjärta',
    'Herzzerreißend sein oder Jemandem das Herz zerreißen',
    'Серце крається',
    'Кам’яне серце',
    'Нести тягар на серці',
    'قلبٌ من حجر'
);

DROP PROCEDURE IF EXISTS add_idioms_concept_foreign_key;

DELIMITER $$

CREATE PROCEDURE add_idioms_concept_foreign_key()
BEGIN
    /* Clear invalid references before creating the foreign key. */
    UPDATE idioms AS i
    LEFT JOIN concepts AS c ON i.concept_id = c.id
    SET i.concept_id = NULL
    WHERE i.concept_id IS NOT NULL
      AND c.id IS NULL;

    /* Check by referenced table/column, not only by constraint name. */
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'idioms'
          AND COLUMN_NAME = 'concept_id'
          AND REFERENCED_TABLE_NAME = 'concepts'
          AND REFERENCED_COLUMN_NAME = 'id'
    ) THEN
        ALTER TABLE idioms
            ADD CONSTRAINT fk_idioms_concepts
            FOREIGN KEY (concept_id)
            REFERENCES concepts(id)
            ON DELETE SET NULL
            ON UPDATE CASCADE;
    END IF;
END$$

DELIMITER ;

CALL add_idioms_concept_foreign_key();
DROP PROCEDURE add_idioms_concept_foreign_key;