import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'

const Layout = () => {

  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user, openSignIn } = useAuth()

  return user ? (
    <div className='flex flex-col items-start justify-start h-screen w-screen overflow-hidden bg-slate-50'>
      <nav className='w-full px-8 h-16 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50'>
        <div onClick={() => navigate('/')} className='flex items-center gap-2.5 cursor-pointer group'>
          <div className='p-1.5 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-200'>
            <Sparkles className='w-5 h-5 text-white fill-white/20' />
          </div>
          <span className='text-lg font-bold tracking-tight bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>Do with Ai</span>
        </div>
        <div className='flex items-center gap-4'>
          {
            sidebar ? (
              <button onClick={() => setSidebar(false)} className='p-2 hover:bg-slate-100 rounded-xl transition sm:hidden cursor-pointer'>
                <X className='h-5 w-5 text-slate-600'/>
              </button>
            ) : (
              <button onClick={() => setSidebar(true)} className='p-2 hover:bg-slate-100 rounded-xl transition sm:hidden cursor-pointer'>
                <Menu className='w-5 h-5 text-slate-600'/>
              </button>
            )
          }
        </div>
      </nav>
      <div className='flex-1 w-full flex h-[calc(100vh-64px)] overflow-hidden relative'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar}/>
        <div className='flex-1 bg-slate-50/50 overflow-hidden relative'>
          <div className='w-full h-full overflow-y-auto custom-scrollbar animate-fade-in'>
            <Outlet />
          </div>
        </div>
      </div>
    </div> 
  ) : (
    <div className='flex flex-col items-center justify-center h-screen w-screen bg-slate-50 gap-6 px-4 text-center'>
      <div className='p-4 bg-white rounded-3xl shadow-xl shadow-indigo-50 border border-slate-100 max-w-sm w-full flex flex-col items-center gap-4 animate-scale-up'>
        <div className='p-3.5 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-100'>
          <Sparkles className='w-8 h-8 text-white' />
        </div>
        <h2 className='text-xl font-bold text-slate-800'>Welcome to Do with Ai</h2>
        <p className='text-slate-500 text-sm leading-relaxed'>Please sign in to access the full suite of AI tools and start creating.</p>
        <button
          onClick={openSignIn}
          className='w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-100 hover:opacity-95 transition-all cursor-pointer'
        >
          Sign In
        </button>
      </div>
    </div>
  )
}

export default Layout