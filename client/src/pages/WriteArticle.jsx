import { Edit, Sparkle, Copy, Check, Download } from 'lucide-react'
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-hot-toast'

const WriteArticle = () => {
  const { token, backendUrl } = useAuth()
  const articleLenght = [
    { length: 800, text: 'Short' },
    { length: 1200, text: 'Medium' },
    { length: 1600, text: 'Long' },
  ]

  const [selectedLength, setSelectedLength] = useState(articleLenght[0])
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "ai-article.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const onSubmitHandler = async (e)=> {
    e.preventDefault();
    if (!token) return toast.error('Please sign in first');
    setLoading(true);
    setResult('');
    const loadToast = toast.loading('Generating article...');
    try {
      const { data } = await axios.post(`${backendUrl}/api/ai/generate-article`, {
        prompt: input,
        length: selectedLength.length
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setResult(data.content);
        toast.dismiss(loadToast);
        toast.success('Article generated successfully');
      } else {
        toast.dismiss(loadToast);
        toast.error(data.message);
      }
    } catch (error) {
      toast.dismiss(loadToast);
      toast.error(error.response?.data?.message || 'Failed to generate article');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='h-full overflow-y-auto p-6 md:p-10 flex flex-col lg:flex-row items-start gap-8 bg-slate-50/30'>
      {/* Configuration Column */}
      <form onSubmit={onSubmitHandler} className='flex-1 w-full p-8 bg-white rounded-3xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md duration-300'>
        <div className='flex items-center gap-3 pb-6 border-b border-slate-100 mb-6'>
          <div className='w-11 h-11 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex justify-center items-center shadow-md shadow-indigo-100'>
            <Sparkle className='w-5 h-5 text-white fill-white/10' />
          </div>
          <div>
            <h1 className='text-lg font-bold text-slate-800 tracking-tight'>Article Configuration</h1>
            <p className='text-xs text-slate-400 font-medium mt-0.5'>Configure AI copy parameters</p>
          </div>
        </div>

        <div className='mb-5'>
          <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>Article Topic</label>
          <input
            onChange={(e)=>setInput(e.target.value)}
            value={input}
            type='text'
            className='w-full p-3.5 px-4 outline-none text-sm rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-200'
            placeholder='e.g., The Future of AI in Healthcare...'
            required
          />
        </div>

        <div className='mb-8'>
          <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5'>Article Length</label>
          <div className='flex gap-2.5 flex-wrap'>
            {articleLenght.map((item, index) => (
              <button
                type='button'
                onClick={() => setSelectedLength(item)}
                key={index}
                className={`text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 font-bold border ${
                  selectedLength.text === item.text
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>

        <button 
          disabled={loading} 
          className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-5 py-3.5
          text-sm rounded-xl font-bold shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 hover:opacity-95 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Edit className='w-4 h-4'/>
          <span>{loading ? 'Writing article...' : 'Generate Article'}</span>
        </button>
      </form>

      {/* Output Preview Column */}
      <div className='flex-1 w-full p-8 bg-white rounded-3xl flex flex-col border border-slate-100 shadow-sm min-h-[500px] max-h-[800px]'>
        <div className='flex items-center justify-between pb-6 border-b border-slate-100 mb-4 shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex justify-center items-center border border-indigo-100/50'>
              <Edit className='w-5 h-5 text-indigo-600' />
            </div>
            <div>
              <h1 className='text-lg font-bold text-slate-800 tracking-tight' >Generated Article</h1>
              <p className='text-xs text-slate-400 font-medium mt-0.5'>Your copy will display here</p>
            </div>
          </div>
          {result && !loading && (
            <div className='flex items-center gap-2'>
              <button 
                type='button'
                onClick={handleCopy} 
                className='p-2 hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold'
                title='Copy text'
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
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className='font-bold text-sm text-indigo-600 animate-pulse'>Writing your article copy...</p>
            </div>
          ) : result ? (
            <div className='prose prose-sm max-w-none text-slate-700 leading-relaxed reset-tw'>
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <div className='h-full flex justify-center items-center text-sm flex-col gap-4 text-slate-400 py-10'>
              <div className='w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm'>
                <Edit className='w-6 h-6 text-slate-300' />
              </div>
              <p className='font-bold text-slate-700 text-sm'>No article copy generated yet</p>
              <p className='text-center text-xs max-w-xs text-slate-400 leading-relaxed'>Enter a topic on the configuration panel and click "Generate Article" to start.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WriteArticle
