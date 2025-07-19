import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Header />}
      <main className={user ? 'pt-0' : ''}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;