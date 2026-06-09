import React, { useEffect, useState } from 'react'
import { Gem, Sparkles, Clock, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CreationItem from '../components/CreationItem'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [creations, setCreations] = useState([])
  const [time, setTime] = useState(new Date())

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/ai/creations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('ai_token')}` }
      });
      if (data.success) setCreations(data.creations);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (user) getDashboardData()
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [user])

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className='h-full overflow-y-scroll p-6 md:p-10'>
      
      {/* Greeting Header */}
      <div className='mb-10 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[url(/gradientBackground.png)] bg-cover relative overflow-hidden'>
        <div className='relative z-10'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            {getGreeting()}, <span className='text-[#5044E5]'>{user?.fullName?.split(' ')[0]}</span>! 👋
          </h1>
          <p className='text-gray-500'>Here's what's happening with your content today.</p>
        </div>
        <div className='flex flex-wrap items-center gap-4 relative z-10'>
           <div className='flex items-center gap-2 text-gray-700 bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm border border-white/50'>
             <Calendar className='w-5 h-5 text-[#5044E5]' />
             <span className='font-medium text-sm'>{formattedDate}</span>
           </div>
           <div className='flex items-center gap-2 text-gray-700 bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm border border-white/50'>
             <Clock className='w-5 h-5 text-[#5044E5]' />
             <span className='font-medium text-sm'>{formattedTime}</span>
           </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
        {/* Total Creation Card */}
        <div className='flex justify-between items-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1'>
          <div className='text-slate-600'>
            <p className='text-sm font-medium mb-1'>Total Creations</p>
            <h2 className='text-3xl font-bold text-gray-800'>{creations.length}</h2>
          </div>
          <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center shadow-lg shadow-blue-200'>
            <Sparkles className='w-7 h-7 text-white' />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className='flex justify-between items-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1'>
          <div className='text-slate-600'>
            <p className='text-sm font-medium mb-1'>Active Plan</p>
            <h2 className='text-3xl font-bold text-gray-800 capitalize'>
              {user?.plan || 'Free'}
            </h2>
          </div>
          <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center shadow-lg shadow-purple-200'>
            <Gem className='w-7 h-7 text-white' />
          </div>
        </div>
        
        {/* Quick Tips Card */}
        <div className='flex flex-col justify-center p-6 bg-gradient-to-br from-[#5044E5] to-[#7E74F1] rounded-3xl shadow-sm text-white transition-all hover:shadow-md hover:-translate-y-1'>
           <div className='flex items-center gap-2 mb-2 opacity-80'>
             <Sparkles className='w-4 h-4' />
             <p className='text-sm font-medium tracking-wide uppercase'>Pro Tip</p>
           </div>
           <p className='text-sm font-medium leading-relaxed'>Use specific keywords & styles for better AI blog titles and higher quality images!</p>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-bold text-gray-800'>Recent Creations</h2>
        </div>
        
        {creations.length === 0 ? (
          <div className='text-center py-16 bg-white rounded-3xl border border-gray-100 border-dashed'>
            <Sparkles className='w-12 h-12 text-gray-300 mx-auto mb-4' />
            <p className='text-gray-500 font-medium'>You haven't created anything yet.</p>
            <p className='text-sm text-gray-400 mt-1'>Start exploring the AI tools from the sidebar!</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4'>
            {creations.map((item) => <CreationItem key={item.id} item={item}/>)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
