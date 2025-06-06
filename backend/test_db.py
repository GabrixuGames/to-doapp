from db import get_connection

try:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()
    print("Conexión OK, versión PostgreSQL:", version)
    cur.close()
    conn.close()
except Exception as e:
    print("Error al conectar:", e)
