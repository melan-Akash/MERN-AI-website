import { Scissors, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const RemoveObjects = () => {
  const [input, setInput] = useState('')
  const [object, setObject] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!token) return alert('Please sign in first');
    if (!input || !object) return alert('Please upload an image and describe the object');

    setLoading(true);
    setResult('');
    try {
      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const { data } = await axios.post('http://localhost:5000/api/ai/remove-object', formData, {
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
      alert(error.response?.data?.message || 'Failed to remove object');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='h-full overflow-y-scroll p-6 md:p-10 flex items-start flex-col lg:flex-row gap-8 text-slate-700'>
      {/* left column */}
      <form
        onSubmit={onSubmitHandler}
        className='flex-1 w-full p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md'
      >
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-6'>
          <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-[#417DF6] to-[#8E37EB] flex justify-center items-center shadow-md'>
            <Sparkles className='w-5 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Object Removal</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Clean up your photos magically</p>
          </div>
        </div>

        {/* Upload image */}
        <label className='block text-sm font-bold text-gray-700 mb-2'>Upload Image</label>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type='file'
          className='w-full p-3 px-4 mt-2 outline-none text-sm rounded-xl border border-gray-200 text-gray-600 focus:border-[#417DF6] focus:ring-4 focus:ring-[#417DF6]/10 transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#417DF6] hover:file:bg-blue-100'
          required
          accept='image/*'
        />

        {/* Describe object to remove */}
        <label className='block text-sm font-bold text-gray-700 mt-6 mb-2'>Describe Object to Remove</label>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          className='w-full p-3 px-4 outline-none text-sm rounded-xl border border-gray-200 focus:border-[#417DF6] focus:ring-4 focus:ring-[#417DF6]/10 transition-all mb-2'
          placeholder='Example: Remove the car from the left side...'
          rows={4}
          required
        />

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-3.5 mt-8 text-sm rounded-xl font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
        >
          <Scissors className='w-5 h-5' />
          {loading ? 'Processing...' : 'Remove Object'}
        </button>
      </form>

      {/* right column */}
      <div className='flex-1 w-full p-8 bg-white rounded-3xl flex flex-col border border-gray-100 shadow-sm min-h-[500px]'>
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-4'>
          <div className='w-10 h-10 rounded-2xl bg-purple-50 text-[#8E37EB] flex justify-center items-center'>
            <Scissors className='w-5 h-5 text-[#8E37EB]' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Processed Image</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Your cleaned up photo</p>
          </div>
        </div>

        <div className='flex-1 p-4 flex flex-col justify-center items-center rounded-2xl bg-[#F4F7FB]/50 border border-dashed border-gray-200 mt-2'>
          {loading ? (
            <div className='flex flex-col items-center justify-center h-full text-gray-400 gap-4'>
              <div className="w-10 h-10 border-4 border-[#8E37EB] border-t-transparent rounded-full animate-spin"></div>
              <p className='font-medium text-[#8E37EB] animate-pulse'>Removing object...</p>
            </div>
          ) : result ? (
            <img src={result} alt="Processed" className='w-full max-h-[400px] object-contain rounded-xl shadow-sm' />
          ) : (
            <div className='h-full flex justify-center items-center text-sm flex-col gap-4 text-gray-400'>
              <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm border border-gray-100'>
                <Scissors className='w-8 h-8 text-gray-300' />
              </div>
              <p className='font-medium text-gray-500'>No image processed yet</p>
              <p className='text-center max-w-xs leading-relaxed'>Upload an image, describe what to remove, and click "Remove Object".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RemoveObjects
