from flask_mysqldb import MySQL

# SQL initialisation
repo = MySQL()

# Select all idiooms from database
def get_all_ideoms():
    cur = repo.connection.cursor()
    cur.execute('''SELECT * FROM idioms''')
    rows = cur.fetchall()
    data = to_map(rows)
    return data

# Convert raw data from a database to a map
def to_map(raw_idioms):
    result = []

    for row in raw_idioms:
        result.append({
            "language": row[0],
            "idiom": row[1],
            "meaning": row[2],
            "idiom_translation": row[3],
            "meaning_translation": row[4]
        })
    return result