import { Edit, Sparkle } from 'lucide-react'
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

const WriteArticle = () => {
  const { token } = useAuth()
  const articleLenght = [
    { length: 800, text: 'Short (500 - 800 words)' },
    { length: 1200, text: 'Medium (800 - 1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' },
  ]

  const [selectedLength, setSelectedLength] = useState(articleLenght[0])
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e)=> {
    e.preventDefault();
    if (!token) return alert('Please sign in first');
    setLoading(true);
    setResult('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/ai/generate-article', {
        prompt: input,
        length: selectedLength.length
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setResult(data.content);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate article');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='h-full overflow-y-scroll p-6 md:p-10 flex items-start flex-col lg:flex-row gap-8 text-slate-700'>
      {/* col one */}
      <form onSubmit={onSubmitHandler} className='flex-1 w-full p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md'>
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-6'>
          <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] flex justify-center items-center shadow-md'>
            <Sparkle className='w-5 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Article Configuration</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Set up your article parameters</p>
          </div>
        </div>

        <label className='block text-sm font-bold text-gray-700 mb-2'>Article Topic</label>
        <input
          onChange={(e)=>setInput(e.target.value)}
          value={input}
          type='text'
          className='w-full p-3 px-4 outline-none text-sm rounded-xl border border-gray-200 focus:border-[#3588F2] focus:ring-4 focus:ring-[#3588F2]/10 transition-all mb-6'
          placeholder='e.g., The Future of AI in Healthcare...'
          required
        />

        <label className='block text-sm font-bold text-gray-700 mb-2'>Article Length</label>

        <div className='flex gap-2 flex-wrap mb-8'>
          {articleLenght.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              key={index}
              className={`text-xs px-5 py-2.5 rounded-full cursor-pointer transition-all font-medium border ${
                selectedLength.text === item.text
                  ? 'bg-[#3588F2]/10 text-[#3588F2] border-[#3588F2]'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#3588F2] to-[#0BB0D7] text-white px-4 py-3.5
        text-sm rounded-xl font-semibold shadow-md shadow-blue-200 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'>
          <Edit className='w-5 h-5'/>
          {loading ? 'Generating...' : 'Generate Article'}
        </button>
      </form>

      {/* right one */}
      <div className='flex-1 w-full p-8 bg-white rounded-3xl flex flex-col border border-gray-100 shadow-sm min-h-[500px] max-h-[800px]'>
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-4'>
          <div className='w-10 h-10 rounded-2xl bg-blue-50 text-[#3588F2] flex justify-center items-center'>
            <Edit className='w-5 h-5 text-[#3588F2]' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800' >Generated Article</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Your AI-written content will appear here</p>
          </div>
        </div>
        
        <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar mt-2'>
          {loading ? (
            <div className='flex flex-col items-center justify-center h-full text-gray-400 gap-4'>
              <div className="w-10 h-10 border-4 border-[#3588F2] border-t-transparent rounded-full animate-spin"></div>
              <p className='font-medium text-[#3588F2] animate-pulse'>Writing your article...</p>
            </div>
          ) : result ? (
            <div className='prose prose-sm max-w-none text-gray-700 leading-relaxed'>
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <div className='h-full flex justify-center items-center text-sm flex-col gap-4 text-gray-400'>
              <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2'>
                <Edit className='w-8 h-8 text-gray-300' />
              </div>
              <p className='font-medium text-gray-500'>No article generated yet</p>
              <p className='text-center max-w-xs leading-relaxed'>Enter a topic and click "Generate Article" to create high-quality content instantly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WriteArticle
