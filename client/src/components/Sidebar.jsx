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
  Sparkles
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
      className={`w-60 bg-white border-r border-gray-200 
      flex flex-col justify-between items-center max-sm:absolute top-16 bottom-0 z-40
      ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
      transition-all duration-300 ease-in-out`}
    >
      <div className='w-full'>
        {/* Logo Section inside Sidebar for Mobile */}
        <div className='sm:hidden flex items-center justify-center gap-2 py-6 border-b border-gray-100 cursor-pointer' onClick={() => {navigate('/'); setSidebar(false);}}>
          <Sparkles className='w-6 h-6 text-[#5044E5] fill-[#5044E5]' />
          <span className='text-xl font-bold text-gray-800 tracking-tight'>Do with Ai</span>
        </div>

      {/* User Info and Navigation */}
      <div className='my-7 w-full'>
        {user && (
          <>
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt=''
                className='w-14 h-14 rounded-full mx-auto cursor-pointer object-cover'
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + user.fullName + '&background=5044E5&color=fff'; }}
              />
            ) : (
               <div className='w-14 h-14 rounded-full mx-auto bg-[#5044E5] text-white flex items-center justify-center font-bold text-2xl'>
                 {user.fullName?.charAt(0)?.toUpperCase()}
               </div>
            )}
            <h1 className='mt-2 text-center text-gray-700 font-medium'>
              {user.fullName}
            </h1>

            <div className='mt-8 flex flex-col gap-1 px-4'>
              {navItems.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/ai'}
                  onClick={() => setSidebar(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-2.5 flex items-center gap-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer - Plan and Logout */}
      {user && (
        <div className='w-full border-t border-gray-200 p-4 px-6 flex items-center justify-between'>
          <div className='flex gap-2 items-center cursor-pointer max-w-[150px]'>
            {user.imageUrl ? (
               <img src={user.imageUrl} alt='' className='w-8 h-8 rounded-full object-cover shrink-0' 
               onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + user.fullName + '&background=5044E5&color=fff'; }}
               />
            ) : (
               <div className='w-8 h-8 rounded-full shrink-0 bg-[#5044E5] text-white flex items-center justify-center font-bold text-xs'>
                 {user.fullName?.charAt(0)?.toUpperCase()}
               </div>
            )}
            <div className='overflow-hidden'>
              <h1 className='text-sm font-medium truncate'>{user.fullName}</h1>
              <p className='text-xs text-gray-500 capitalize'>
                {user.plan === 'premium' ? 'Premium' : 'Free'} Plan
              </p>
            </div>
          </div>

          <LogOut
            onClick={() => signOut()}
            className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'
          />
        </div>
      )}
      </div>
    </div>
  )
}

export default Sidebar
