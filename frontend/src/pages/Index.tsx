
import { useState } from 'react';
import { User } from '@/types/task';
import AuthForm from '@/components/AuthForm';
import TaskDashboard from '@/components/TaskDashboard';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleLogin = (email: string, password: string) => {
    // Simulación de login - en producción usarías autenticación real con Supabase
    console.log('Login attempt:', { email, password });
    
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
    };
    
    setUser(mockUser);
    toast({
      title: "¡Bienvenido!",
      description: `Has iniciado sesión correctamente, ${mockUser.name}.`,
    });
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Simulación de registro - en producción usarías autenticación real con Supabase
    console.log('Register attempt:', { name, email, password });
    
    const mockUser: User = {
      id: '1',
      email,
      name,
    };
    
    setUser(mockUser);
    toast({
      title: "¡Cuenta creada!",
      description: `Bienvenido a TaskFlow, ${name}.`,
    });
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
