import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../shared/supabaseClient';
import { FullPageLoader } from '../../shared/ui/Loader';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (!mounted) return;
      if (!session) {
        navigate('/admin/login');
      } else {
        setLoading(false);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/admin/login');
    });

    return () => {
      mounted = false;
      try {
        listener?.subscription?.unsubscribe?.();
      } catch (e) {
        // ignore
      }
    };
  }, [navigate]);

  if (loading) {
    return <FullPageLoader label="Verificando sesión" />;
  }

  return children;
}

export default ProtectedRoute;
