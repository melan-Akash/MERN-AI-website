import { Scissors, Sparkles, Copy, Check, Download } from 'lucide-react'
import React, { useState } from 'react'

import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const RemoveObjects = () => {
  const [input, setInput] = useState('')
  const [object, setObject] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { token, backendUrl } = useAuth()

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const handleDownload = () => {
    window.location.href = `${backendUrl}/api/ai/download?url=${encodeURIComponent(result)}`;
  }

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

      const { data } = await axios.post(`${backendUrl}/api/ai/remove-object`, formData, {
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
    <div className='h-full overflow-y-auto p-6 md:p-10 flex flex-col lg:flex-row items-start gap-8 bg-slate-50/30'>
      {/* Configuration Column */}
      <form
        onSubmit={onSubmitHandler}
        className='flex-1 w-full p-8 bg-white rounded-3xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md duration-300'
      >
        <div className='flex items-center gap-3 pb-6 border-b border-slate-100 mb-6'>
          <div className='w-11 h-11 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex justify-center items-center shadow-md shadow-blue-100'>
            <Sparkles className='w-5 h-5 text-white fill-white/10' />
          </div>
          <div>
            <h1 className='text-lg font-bold text-slate-800 tracking-tight'>Object Removal</h1>
            <p className='text-xs text-slate-400 font-medium mt-0.5'>Clean up your photos magically</p>
          </div>
        </div>

        <div className='mb-5'>
          <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5'>Upload Image</label>
          <div className='relative group border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 bg-slate-50/50 hover:bg-blue-50/10 flex flex-col items-center justify-center text-center cursor-pointer'>
            <input
              id='file-upload-object'
              onChange={(e) => setInput(e.target.files[0])}
              type='file'
              className='absolute inset-0 opacity-0 cursor-pointer'
              required
              accept='image/*'
            />
            <div className='p-3 bg-white rounded-xl border border-slate-100 shadow-sm group-hover:scale-105 transition-transform text-slate-400 group-hover:text-blue-500 mb-3.5'>
              <Scissors className='w-5 h-5' />
            </div>
            <p className='text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors'>
              {input ? input.name : 'Click or Drag Image here'}
            </p>
            <p className='text-xs text-slate-400 mt-1 font-medium'>
              Supports JPG, PNG, and other image formats
            </p>
          </div>
        </div>

        <div className='mb-6'>
          <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>Describe Object to Remove</label>
          <textarea
            onChange={(e) => setObject(e.target.value)}
            value={object}
            className='w-full p-3.5 px-4 outline-none text-sm rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all duration-200'
            placeholder='Example: Remove the car from the left side...'
            rows={4}
            required
          />
        </div>

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-blue-500 to-purple-600 text-white px-5 py-3.5 text-sm rounded-xl font-bold shadow-lg shadow-blue-100 hover:shadow-xl hover:shadow-blue-200 hover:opacity-95 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Scissors className='w-4.5 h-4.5' />
          <span>{loading ? 'Processing...' : 'Remove Object'}</span>
        </button>
      </form>

      {/* Output Column */}
      <div className='flex-1 w-full p-8 bg-white rounded-3xl flex flex-col border border-slate-100 shadow-sm min-h-[500px]'>
        <div className='flex items-center justify-between pb-6 border-b border-slate-100 mb-4 shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex justify-center items-center border border-purple-100/50'>
              <Scissors className='w-5 h-5 text-purple-600' />
            </div>
            <div>
              <h1 className='text-lg font-bold text-slate-800 tracking-tight'>Processed Image</h1>
              <p className='text-xs text-slate-400 font-medium mt-0.5'>Your cleaned up photo</p>
            </div>
          </div>
          {result && !loading && (
            <div className='flex items-center gap-2'>
              <button 
                type='button'
                onClick={handleCopy} 
                className='p-2 hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold'
                title='Copy Link'
              >
                {copied ? <Check className='w-4 h-4 text-emerald-600' /> : <Copy className='w-4 h-4' />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
              <button 
                type='button'
                onClick={handleDownload} 
                className='p-2 hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold'
                title='Download Image'
              >
                <Download className='w-4 h-4' />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>

        <div className='flex-1 p-4 flex flex-col justify-center items-center rounded-2xl bg-slate-50 border border-slate-100/50 min-h-[300px] relative overflow-hidden'>
          {loading ? (
            <div className='flex flex-col items-center justify-center h-full text-slate-400 gap-4 py-10'>
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className='font-bold text-sm text-purple-600 animate-pulse'>Removing object copy...</p>
            </div>
          ) : result ? (
            <div className='relative rounded-xl overflow-hidden max-h-[400px] p-2 bg-slate-50 border border-slate-150 shadow-sm'>
              <img src={result} alt="Processed" className='max-h-[380px] object-contain mx-auto rounded-lg' />
            </div>
          ) : (
            <div className='h-full flex justify-center items-center text-sm flex-col gap-4 text-slate-400 py-10'>
              <div className='w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm'>
                <Scissors className='w-6 h-6 text-slate-300' />
              </div>
              <p className='font-bold text-slate-700 text-sm'>No image processed yet</p>
              <p className='text-center text-xs text-slate-400 max-w-xs leading-relaxed'>Upload an image, describe what to remove, and click "Remove Object" to see results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RemoveObjects
