import React, { useState } from 'react';
import { supabase } from '../../shared/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CreateProjectForm from './admin/CreateProjectForm';

import ProjectList from './admin/ProjectList';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('projects'); // 'projects', 'create-project', 'edit-project', 'messages', 'analytics', 'settings'
  const [projectToEdit, setProjectToEdit] = useState(null);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message || 'Error al cerrar sesión');
    } else {
      toast.success('Sesión cerrada');
      navigate('/admin/login');
    }
  };

  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setActiveView('edit-project');
  };

  const handleProjectSuccess = () => {
    setActiveView('projects');
    setProjectToEdit(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Admin Panel</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Button
            variant={activeView === 'projects' || activeView === 'create-project' || activeView === 'edit-project' ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveView('projects')}
          >
            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Proyectos
          </Button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Admin</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@ejemplo.com</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-900"
            onClick={handleSignOut}
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              {activeView === 'projects' && 'Gestionar Proyectos'}
              {activeView === 'create-project' && 'Crear Proyecto'}
              {activeView === 'edit-project' && 'Editar Proyecto'}
            </h1>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@ejemplo.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configuración</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {activeView === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setProjectToEdit(null);
                    setActiveView('create-project');
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Nuevo Proyecto
                </Button>
              </div>
              <ProjectList onEdit={handleEditProject} />
            </div>
          )}
          {activeView === 'create-project' && (
            <CreateProjectForm
              onSuccess={handleProjectSuccess}
            />
          )}
          {activeView === 'edit-project' && (
            <CreateProjectForm
              initialData={projectToEdit}
              onSuccess={handleProjectSuccess}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
