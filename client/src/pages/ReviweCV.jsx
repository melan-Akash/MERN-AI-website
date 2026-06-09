import { FileText, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const ReviweCV = () => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
    
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!token) return alert('Please sign in first');
    if (!input) return alert('Please upload a resume');

    setLoading(true);
    setResult('');
    try {
      const formData = new FormData();
      formData.append('resume', input);

      const { data } = await axios.post('http://localhost:5000/api/ai/review-cv', formData, {
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
      alert(error.response?.data?.message || 'Failed to review resume');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className='h-full overflow-y-scroll p-6 md:p-10 flex items-start flex-col lg:flex-row gap-8 text-slate-700'>
      {/* Left Column */}
      <form 
        onSubmit={onSubmitHandler} 
        className='flex-1 w-full p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md'
      >
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-6'>
          <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00DA83] to-[#22c55e] flex justify-center items-center shadow-md'>
            <Sparkles className='w-5 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Resume Review</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Get AI-powered feedback</p>
          </div>
        </div>

        <label className='block text-sm font-bold text-gray-700 mb-2'>Upload Resume</label>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type='file'
          className='w-full p-3 px-4 mt-2 outline-none text-sm rounded-xl border border-gray-200 text-gray-600 focus:border-[#00DA83] focus:ring-4 focus:ring-[#00DA83]/10 transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#00DA83] hover:file:bg-green-100'
          required
          accept='application/pdf'
        />

        <p className='text-xs text-gray-500 font-medium mt-2 ml-1'>
          Supports PDF resume format only.
        </p>

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#22c55e] text-white px-4 py-3.5 mt-8 text-sm rounded-xl font-semibold shadow-md shadow-green-200 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
        >
          <FileText className='w-5 h-5' />
          {loading ? 'Analyzing...' : 'Review Resume'}
        </button>
      </form>

      {/* Right Column */}
      <div className='flex-1 w-full p-8 bg-white rounded-3xl flex flex-col border border-gray-100 shadow-sm min-h-[500px] max-h-[800px]' >
        <div className='flex items-center gap-3 pb-6 border-b border-gray-100 mb-4'>
          <div className='w-10 h-10 rounded-2xl bg-green-50 text-[#00DA83] flex justify-center items-center'>
            <FileText className='w-5 h-5 text-[#00DA83]' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Analysis Results</h1>
            <p className='text-sm text-gray-500 mt-0.5'>Detailed insights on your CV</p>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar mt-2'>
          {loading ? (
            <div className='flex flex-col items-center justify-center h-full text-gray-400 gap-4'>
              <div className="w-10 h-10 border-4 border-[#00DA83] border-t-transparent rounded-full animate-spin"></div>
              <p className='font-medium text-[#00DA83] animate-pulse'>Analyzing resume...</p>
            </div>
          ) : result ? (
            <div className='prose prose-sm max-w-none text-gray-700 leading-relaxed'>
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <div className='h-full flex justify-center items-center text-sm flex-col gap-4 text-gray-400'>
              <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2'>
                <FileText className='w-8 h-8 text-gray-300' />
              </div>
              <p className='font-medium text-gray-500'>No resume analyzed yet</p>
              <p className='text-center max-w-xs leading-relaxed'>Upload a resume and click "Review Resume" to get detailed feedback and improvement suggestions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviweCV
