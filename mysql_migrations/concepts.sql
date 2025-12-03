-- 1) Create table: concepts
CREATE TABLE IF NOT EXISTS concepts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(225) NOT NULL
) DEFAULT CHARSET = utf8mb4;

-- 2) Add column concept_id to idioms (nullable for now during migration)
ALTER TABLE idioms
ADD COLUMN concept_id INT NULL;

-- 3) Add foreign key constraint (links idioms -> concepts)
ALTER TABLE idioms
ADD CONSTRAINT fk_idioms_concepts FOREIGN KEY (concept_id) REFERENCES concepts(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

INSERT INTO concepts (description) VALUES
('Kind-hearted'),
('Emotion / strong feelings'),
('Honesty / openness'),
('Fear / nervousness');

-- Kind hearted
UPDATE idioms
SET concept_id = 1
WHERE idiom IN ('Heart of gold', 'Ein Herz aus Gold', 'All heart', 'Das Herz am rechten Fleck haben', 'Hjärtat på rätt ställe', 'Велике серце')

-- Honesty / openness
UPDATE idioms
SET concept_id = 2
WHERE idiom In ('Open your heart', 'Bare your heart', 'Handen på hjärtat', 'Hand aufs Herz!', 'Відкрите серце')

UPDATE idioms
SET concept_id = 1
WHERE idiom IN (
  'Heart of gold',
  'All heart',
  'Hjärtat på rätt ställe',
  'Skänka någon sitt hjärta',
  'Велике серце',
  'Mати Бога в серці',
  'Das Herz am rechten Fleck haben',
  'Ein Herz und eine Seele'
);

UPDATE idioms
SET concept_id = 2
WHERE idiom IN (
  'My heart bleeds',
  'Broken heart',
  'Warm the cockles of your heart',
  'From the bottom of your heart',
  'Bli varm om hjärtat',
  'Ha ett brustet hjärta',
  'Herzzerreißend sein oder Jemandem das Herz zerreißen',
  'Серце крається',
  'Кам’яне серце',
  'Тане серце'
);

UPDATE idioms
SET concept_id = 3
WHERE idiom IN (
  'Open your heart',
  'Bare your heart',
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
SET concept_id = 4
WHERE idiom IN (
  'Heart in your mouth',
  'Heart in your boots',
  'Med hjärtat i halsgropen',
  'Jemandem fällt ein Stein vom Herzen',
  'Скрипіти серцем'
);
