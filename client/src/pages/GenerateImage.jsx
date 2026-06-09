import { Image, Sparkle } from 'lucide-react'
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
  const { token } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!token) return alert('Please sign in first');
    setLoading(true);
    setResult('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/ai/generate-image', {
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
    <div className='h-full overflow-y-scroll p-6 md:p-10 flex items-start flex-col lg:flex-row gap-8 text-slate-700'>
      {/* left column */}
      <form
        onSubmit={onSubmitHandler}
        className='flex-1 w-full p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md'
      >
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-6'>
          <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00AD25] to-[#04FF50] flex justify-center items-center shadow-md'>
            <Sparkle className='w-5 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>AI Image Generator</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Bring your ideas to life</p>
          </div>
        </div>

        <label className='block text-sm font-bold text-gray-700 mb-2'>Describe your image</label>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className='w-full p-3 px-4 outline-none text-sm rounded-xl border border-gray-200 focus:border-[#00AD25] focus:ring-4 focus:ring-[#00AD25]/10 transition-all mb-6'
          placeholder='Describe what you want to see in the image...'
          rows={4}
          required
        />

        <label className='block text-sm font-bold text-gray-700 mb-2'>Style</label>

        <div className='flex gap-2 flex-wrap mb-6'>
          {imageStyle.map((item, index) => (
            <span
              onClick={() => setSelectedStyle(item)}
              key={index}
              className={`text-xs px-5 py-2.5 rounded-full cursor-pointer transition-all font-medium border ${
                selectedStyle === item
                  ? 'bg-[#00AD25]/10 text-[#00AD25] border-[#00AD25]'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className='mb-8 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100'>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className='sr-only peer'
            />
            <div className='w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#00AD25] transition-all'>
              <div className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5'></div>
            </div>
          </label>
          <div>
            <p className='text-sm font-semibold text-gray-700'>Make this Image Public</p>
            <p className='text-xs text-gray-500'>Allow others to see your creation</p>
          </div>
        </div>

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-3.5 mt-6 text-sm rounded-xl font-semibold shadow-md shadow-green-200 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
        >
          <Image className='w-5 h-5' />
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {/* right column */}
      <div className='flex-1 w-full p-8 bg-white rounded-3xl flex flex-col border border-gray-100 shadow-sm min-h-[500px]'>
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-4'>
          <div className='w-10 h-10 rounded-2xl bg-green-50 text-[#00AD25] flex justify-center items-center'>
            <Image className='w-5 h-5 text-[#00AD25]' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Generated Image</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Your AI masterpiece will appear here</p>
          </div>
        </div>

        <div className='flex-1 p-4 flex flex-col justify-center items-center'>
          {loading ? (
            <div className='flex flex-col items-center justify-center h-full text-gray-400 gap-4'>
              <div className="w-10 h-10 border-4 border-[#00AD25] border-t-transparent rounded-full animate-spin"></div>
              <p className='font-medium text-[#00AD25] animate-pulse'>Generating image...</p>
            </div>
          ) : result ? (
            <img src={result} alt="Generated" className='w-full max-h-[500px] object-contain rounded-2xl shadow-sm border border-gray-100' />
          ) : (
            <div className='h-full flex justify-center items-center text-sm flex-col gap-4 text-gray-400'>
              <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2'>
                <Image className='w-8 h-8 text-gray-300' />
              </div>
              <p className='font-medium text-gray-500'>No image generated yet</p>
              <p className='text-center max-w-xs leading-relaxed'>Enter a description and click "Generate Image" to create something beautiful.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GenerateImage
