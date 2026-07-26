import React, { useState, useEffect } from 'react';
import { supabase } from '../../shared/supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Button, Field, Input, Panel, PanelBody, PanelHeader, PanelTitle, PanelDescription } from '../../shared/ui';

function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin');
      }
    };
    checkSession();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        // El error va al formulario y no solo al toast: un toast se va solo a
        // los pocos segundos y quien lea con lupa o lector de pantalla se lo
        // pierde entero.
        setError('Email o contraseña incorrectos');
        toast.error(signInError.message || 'Error al iniciar sesión');
        return;
      }

      toast.success('Inicio de sesión correcto');
      navigate('/admin');
    } catch (err) {
      setError('No se pudo conectar. Revisá tu conexión.');
      toast.error('Error en la petición');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-noon p-4 dark:bg-plum-950">
      {/* Mismo fondo que el portfolio público: la grilla y el bloom fucsia. El
          admin es otra sección del sitio, no otra aplicación. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute inset-0 bg-fuchsia-300 opacity-20 blur-[100px]" />

      <Panel className="relative z-10 w-full max-w-md">
        <PanelHeader className="text-center">
          <PanelTitle className="text-2xl">Bienvenido</PanelTitle>
          <PanelDescription>Ingresá tus credenciales para acceder al panel</PanelDescription>
        </PanelHeader>

        <PanelBody>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field label="Email" required>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@ejemplo.com"
                autoComplete="email"
                required
              />
            </Field>

            <Field label="Contraseña" error={error} required>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </Field>

            <Button type="submit" block size="lg" loading={loading}>
              {loading ? 'Ingresando…' : 'Iniciar sesión'}
            </Button>
          </form>
        </PanelBody>
      </Panel>
    </div>
  );
}

export default AdminLogin;
