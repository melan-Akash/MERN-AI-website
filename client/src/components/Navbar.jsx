import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, LogOut, ChevronDown, Sparkles, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, signOut, openSignIn } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className='fixed z-50 w-full backdrop-blur-2xl flex justify-between items-center py-4 px-4 sm:px-20 xl:px-32 border-b border-white/10'>
      <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer'>
        <Sparkles className='w-7 h-7 text-primary fill-primary' />
        <span className='text-2xl font-bold text-white tracking-tight'>Do with Ai</span>
      </div>

      {user ? (
        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors'
          >
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt=''
                className='w-8 h-8 rounded-full border border-white/20 object-cover'
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + user.name + '&background=5044E5&color=fff'; }}
              />
            ) : (
               <div className='w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border border-white/10 shadow-sm'>
                 <User className='w-4.5 h-4.5 text-white/95' />
               </div>
            )}
            <span className='hidden sm:block text-white font-medium text-sm'>{user.name}</span>
            <ChevronDown className='w-4 h-4 text-white/70' />
          </button>

          {dropdownOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50'>
              <div className='px-4 py-2 border-b border-gray-100'>
                <p className='text-sm font-medium text-gray-800'>{user.name}</p>
                <p className='text-xs text-gray-500'>{user.email}</p>
                <span className='text-xs text-blue-600 font-medium capitalize'>{user.plan} Plan</span>
              </div>
              <button
                onClick={() => { signOut(); setDropdownOpen(false) }}
                className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition cursor-pointer'
              >
                <LogOut className='w-4 h-4' />
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={openSignIn}
        className='flex items-center gap-2 rounded-full cursor-pointer bg-primary
        text-white px-10 py-2.5'>Get Started <ArrowRight className='w-4 h-4' />
         </button>
      )}
    </div>
  )
}

export default Navbar