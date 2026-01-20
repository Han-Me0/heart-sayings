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
