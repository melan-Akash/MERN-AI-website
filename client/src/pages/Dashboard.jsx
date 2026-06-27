import React, { useEffect, useState } from 'react'
import { Gem, Sparkles, Clock, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CreationItem from '../components/CreationItem'
import axios from 'axios'

const Dashboard = () => {
  const { user, backendUrl } = useAuth()
  const [creations, setCreations] = useState([])
  const [time, setTime] = useState(new Date())

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/ai/creations`, {
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
    <div className='h-full overflow-y-auto p-6 md:p-10 bg-slate-50/30'>
      
      {/* Greeting Header */}
      <div className='mb-10 p-8 rounded-3xl border border-slate-100 bg-linear-to-r from-indigo-900 via-indigo-950 to-slate-900 relative overflow-hidden shadow-xl shadow-indigo-950/5'>
        {/* Subtle glowing mesh backgrounds */}
        <div className='absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20'></div>
        <div className='absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl -mb-10'></div>
        
        <div className='relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
          <div>
            <h1 className='text-3xl font-extrabold text-white mb-2 tracking-tight'>
              {getGreeting()}, <span className='bg-linear-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent'>{user?.name?.split(' ')[0]}</span>! 👋
            </h1>
            <p className='text-indigo-200/70 font-medium text-sm'>Here's what's happening with your content today.</p>
          </div>
          <div className='flex flex-wrap items-center gap-3.5'>
             <div className='flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4.5 py-2.5 rounded-2xl border border-white/10 shadow-sm'>
               <Calendar className='w-4.5 h-4.5 text-indigo-300' />
               <span className='font-semibold text-xs tracking-wide'>{formattedDate}</span>
             </div>
             <div className='flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4.5 py-2.5 rounded-2xl border border-white/10 shadow-sm'>
               <Clock className='w-4.5 h-4.5 text-indigo-300' />
               <span className='font-semibold text-xs tracking-wide'>{formattedTime}</span>
             </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
        {/* Total Creation Card */}
        <div className='group flex justify-between items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5'>
          <div>
            <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5'>Total Creations</p>
            <h2 className='text-3xl font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors'>{creations.length}</h2>
          </div>
          <div className='w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-50 to-purple-50 text-indigo-600 flex justify-center items-center group-hover:scale-105 transition-transform shadow-sm'>
            <Sparkles className='w-5 h-5' />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className='group flex justify-between items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5'>
          <div>
            <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5'>Active Plan</p>
            <span className='inline-flex items-center text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full capitalize group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors'>
              {user?.plan || 'Free'}
            </span>
          </div>
          <div className='w-12 h-12 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 text-amber-600 flex justify-center items-center group-hover:scale-105 transition-transform shadow-sm'>
            <Gem className='w-5 h-5' />
          </div>
        </div>
        
        {/* Quick Tips Card */}
        <div className='flex flex-col justify-center p-6 bg-linear-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-md shadow-indigo-100/50 text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden'>
           <div className='absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl'></div>
           <div className='flex items-center gap-2 mb-2 opacity-90 relative z-10'>
             <Sparkles className='w-4 h-4 text-purple-200 fill-purple-200/20' />
             <p className='text-[10px] font-bold tracking-wider uppercase'>Pro Tip</p>
           </div>
           <p className='text-xs font-medium leading-relaxed opacity-95 relative z-10'>Use specific keywords & styles for better AI blog titles and higher quality images!</p>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
            <h2 className='text-lg font-bold text-slate-800 tracking-tight'>Recent Creations</h2>
        </div>
        
        {creations.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6'>
            <div className='w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100'>
              <Sparkles className='w-7 h-7 text-slate-300' />
            </div>
            <p className='text-slate-700 font-bold text-base mb-1'>No creations yet</p>
            <p className='text-sm text-slate-400 max-w-sm leading-relaxed'>Start exploring the AI tools from the sidebar to create your first content copy or image!</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 max-w-5xl'>
            {creations.map((item) => <CreationItem key={item.id || item._id} item={item}/>)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
