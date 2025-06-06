
import { useState } from 'react';
import { User } from '@/types/task';
import AuthForm from '@/components/AuthForm';
import TaskDashboard from '@/components/TaskDashboard';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

const handleLogin = async (email: string, password: string) => {
  try {
    const res = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      const mockUser: User = {
        id: String(data.user_id),
        email,
        name: email.split('@')[0],
      };
      setUser(mockUser);
      toast({ title: '¡Bienvenido!', description: `Has iniciado sesión, ${mockUser.name}.` });
    } else {
      toast({ title: 'Error al iniciar sesión', description: data.message || 'Credenciales inválidas' });
    }
  } catch (error) {
    toast({ title: 'Error de red', description: 'No se pudo conectar con el servidor.' });
  }
};

const handleRegister = async (name: string, email: string, password: string) => {
  try {
    const res = await fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name,  email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      const mockUser: User = {
        id: String(data.user_id),
        email,
        name,
      };
      setUser(mockUser);
      toast({ title: '¡Cuenta creada!', description: `Bienvenido a TaskFlow, ${name}.` });
    } else {
      toast({ title: 'Error al registrarse', description: data.message || 'Error desconocido.' });
    }
  } catch (error) {
    toast({ title: 'Error de red', description: 'No se pudo conectar con el servidor.' });
  }
};


  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  if (!user) {
    return <AuthForm onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return <TaskDashboard user={user} onLogout={handleLogout} />;
};

export default Index;
