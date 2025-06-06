import { useState, useEffect } from "react";
import { Task, TaskFilter } from "@/types/task";

const API_BASE = "http://localhost:5000/tasks"; // Cambia esto según donde esté tu backend

export const useTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener tareas al cargar o cambiar userId
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al cargar tareas");
        }
        return res.json();
      })
      .then((data: Task[]) => {
        setTasks(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  // Añadir tarea
  const addTask = (title: string, description: string) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, title, description }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al crear tarea");
        }
        return res.json();
      })
      .then(({ task_id }) => {
        const newTask: Task = {
          id: task_id.toString(),
          title,
          description,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setTasks((prev) => [newTask, ...prev]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Actualizar tarea
  const updateTask = (id: string, updates: Partial<Task>) => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updates.title,
        description: updates.description,
        completed: updates.completed,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al actualizar tarea");
        }
        return res.json();
      })
      .then(() => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date(),
                }
              : task
          )
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Eliminar tarea
  const deleteTask = (id: string) => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al eliminar tarea");
        }
        return res.json();
      })
      .then(() => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Alternar completado
  const toggleTaskComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, { completed: !task.completed });
  };

  // Filtrar tareas según filtro actual
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return {
    tasks: filteredTasks,
    filter,
    setFilter,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    tasksCount: {
      all: tasks.length,
      pending: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    },
    loading,
    error,
  };
};
