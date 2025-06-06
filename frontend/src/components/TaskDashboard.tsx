
import { User, TaskFilter } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

interface TaskDashboardProps {
  user: User;
  onLogout: () => void;
}

const TaskDashboard = ({ user, onLogout }: TaskDashboardProps) => {
  const {
    tasks,
    filter,
    setFilter,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    tasksCount
  } = useTasks(user.id);

  const filterButtons: { key: TaskFilter; label: string; color: string }[] = [
    { key: 'all', label: 'Todas', color: 'bg-gray-100 text-gray-800' },
    { key: 'pending', label: 'Pendientes', color: 'bg-orange-100 text-orange-800' },
    { key: 'completed', label: 'Completadas', color: 'bg-green-100 text-green-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">¡Hola, {user.name}!</span>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="transition-all duration-200 hover:scale-105"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tareas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{tasksCount.all}</div>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{tasksCount.pending}</div>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{tasksCount.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterButtons.map(({ key, label, color }) => (
              <Badge
                key={key}
                variant={filter === key ? "default" : "secondary"}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  filter === key ? 'bg-blue-600 text-white' : color
                }`}
                onClick={() => setFilter(key)}
              >
                {label} ({key === 'all' ? tasksCount.all : key === 'pending' ? tasksCount.pending : tasksCount.completed})
              </Badge>
            ))}
          </div>
          
          <TaskForm onAddTask={addTask} />
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'all' 
                    ? 'No tienes tareas aún' 
                    : filter === 'pending' 
                    ? 'No tienes tareas pendientes' 
                    : 'No tienes tareas completadas'
                  }
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? '¡Comienza creando tu primera tarea!' 
                    : filter === 'pending' 
                    ? '¡Excelente trabajo! Todas tus tareas están completadas.' 
                    : 'Completa algunas tareas para verlas aquí.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskComplete}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
