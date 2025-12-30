
import React from 'react';
import { NavLink } from 'react-router-dom';
import { CarDetails } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  car: CarDetails;
}

const Layout: React.FC<LayoutProps> = ({ children, car }) => {
  const navItems = [
    { to: '/', label: 'Dash', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /> },
    { to: '/history', label: 'History', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
    { to: '/add', label: 'Add', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
    { to: '/profile', label: 'Car', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V14.25M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /> },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64 flex flex-col bg-slate-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-orange-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V14.25M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-exo font-bold text-white tracking-tight">REVTRACK</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-orange-600/10 text-orange-500 border-l-4 border-orange-600' : 'text-slate-400 hover:bg-slate-800'
                }`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                {item.icon}
              </svg>
              <span className="font-semibold">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Active Profile</p>
          <p className="font-exo font-bold text-white truncate">{car.year} {car.make} {car.model}</p>
        </div>
      </aside>

      {/* Header - Mobile */}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
           <div className="p-1.5 bg-orange-600 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-white">
               <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V14.25M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <span className="font-exo font-extrabold text-xl tracking-tighter">REVTRACK</span>
        </div>
        <div className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-bold">
          {car.model}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Tab Bar - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around py-3 px-2 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-orange-500' : 'text-slate-500'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              {item.icon}
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
