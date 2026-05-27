CREATE TABLE idiom_suggestions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  language VARCHAR(255) NOT NULL,
  idiom VARCHAR(255) NOT NULL,
  meaning VARCHAR(255) NOT NULL,
  idiom_translation VARCHAR(255),
  meaning_translation VARCHAR(255),
  concept_id INT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- clean invalid concept references before adding FK
UPDATE idiom_suggestions s
LEFT JOIN concepts c ON s.concept_id = c.id
SET s.concept_id = NULL
WHERE s.concept_id IS NOT NULL
AND c.id IS NULL;

ALTER TABLE idiom_suggestions
ADD CONSTRAINT fk_idiom_suggestions_concepts
FOREIGN KEY (concept_id)
REFERENCES concepts(id)
ON DELETE SET NULL
ON UPDATE CASCADE;