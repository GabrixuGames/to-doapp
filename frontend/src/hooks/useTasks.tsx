
import { useState, useEffect } from 'react';
import { Task, TaskFilter } from '@/types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');

  // Datos de ejemplo
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Completar proyecto React',
        description: 'Finalizar la aplicación de tareas con todas las funcionalidades',
        completed: false,
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date('2024-06-01'),
      },
      {
        id: '2',
        title: 'Revisar documentación',
        description: 'Leer la documentación de Supabase para la integración',
        completed: true,
        createdAt: new Date('2024-05-30'),
        updatedAt: new Date('2024-06-02'),
      },
      {
        id: '3',
        title: 'Configurar base de datos',
        description: 'Conectar con Supabase y configurar las tablas necesarias',
        completed: false,
        createdAt: new Date('2024-06-03'),
        updatedAt: new Date('2024-06-03'),
      },
    ];
    setTasks(sampleTasks);
  }, []);

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    updateTask(id, { completed: !tasks.find(t => t.id === id)?.completed });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
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
      pending: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
    }
  };
};
