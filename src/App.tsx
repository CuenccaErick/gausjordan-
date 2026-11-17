import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { User } from './types';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { RoleSelection } from './components/RoleSelection';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { PracticeField } from './components/PracticeField';

type AppView = 'landing' | 'roles' | 'login';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para manejar alumnos invitados sin login
  const [guestUser, setGuestUser] = useState<User | null>(null);

  // Estado para el Campo de Práctica (sin login)
  const [showPracticeField, setShowPracticeField] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
      else setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
      else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
    setIsLoading(false);
  };

  const handleSelectRole = async (role: any) => {
    // CORRECCIÓN: Si el componente devuelve 'StudentDashboard', lo tratamos como 'student'
    const selectedRole = role === 'StudentDashboard' ? 'student' : role;

    if (session?.user) {
      // Flujo para usuario logueado (Profesor o Alumno con cuenta)
      const newProfile = {
        id: session.user.id,
        name: session.user.user_metadata.full_name || 'Usuario',
        email: session.user.email,
        role: selectedRole,
        avatar: session.user.user_metadata.avatar_url
      };

      const { error } = await supabase.from('profiles').upsert([newProfile]);
      if (!error) setProfile(newProfile);
      else alert("Error al guardar perfil: " + error.message);
    } else {
      // FLUJO PARA ESTUDIANTES SIN LOGIN (Invitados)
      if (selectedRole === 'student') {
        const tempStudent: User = {
          id: `guest_${Date.now()}`,
          name: 'Estudiante Invitado',
          email: '',
          role: 'student',
          avatar: `https://ui-avatars.com/api/?name=Estudiante+Invitado&background=indigo&color=fff`
        };
        setGuestUser(tempStudent);
      } else {
        // Si eligió profesor y no hay sesión, al Login de Google
        setCurrentView('login');
      }
    }
  };

  const handleStudentGuestJoin = () => {
    const tempStudent: User = {
      id: `guest_${Date.now()}`,
      name: 'Estudiante Invitado',
      email: '',
      role: 'student',
      avatar: `https://ui-avatars.com/api/?name=Estudiante+Invitado&background=indigo&color=fff`
    };
    setGuestUser(tempStudent);
  };

  const handleLogout = async () => {
    if (session) await supabase.auth.signOut();
    setGuestUser(null);
    setProfile(null);
    setSession(null);
    setCurrentView('landing');
  };

  if (isLoading) return <div className="p-20 text-center">Cargando Academia...</div>;

  // --- RENDERIZADO POR PRIORIDAD ---

  // 0. Prioridad: Campo de Práctica (sin login requerido)
  if (showPracticeField) {
    return <PracticeField onBack={() => setShowPracticeField(false)} />;
  }

  // 1. Prioridad: Si es un estudiante (Invitado o Logueado), va directo a poner su código
  if (guestUser || profile?.role === 'student') {
    return <StudentDashboard user={guestUser || profile!} onLogout={handleLogout} />;
  }

  // 2. Prioridad: Si es profesor logueado, a su Dashboard
  if (profile?.role === 'teacher') {
    return <TeacherDashboard user={profile} onLogout={handleLogout} />;
  }

  // 3. Flujo de navegación para usuarios no identificados
  if (!session && !guestUser) {
    if (currentView === 'landing') {
      return (
        <LandingPage 
          onGetStarted={() => setCurrentView('roles')} 
          onLogin={() => setCurrentView('login')}
          onPractice={() => setShowPracticeField(true)}
          onStudentClick={handleStudentGuestJoin}
        />
      );
    }
    if (currentView === 'roles') {
      return <RoleSelection userName="Invitado" onSelectRole={handleSelectRole} onBack={() => setCurrentView('landing')} />;
    }
    return <Login onBack={() => setCurrentView('landing')} />;
  }

  // 4. Si hay sesión pero el registro de perfil falló o está pendiente
  return <RoleSelection userName={session.user.user_metadata.full_name} onSelectRole={handleSelectRole} />;
}