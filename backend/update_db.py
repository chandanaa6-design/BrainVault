import sqlite3

conn = sqlite3.connect("brainvault.db")
cursor = conn.cursor()

try:
    cursor.execute("""
        ALTER TABLE flashcards
        ADD COLUMN question_type TEXT DEFAULT 'markdown'
    """)
    print("✅ question_type added")
except Exception as e:
    print(e)

try:
    cursor.execute("""
        ALTER TABLE flashcards
        ADD COLUMN answer_type TEXT DEFAULT 'markdown'
    """)
    print("✅ answer_type added")
except Exception as e:
    print(e)

conn.commit()
conn.close()

print("✅ Database updated successfully.")
