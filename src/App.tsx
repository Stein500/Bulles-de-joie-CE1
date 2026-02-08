import { useEffect, useCallback } from 'react';
import { useStore } from './stores/useStore';
import { SplashScreen } from './components/SplashScreen';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { StudentManager } from './components/StudentManager';
import { SubjectManager } from './components/SubjectManager';
import { GradeEntry } from './components/GradeEntry';
import { BulletinGenerator } from './components/BulletinGenerator';
import { SettingsPage } from './components/SettingsPage';

export function App() {
  const { showSplash, setShowSplash, currentPage, loadFromStorage, saveToStorage } = useStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Auto-save every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveToStorage();
    }, 3000);
    return () => clearInterval(interval);
  }, [saveToStorage]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, [setShowSplash]);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentManager />;
      case 'subjects':
        return <SubjectManager />;
      case 'grades':
        return <GradeEntry />;
      case 'bulletins':
        return <BulletinGenerator />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
}
