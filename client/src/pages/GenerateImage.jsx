import { Image, Sparkle, Copy, Check, Download } from 'lucide-react'
import React, { useState } from 'react'

import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const GenerateImage = () => {
  const imageStyle = [
    'Realistic',
    'Ghibli style',
    'Anime style',
    'Cartoon style',
    'Fantasy style',
    'Realistic style',
    '3D style',
    'Portrait style',
  ]

  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)
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
    setLoading(true);
    setResult('');
    try {
      const { data } = await axios.post(`${backendUrl}/api/ai/generate-image`, {
        prompt: input,
        style: selectedStyle,
        isPublic: publish
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setResult(data.content);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate image');
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
          <div className='w-11 h-11 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 flex justify-center items-center shadow-md shadow-emerald-100'>
            <Sparkle className='w-5 h-5 text-white fill-white/10' />
          </div>
          <div>
            <h1 className='text-lg font-bold text-slate-800 tracking-tight'>AI Image Generator</h1>
            <p className='text-xs text-slate-400 font-medium mt-0.5'>Bring your ideas to life</p>
          </div>
        </div>

        <div className='mb-5'>
          <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>Describe your image</label>
          <textarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className='w-full p-3.5 px-4 outline-none text-sm rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200'
            placeholder='Describe what you want to see in the image...'
            rows={4}
            required
          />
        </div>

        <div className='mb-6'>
          <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5'>Style</label>
          <div className='flex gap-2 flex-wrap'>
            {imageStyle.map((item, index) => (
              <button
                type='button'
                onClick={() => setSelectedStyle(item)}
                key={index}
                className={`text-xs px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 font-bold border ${
                  selectedStyle === item
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className='mb-8 flex items-center justify-between bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100'>
          <div>
            <p className='text-sm font-bold text-slate-800'>Make this Image Public</p>
            <p className='text-xs text-slate-400 font-medium mt-0.5'>Allow others in community to view</p>
          </div>
          <label className='relative inline-flex items-center cursor-pointer select-none'>
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className='sr-only peer'
            />
            <div className='w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors duration-200 after:content-[""] after:absolute after:top-1 after:left-1 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white'></div>
          </label>
        </div>

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-emerald-500 to-teal-500 text-white px-5 py-3.5 text-sm rounded-xl font-bold shadow-lg shadow-emerald-100 hover:shadow-xl hover:shadow-emerald-200 hover:opacity-95 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Image className='w-4.5 h-4.5' />
          <span>{loading ? 'Generating image...' : 'Generate Image'}</span>
        </button>
      </form>

      {/* Output Column */}
      <div className='flex-1 w-full p-8 bg-white rounded-3xl flex flex-col border border-slate-100 shadow-sm min-h-[500px]'>
        <div className='flex items-center justify-between pb-6 border-b border-slate-100 mb-4 shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex justify-center items-center border border-emerald-100/50'>
              <Image className='w-5 h-5 text-emerald-600' />
            </div>
            <div>
              <h1 className='text-lg font-bold text-slate-800 tracking-tight'>Generated Image</h1>
              <p className='text-xs text-slate-400 font-medium mt-0.5'>Your AI masterpiece will display here</p>
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

        <div className='flex-1 p-4 flex flex-col justify-center items-center'>
          {loading ? (
            <div className='flex flex-col items-center justify-center h-full text-slate-400 gap-4 py-10'>
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className='font-bold text-sm text-emerald-600 animate-pulse'>Generating image copy...</p>
            </div>
          ) : result ? (
            <div className='relative group overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-slate-50 p-2'>
              <img src={result} alt="Generated" className='w-full max-h-[500px] object-contain rounded-xl' />
            </div>
          ) : (
            <div className='h-full flex justify-center items-center text-sm flex-col gap-4 text-slate-400 py-10'>
              <div className='w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm'>
                <Image className='w-6 h-6 text-slate-300' />
              </div>
              <p className='font-bold text-slate-700 text-sm'>No image generated yet</p>
              <p className='text-center text-xs text-slate-400 max-w-xs leading-relaxed'>Enter a description in the configuration panel and click "Generate Image" to start.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GenerateImage
