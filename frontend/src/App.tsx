import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store/store';
import Router from './router/router';
import { Header, Sidebar } from './components';
import { initializeAuthAsync } from './redux/slice/authThunks';
import type { AppDispatch } from './redux/store/store';

const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Initialize authentication on app startup
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(initializeAuthAsync());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="py-6">
          <Router />
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
