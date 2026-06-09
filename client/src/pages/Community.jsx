import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Heart } from 'lucide-react'
import axios from 'axios'

const Community = () => {

  const [creations, setCreations] = useState([])
  const { user } = useAuth()

  const fetchCreations = async ()=>{
    try {
      const { data } = await axios.get('http://localhost:5000/api/ai/creations/public');
      if (data.success) setCreations(data.creations);
    } catch (error) {
      console.error(error);
    }
  }

  const handleLike = async (id) => {
    if (!user) return alert('Please login to like');
    try {
      const { data } = await axios.post(`http://localhost:5000/api/ai/creations/${id}/like`, {}, {
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
    <div className='flex-1 h-full flex flex-col p-4 gap-6'>
      Creation
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {creations.map((creation, index)=> (
          <div key={index} className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
            <img src={creation.content} alt="" className='w-full h-full object-cover rounded-lg'/>
            <div className='absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 
            group-hover:bg-gradient-to-b from-transparent to-black/80 text-white  rounded-lg'>
              <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
              <div className='flex gap-1 items-center'>
                <p>{creation.likes.length}</p>
                <Heart 
                  onClick={() => handleLike(creation._id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${user && creation.likes.includes(user._id) ? 'fill-red-500 text-red-600' : 'text-white'}`} 
                />
              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default Community