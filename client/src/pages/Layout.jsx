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
    <div className='flex flex-col items-start justify-start h-screen'>
      <nav className='w-full px-8 min-h-16 flex items-center justify-between border-b border-gray-200 bg-white'>
        <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer'>
          <Sparkles className='w-6 h-6 text-[#5044E5] fill-[#5044E5]' />
          <span className='text-xl font-bold text-gray-800 tracking-tight'>Do with Ai</span>
        </div>
        {
          sidebar ? <X onClick={() => setSidebar(false)} className='h-6 w-6 text-gray-700 sm:hidden'/>
          : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-700 sm:hidden'/>
        }
      </nav>
      <div className='flex-1 w-full flex h-[clac(100vh-64px)]'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar}/>
        <div className='flex-1 bg-[#F4F7FB]'>
            <Outlet />
        </div>

      </div>
      


    </div> 
  ) : (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <p className='text-gray-500 text-lg'>Please sign in to access the AI tools</p>
      <button
        onClick={openSignIn}
        className='bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white px-8 py-2.5 rounded-full
        hover:opacity-90 transition cursor-pointer'
      >
        Sign In
      </button>
    </div>
  )
}

export default Layout