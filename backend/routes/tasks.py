from flask import Blueprint

bp = Blueprint("tasks", __name__, url_prefix="/tasks")
from flask import Blueprint, request, jsonify
from db import get_connection

bp = Blueprint("tasks", __name__, url_prefix="/tasks")

@bp.route("/", methods=["POST"])
def create_task():
    data = request.json
    user_id = data.get("user_id")
    title = data.get("title")
    description = data.get("description", "")

    if not user_id or not title:
        return jsonify({"error": "user_id y title son obligatorios"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO tasks (user_id, title, description) VALUES (%s, %s, %s) RETURNING id",
            (user_id, title, description)
        )
        task_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Tarea creada", "task_id": task_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/<int:user_id>", methods=["GET"])
def get_tasks(user_id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, title, description, completed, created_at FROM tasks WHERE user_id = %s",
            (user_id,)
        )
        tasks = cur.fetchall()
        cur.close()
        conn.close()

        tasks_list = [
            {
                "id": t[0],
                "title": t[1],
                "description": t[2],
                "completed": t[3],
                "created_at": t[4].isoformat()
            } for t in tasks
        ]

        return jsonify(tasks_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route("/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    completed = data.get('completed')

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            UPDATE tasks
            SET title = %s, description = %s, completed = %s
            WHERE id = %s
        """, (title, description, completed, task_id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Tarea actualizada"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Verificamos si la tarea existe
        cur.execute("SELECT id FROM tasks WHERE id = %s", (task_id,))
        task = cur.fetchone()
        if not task:
            cur.close()
            conn.close()
            return jsonify({"error": "Tarea no encontrada"}), 404

        # Eliminamos la tarea
        cur.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Tarea eliminada"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
