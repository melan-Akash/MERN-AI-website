import { Hash, Sparkle } from 'lucide-react'
import React, { useState } from 'react'

import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const BlogTitles = () => {

  const blogCategories = [
    'General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Food', 'Education', 'Travel'
  ]

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!token) return alert('Please sign in first');
    setLoading(true);
    setResult('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/ai/generate-blog-titles', {
        keyword: input,
        category: selectedCategory
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setResult(data.content);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate titles');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='h-full overflow-y-scroll p-6 md:p-10 flex items-start flex-col lg:flex-row gap-8 text-slate-700'>
      {/* left column */}
      <form onSubmit={onSubmitHandler} className='flex-1 w-full p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md'>
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-6'>
          <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] flex justify-center items-center shadow-md'>
            <Sparkle className='w-5 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>AI Title Generator</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Configure your blog title generation</p>
          </div>
        </div>

        <label className='block text-sm font-bold text-gray-700 mb-2'>Keyword / Topic</label>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          className='w-full p-3 px-4 outline-none text-sm rounded-xl border border-gray-200 focus:border-[#9E53EE] focus:ring-4 focus:ring-[#9E53EE]/10 transition-all mb-6'
          placeholder='e.g., The Future of AI...'
          required
        />

        <label className='block text-sm font-bold text-gray-700 mb-2'>Category</label>

        <div className='flex gap-2 flex-wrap mb-8'>
          {blogCategories.map((item, index) => (
            <span
              onClick={() => setSelectedCategory(item)}
              key={index}
              className={`text-xs px-5 py-2.5 rounded-full cursor-pointer transition-all font-medium border ${
                selectedCategory === item
                  ? 'bg-[#9E53EE]/10 text-[#9E53EE] border-[#9E53EE]'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#FF61C5] to-[#9E53EE] text-white px-4 py-3.5
        text-sm rounded-xl font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'>
          <Hash className='w-5 h-5' />
          {loading ? 'Generating...' : 'Generate Titles'}
        </button>
      </form>

      {/* right column */}
      <div className='flex-1 w-full p-8 bg-white rounded-3xl flex flex-col border border-gray-100 shadow-sm min-h-[500px] max-h-[800px]'>
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-4'>
          <div className='w-10 h-10 rounded-2xl bg-purple-50 text-[#9E53EE] flex justify-center items-center'>
            <Hash className='w-5 h-5 text-[#9E53EE]' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Generated Titles</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Catchy options for your next post</p>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar mt-2'>
          {loading ? (
            <div className='flex flex-col items-center justify-center h-full text-gray-400 gap-4'>
              <div className="w-10 h-10 border-4 border-[#9E53EE] border-t-transparent rounded-full animate-spin"></div>
              <p className='font-medium text-[#9E53EE] animate-pulse'>Generating titles...</p>
            </div>
          ) : result ? (
            <div className='prose prose-sm max-w-none text-gray-700 leading-relaxed'>
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <div className='h-full flex justify-center items-center text-sm flex-col gap-4 text-gray-400'>
              <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2'>
                <Hash className='w-8 h-8 text-gray-300' />
              </div>
              <p className='font-medium text-gray-500'>No titles generated yet</p>
              <p className='text-center max-w-xs leading-relaxed'>Enter a keyword and click "Generate Titles" to get catchy, click-worthy ideas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogTitles
