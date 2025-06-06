from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection

bp_auth = Blueprint("auth", __name__, url_prefix="/auth")

@bp_auth.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")  # Será usermail en la base de datos
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email y contraseña son obligatorios"}), 400

    hashed_password = generate_password_hash(password)

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (username, usermail, password) VALUES (%s, %s, %s) RETURNING id",
            (username, email, hashed_password)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Usuario registrado", "user_id": user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@bp_auth.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, password FROM users WHERE usermail = %s", (email,))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        user_id, hashed_password = user
        if check_password_hash(hashed_password, password):
            return jsonify({"message": "Login exitoso", "user_id": user_id})
        else:
            return jsonify({"error": "Contraseña incorrecta"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
