import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-100">
      {isHomePage && (
        <nav className="sticky top-0 bg-white shadow-md z-50">
          <div className="px-4">
            <div className="flex items-center h-14">
              <Activity className="w-7 h-7 text-blue-500" />
              <span className="ml-2 text-lg font-medium">气密检测系统</span>
            </div>
          </div>
        </nav>
      )}
      
      <main className={isHomePage ? 'p-4' : ''}>
        <Outlet />
      </main>
    </div>
  );
}