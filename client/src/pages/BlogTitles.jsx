import { Hash, Sparkle, Copy, Check, Download } from 'lucide-react'
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
  const [copied, setCopied] = useState(false)
  const { token, backendUrl } = useAuth()

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "blog-titles.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!token) return alert('Please sign in first');
    setLoading(true);
    setResult('');
    try {
      const { data } = await axios.post(`${backendUrl}/api/ai/generate-blog-titles`, {
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
    <div className='h-full overflow-y-auto p-6 md:p-10 flex flex-col lg:flex-row items-start gap-8 bg-slate-50/30'>
      {/* Configuration Column */}
      <form onSubmit={onSubmitHandler} className='flex-1 w-full p-8 bg-white rounded-3xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md duration-300'>
        <div className='flex items-center gap-3 pb-6 border-b border-slate-100 mb-6'>
          <div className='w-11 h-11 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex justify-center items-center shadow-md shadow-purple-100'>
            <Sparkle className='w-5 h-5 text-white fill-white/10' />
          </div>
          <div>
            <h1 className='text-lg font-bold text-slate-800 tracking-tight'>Title Generator</h1>
            <p className='text-xs text-slate-400 font-medium mt-0.5'>Configure AI title suggestions</p>
          </div>
        </div>

        <div className='mb-5'>
          <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>Keyword / Topic</label>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type='text'
            className='w-full p-3.5 px-4 outline-none text-sm rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all duration-200'
            placeholder='e.g., The Future of AI...'
            required
          />
        </div>

        <div className='mb-8'>
          <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5'>Category</label>
          <div className='flex gap-2 flex-wrap'>
            {blogCategories.map((item, index) => (
              <button
                type='button'
                onClick={() => setSelectedCategory(item)}
                key={index}
                className={`text-xs px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 font-bold border ${
                  selectedCategory === item
                    ? 'bg-purple-50 text-purple-600 border-purple-200 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button 
          disabled={loading} 
          className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-purple-600 to-pink-500 text-white px-5 py-3.5
          text-sm rounded-xl font-bold shadow-lg shadow-purple-100 hover:shadow-xl hover:shadow-purple-200 hover:opacity-95 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Hash className='w-4 h-4' />
          <span>{loading ? 'Generating...' : 'Generate Titles'}</span>
        </button>
      </form>

      {/* Output Column */}
      <div className='flex-1 w-full p-8 bg-white rounded-3xl flex flex-col border border-slate-100 shadow-sm min-h-[500px] max-h-[800px]'>
        <div className='flex items-center justify-between pb-6 border-b border-slate-100 mb-4 shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex justify-center items-center border border-purple-100/50'>
              <Hash className='w-5 h-5 text-purple-600' />
            </div>
            <div>
              <h1 className='text-lg font-bold text-slate-800 tracking-tight' >Generated Suggestions</h1>
              <p className='text-xs text-slate-400 font-medium mt-0.5'>Catchy options for your copy</p>
            </div>
          </div>
          {result && !loading && (
            <div className='flex items-center gap-2'>
              <button 
                type='button'
                onClick={handleCopy} 
                className='p-2 hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold'
                title='Copy titles'
              >
                {copied ? <Check className='w-4 h-4 text-emerald-600' /> : <Copy className='w-4 h-4' />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button 
                type='button'
                onClick={handleDownload} 
                className='p-2 hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold'
                title='Download file'
              >
                <Download className='w-4 h-4' />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>

        <div className='flex-1 overflow-y-auto pr-1 custom-scrollbar mt-2 min-h-0'>
          {loading ? (
            <div className='flex flex-col items-center justify-center h-full text-slate-400 gap-4 py-10'>
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className='font-bold text-sm text-purple-600 animate-pulse'>Brainstorming titles...</p>
            </div>
          ) : result ? (
            <div className='prose prose-sm max-w-none text-slate-700 leading-relaxed reset-tw'>
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <div className='h-full flex justify-center items-center text-sm flex-col gap-4 text-slate-400 py-10'>
              <div className='w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm'>
                <Hash className='w-6 h-6 text-slate-300' />
              </div>
              <p className='font-bold text-slate-700 text-sm'>No titles generated yet</p>
              <p className='text-center text-xs max-w-xs text-slate-400 leading-relaxed'>Enter your focus keywords and click "Generate Titles" to get catchy, click-worthy ideas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogTitles
