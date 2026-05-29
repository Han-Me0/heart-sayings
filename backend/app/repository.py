from flask_mysqldb import MySQL

# SQL initialisation
repo = MySQL()

# Select all idioms from database
def get_all_ideoms():
    cur = repo.connection.cursor()
    cur.execute("""
        SELECT DISTINCT
                TRIM(i.language) AS language,
                i.idiom,
                i.meaning,
                i.idiom_translation,
                i.meaning_translation,
                i.concept_id,
                c.description AS concept_description
        FROM idioms i
        LEFT JOIN concepts c 
            ON i.concept_id = c.id
        WHERE i.language IS NOT NULL
            AND TRIM(i.language) <> ''
""")
    rows = cur.fetchall()
    data = to_map(rows)
    return data

# edited so there will be no duplicate
def get_all_concepts():
    cur = repo.connection.cursor()
    cur.execute("""
        SELECT id, description
        FROM concepts
        ORDER BY id
    """)
    rows = cur.fetchall()

    seen = set()
    result = []

    for r in rows:
        desc = (r[1] or "").strip()
        if desc not in seen:
            seen.add(desc)
            result.append({"id": r[0], "description": desc})

    return result


# ----------- suggestion ------------


def insert_suggestion(
    language,
    idiom,
    meaning,
    idiom_translation,
    meaning_translation,
    concept_id=None,
    submitted_by_name=None,
    submitted_by_email=None,
    notify_user=False
):
    """
    Insert a new user-submitted idiom suggestion into the database.
    """
    cur = repo.connection.cursor()
    cur.execute("""
    INSERT INTO idiom_suggestions 
    (
        language,
        idiom,
        meaning,
        idiom_translation,
        meaning_translation,
        concept_id,
        submitted_by_name,
        submitted_by_email,
        notify_user
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
""", (
    language,
    idiom,
    meaning,
    idiom_translation,
    meaning_translation,
    concept_id,
    submitted_by_name,
    submitted_by_email,
    notify_user
))
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

def get_concept_id_by_description(description):
    cur = repo.connection.cursor()

    cur.execute("""
        SELECT id
        FROM concepts
        WHERE LOWER(TRIM(description)) = LOWER(TRIM(%s))
        LIMIT 1
    """, (description,))

    row = cur.fetchone()

    if row:
        return row[0]

    return None

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
            s.submitted_by_name,
            s.submitted_by_email,
            s.notify_user,
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

    cur.execute("""
        SELECT 
            language,
            idiom,
            meaning,
            idiom_translation,
            meaning_translation,
            concept_id,
            submitted_by_name,
            submitted_by_email,
            notify_user
        FROM idiom_suggestions
        WHERE id = %s
    """, (id,))

    row = cur.fetchone()

    if not row:
        return

    language = row[0]
    idiom = row[1]
    meaning = row[2]
    idiom_translation = row[3]
    meaning_translation = row[4]
    concept_id = row[5]

    cur.execute("""
        SELECT COUNT(*)
        FROM idioms
        WHERE language = %s
        AND idiom = %s
    """, (language, idiom))

    count_existing = cur.fetchone()[0]

    if count_existing == 0:
        cur.execute("""
            INSERT INTO idioms
            (language, idiom, meaning, idiom_translation, meaning_translation, concept_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            language,
            idiom,
            meaning,
            idiom_translation,
            meaning_translation,
            concept_id
        ))

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
