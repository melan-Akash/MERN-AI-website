import React from 'react'
import { useAuth } from '../context/AuthContext'
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
  Sparkles,
  User
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div
      className={`w-64 bg-white border-r border-slate-100 flex flex-col justify-between h-full max-sm:fixed top-16 bottom-0 left-0 z-40
      ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
      transition-transform duration-300 ease-in-out`}
    >
      <div className='flex-1 flex flex-col overflow-y-auto custom-scrollbar py-6 px-4'>
        {/* User Info Header in Sidebar */}
        {user && (
          <div className='mb-6 px-2 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col items-center text-center'>
            <div className='relative group mb-3'>
              <div className='absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300'></div>
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt=''
                  className='relative w-16 h-16 rounded-full object-cover border-2 border-white shadow-md'
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + user.name + '&background=5044E5&color=fff'; }}
                />
              ) : (
                <div className='relative w-16 h-16 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center border-2 border-white shadow-md'>
                  <User className='w-7 h-7 text-white/90' />
                </div>
              )}
            </div>
            <h1 className='text-sm font-bold text-slate-800 tracking-tight'>
              {user.name}
            </h1>
            <p className='text-xs font-medium text-indigo-600 mt-0.5 bg-indigo-50 px-2.5 py-0.5 rounded-full capitalize'>
              {user.plan === 'premium' ? '★ Premium' : 'Free Plan'}
            </p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className='flex flex-col gap-1'>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-4 py-3 flex items-center gap-3.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100/50 shadow-sm shadow-indigo-100/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg transition-colors ${
                    isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-700'
                  }`}>
                    <Icon className='w-4 h-4' />
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      {user && (
        <div className='p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 shrink-0'>
          <div className='flex gap-2.5 items-center overflow-hidden flex-1'>
            {user.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt='' 
                className='w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0' 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + user.name + '&background=5044E5&color=fff'; }}
              />
            ) : (
              <div className='w-9 h-9 rounded-full shrink-0 bg-indigo-600 text-white flex items-center justify-center border border-white/10 shadow-sm'>
                <User className='w-4.5 h-4.5 text-white/95' />
              </div>
            )}
            <div className='overflow-hidden flex-1'>
              <h2 className='text-xs font-bold text-slate-800 truncate'>{user.name}</h2>
              <p className='text-[10px] font-semibold text-slate-400 uppercase tracking-wider'>
                {user.plan === 'premium' ? 'Premium' : 'Free'}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className='p-2 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl transition cursor-pointer group shrink-0'
            title="Log Out"
          >
            <LogOut className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
          </button>
        </div>
      )}
    </div>
  )
}

export default Sidebar
