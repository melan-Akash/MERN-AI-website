import { Eraser, Sparkle } from 'lucide-react'
import React, { useState } from 'react'

import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const RemoveBackground = () => {

  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!token) return alert('Please sign in first');
    if (!input) return alert('Please upload an image');

    setLoading(true);
    setResult('');
    try {
      const formData = new FormData();
      formData.append('image', input);

      const { data } = await axios.post('http://localhost:5000/api/ai/remove-background', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setResult(data.content);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove background');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='h-full overflow-y-scroll p-6 md:p-10 flex items-start flex-col lg:flex-row gap-8 text-slate-700'>
      {/* left column */}
      <form onSubmit={onSubmitHandler} className='flex-1 w-full p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md'>
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-6'>
          <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F6AB41] to-[#FF4938] flex justify-center items-center shadow-md'>
            <Sparkle className='w-5 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Background Removal</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Isolate subjects instantly</p>
          </div>
        </div>

        <label className='block text-sm font-bold text-gray-700 mb-2'>Upload Image</label>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type='file'
          className='w-full p-3 px-4 mt-2 outline-none text-sm rounded-xl border border-gray-200 text-gray-600 focus:border-[#FF4938] focus:ring-4 focus:ring-[#FF4938]/10 transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#FF4938] hover:file:bg-orange-100'
          required
          accept='image/*'
        />

        <p className='text-xs text-gray-500 font-medium mt-2 ml-1'>Supports JPG, PNG, and other image formats</p>

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-3.5
        mt-8 text-sm rounded-xl font-semibold shadow-md shadow-orange-200 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'>
          <Eraser className='w-5 h-5' />
          {loading ? 'Processing...' : 'Remove Background'}
        </button>
      </form>

      {/* right column */}
      <div className='flex-1 w-full p-8 bg-white rounded-3xl flex flex-col border border-gray-100 shadow-sm min-h-[500px]'>
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-4'>
          <div className='w-10 h-10 rounded-2xl bg-orange-50 text-[#FF4938] flex justify-center items-center'>
            <Eraser className='w-5 h-5 text-[#FF4938]' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Processed Image</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Your transparent image</p>
          </div>
        </div>

        <div className='flex-1 p-4 flex flex-col justify-center items-center rounded-2xl bg-[#F4F7FB]/50 border border-dashed border-gray-200 mt-2'>
          {loading ? (
            <div className='flex flex-col items-center justify-center h-full text-gray-400 gap-4'>
              <div className="w-10 h-10 border-4 border-[#FF4938] border-t-transparent rounded-full animate-spin"></div>
              <p className='font-medium text-[#FF4938] animate-pulse'>Removing background...</p>
            </div>
          ) : result ? (
            <img src={result} alt="Processed" className='w-full max-h-[400px] object-contain rounded-xl shadow-sm bg-[url(https://upload.wikimedia.org/wikipedia/commons/4/48/Light_Grey_Checkerboard_Pattern.svg)] bg-repeat' />
          ) : (
            <div className='h-full flex justify-center items-center text-sm flex-col gap-4 text-gray-400'>
              <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm border border-gray-100'>
                <Eraser className='w-8 h-8 text-gray-300' />
              </div>
              <p className='font-medium text-gray-500'>No image processed yet</p>
              <p className='text-center max-w-xs leading-relaxed'>Upload an image and click "Remove Background" to see the magic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RemoveBackground