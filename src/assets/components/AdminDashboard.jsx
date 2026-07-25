import React, { useState, useEffect } from 'react';
import { supabase } from '../../shared/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  Avatar,
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuLabel,
  MenuSeparator,
} from '../../shared/ui';

import CreateProjectForm from './admin/CreateProjectForm';
import ProjectList from './admin/ProjectList';

const VIEWS = {
  projects: 'Gestionar proyectos',
  'create-project': 'Crear proyecto',
  'edit-project': 'Editar proyecto',
};

function FolderIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="5" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="12" cy="19" r="1.75" />
    </svg>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('projects');
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // El email estaba hardcodeado como admin@ejemplo.com. Sale de la sesión.
    supabase.auth.getUser().then(({ data }) => setEmail(data?.user?.email || ''));
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message || 'Error al cerrar sesión');
      return;
    }
    toast.success('Sesión cerrada');
    navigate('/admin/login');
  };

  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setActiveView('edit-project');
  };

  const handleProjectSuccess = () => {
    setActiveView('projects');
    setProjectToEdit(null);
  };

  const isProjectsSection = activeView.includes('project');
  const initials = email ? email.slice(0, 2).toUpperCase() : 'AD';

  return (
    <div className="flex min-h-screen bg-noon dark:bg-plum-950">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-plum-200/70 bg-white dark:border-plum-800 dark:bg-plum-900 md:flex">
        <div className="border-b border-plum-100 p-6 dark:border-plum-800">
          <div className="flex items-center gap-3">
            <Avatar initials="J" />
            <div>
              <p className="font-display text-base font-bold text-plum-900 dark:text-plum-50">
                Panel
              </p>
              <p className="text-xs text-plum-500 dark:text-plum-300/70">josecito.dev</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <Button
            variant={isProjectsSection ? 'secondary' : 'ghost'}
            block
            className="justify-start"
            onClick={() => setActiveView('projects')}
          >
            <FolderIcon />
            Proyectos
          </Button>
        </nav>

        <div className="border-t border-plum-100 p-4 dark:border-plum-800">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-plum-50 p-2 dark:bg-plum-800/60">
            <Avatar initials={initials} size="sm" />
            <p className="min-w-0 flex-1 truncate text-xs text-plum-600 dark:text-plum-200">
              {email || '—'}
            </p>
          </div>
          <Button variant="danger" block className="justify-start" onClick={handleSignOut}>
            Cerrar sesión
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-plum-200/70 bg-white px-6 py-4 dark:border-plum-800 dark:bg-plum-900">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-lg font-bold tracking-tight text-plum-900 dark:text-plum-50">
              {VIEWS[activeView]}
            </h1>

            <Menu>
              <MenuTrigger label="Menú de cuenta">
                <DotsIcon />
              </MenuTrigger>
              <MenuList>
                <MenuLabel>{email || 'Cuenta'}</MenuLabel>
                <MenuSeparator />
                <MenuItem danger onSelect={handleSignOut}>
                  Cerrar sesión
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </header>

        <main className="flex-1 p-6">
          {activeView === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setProjectToEdit(null);
                    setActiveView('create-project');
                  }}
                >
                  Nuevo proyecto
                </Button>
              </div>
              <ProjectList onEdit={handleEditProject} />
            </div>
          )}

          {activeView === 'create-project' && (
            <CreateProjectForm onSuccess={handleProjectSuccess} />
          )}

          {activeView === 'edit-project' && (
            <CreateProjectForm initialData={projectToEdit} onSuccess={handleProjectSuccess} />
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
