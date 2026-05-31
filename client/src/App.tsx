import { Component, ReactNode, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Auth from './components/Auth';
import { Layout } from './components/Layout';
import TheMirrorPage from './components/TheMirror';
import LandingPage from './components/LandingPage';
import './App.css';

interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[App] Runtime error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 text-white">
          <div className="w-full max-w-md rounded-lg bg-zinc-900 p-6 text-center border border-zinc-800">
            <h1 className="text-xl font-bold text-red-400">Erro ao abrir o app</h1>
            <p className="mt-3 text-sm text-zinc-400">Tente atualizar a página ou tente novamente mais tarde.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [session, setSession] = useState<UserSession | null>(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.id) return { user };
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return null;
  });

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <Auth
                onAuthSuccess={({ user }) => {
                  setSession({ user });
                  window.location.replace('/interviews');
                }}
              />
            }
          />
          <Route
            path="/interviews/:scenarioSlug?"
            element={
              session ? (
                <Layout>
                  <TheMirrorPage userId={session.user.id} />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/interview" element={<Navigate to="/interviews" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster theme="dark" position="top-right" />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
