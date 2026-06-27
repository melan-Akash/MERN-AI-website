import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Heart } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const Community = () => {

  const [creations, setCreations] = useState([])
  const { user, backendUrl } = useAuth()

  const fetchCreations = async ()=>{
    try {
      const { data } = await axios.get(`${backendUrl}/api/ai/creations/public`);
      if (data.success) setCreations(data.creations);
    } catch (error) {
      console.error(error);
    }
  }

  const handleLike = async (id) => {
    if (!user) return toast.error('Please login to like');
    try {
      const { data } = await axios.post(`${backendUrl}/api/ai/creations/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('ai_token')}` }
      });
      if (data.success) {
        setCreations(creations.map(c => c._id === id ? { ...c, likes: data.likes } : c));
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
    fetchCreations()
  },[])

  return (
    <div className='h-full overflow-y-auto p-6 md:p-10 bg-slate-50/30 flex flex-col gap-8'>
      {/* Gallery Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 shrink-0'>
        <div>
          <h1 className='text-2xl font-extrabold text-slate-800 tracking-tight'>Community Gallery</h1>
          <p className='text-xs text-slate-400 font-medium mt-1'>Explore creative masterpieces designed by the community</p>
        </div>
        <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100/80 px-3.5 py-2 rounded-full border border-slate-200/40'>
          <span>{creations.length} Creations shared</span>
        </div>
      </div>

      {/* Grid Layout */}
      {creations.length === 0 ? (
        <div className='flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-6'>
          <div className='w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100'>
            <Heart className='w-6 h-6 text-slate-300' />
          </div>
          <p className='text-slate-700 font-bold text-base mb-1'>No designs shared yet</p>
          <p className='text-sm text-slate-400 text-center max-w-sm leading-relaxed'>Generate premium images and set them to public to feature them here!</p>
        </div>
      ) : (
        <div className='columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:balance] w-full'>
          {creations.map((creation, index) => (
            <div 
              key={index} 
              className='break-inside-avoid relative group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5'
            >
              <img 
                src={creation.content} 
                alt={creation.prompt} 
                className='w-full object-cover rounded-2xl'
              />
              
              {/* Overlay on hover */}
              <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4.5 text-white'>
                <p className='text-xs font-semibold leading-relaxed line-clamp-3 mb-4 opacity-95'>
                  "{creation.prompt}"
                </p>
                <div className='flex items-center justify-between gap-3 border-t border-white/10 pt-3.5 shrink-0'>
                  <div className='flex items-center gap-2 min-w-0'>
                    <div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px] text-white uppercase shrink-0'>
                      {creation.creatorName ? creation.creatorName.charAt(0) : 'U'}
                    </div>
                    <span className='text-[11px] font-bold truncate opacity-90'>
                      {creation.creatorName || 'Anonymous'}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleLike(creation._id)}
                    className='flex items-center gap-1.5 bg-white/10 hover:bg-white/25 active:scale-95 transition-all px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10 text-xs font-bold cursor-pointer'
                  >
                    <Heart 
                      className={`w-3.5 h-3.5 ${
                        user && creation.likes.includes(user._id) 
                          ? 'fill-rose-500 text-rose-500' 
                          : 'text-white'
                      }`} 
                    />
                    <span>{creation.likes.length}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Community