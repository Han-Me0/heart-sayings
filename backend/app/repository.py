from flask_mysqldb import MySQL

# SQL initialisation
repo = MySQL()

# Select all idioms from database
def get_all_ideoms():
    cur = repo.connection.cursor()
    cur.execute('''
SELECT
                i.language,
                i.idiom,
                i.meaning,
                i.idiom_translation,
                i.meaning_translation,
                i.concept_id,
                c.description AS concept_description FROM idioms i LEFT JOIN concepts c ON i.concept_id = c.id
''')
    rows = cur.fetchall()
    data = to_map(rows)
    return data


def get_all_concepts():
    cur = repo.connection.cursor()
    cur.execute("SELECT id, description FROM concepts ORDER BY id")
    rows = cur.fetchall()
    return [{"id": i[0], "description": i[1]} for i in rows]


# ----------- suggestion ------------


def insert_suggestion(language, idiom, meaning, idiom_translation, meaning_translation, concept_id=None):
    """
    Insert a new user-submitted idiom suggestion into the database.
    """
    cur = repo.connection.cursor()
    cur.execute("""
        INSERT INTO idiom_suggestions 
        (language, idiom, meaning, idiom_translation, meaning_translation, concept_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (language, idiom, meaning, idiom_translation, meaning_translation, concept_id))
    repo.connection.commit()

# Get a sorted list of all unique languages stored in the idioms table, ignoring empty or NULL values.
def get_languages():
    cur = repo.connection.cursor()
    cur.execute("""
        SELECT DISTINCT language 
                FROM(
                SELECT TRIM(language) AS language
                FROM idioms
                WHERE language IS NOT NULL
                ) t
                WHERE language <> ''
                ORDER BY language
                """)
    rows = cur.fetchall()
    return [r[0] for r in rows]

# ----------- helper mapping ----------
# Convert raw data from a database to a map
def to_map(raw_idioms):
    result = []

    for row in raw_idioms:
        result.append({
            "language": row[0],
            "idiom": row[1],
            "meaning": row[2],
            "idiom_translation": row[3],
            "meaning_translation": row[4],
            "concept_id": row[5],
            "concept_description": row[6]
        })
    return result

def get_pending_suggestions():
    cur = repo.connection.cursor()
    cur.execute("""
        SELECT 
            s.id,
            s.language,
            s.idiom,
            s.meaning,
            s.idiom_translation,
            s.meaning_translation,
            s.concept_id,
            s.status,
            s.created_at,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM idioms i
                    WHERE i.language = s.language
                    AND i.idiom = s.idiom
                ) THEN 1
                ELSE 0
            END AS is_duplicate
        FROM idiom_suggestions s
        WHERE s.status = 'pending'
        ORDER BY s.created_at DESC
    """)
    return cur.fetchall()


def approve_suggestion(id):
    cur = repo.connection.cursor()

    # 1) Get the suggestion row
    cur.execute("""
        SELECT language, idiom, meaning, idiom_translation, meaning_translation, concept_id
        FROM idiom_suggestions
        WHERE id = %s
    """, (id,))
    row = cur.fetchone()

    if not row:
        # no such suggestion, nothing to do
        return

    language, idiom, meaning, idiom_translation, meaning_translation, concept_id = row

    # 2) Check if an idiom with same language + idiom text already exists
    cur.execute("""
        SELECT COUNT(*) 
        FROM idioms
        WHERE language = %s
        AND idiom = %s
    """, (language, idiom))
    (count_existing,) = cur.fetchone()

    # 3) Insert only if no duplicate exists
    if count_existing == 0:
        cur.execute("""
            INSERT INTO idioms (language, idiom, meaning, idiom_translation, meaning_translation, concept_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (language, idiom, meaning, idiom_translation, meaning_translation, concept_id))

    # 4) In any case, mark suggestion as approved
    cur.execute("""
        UPDATE idiom_suggestions
        SET status = 'approved'
        WHERE id = %s
    """, (id,))

    repo.connection.commit()



def reject_suggestion(id):
    cur = repo.connection.cursor()
    cur.execute("UPDATE idiom_suggestions SET status='rejected' WHERE id=%s", (id,))
    repo.connection.commit()
