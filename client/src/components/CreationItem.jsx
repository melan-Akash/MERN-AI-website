import React, { useState } from 'react'
import Markdown from 'react-markdown'
import { ChevronDown, ChevronUp, Sparkles, Image as ImageIcon, Calendar } from 'lucide-react'

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false)

  const getTypeStyle = (type) => {
    switch (type) {
      case 'image':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100/50'
      case 'article':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100/50'
      case 'title':
        return 'bg-purple-50 text-purple-600 border-purple-100/50'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100'
    }
  }

  return (
    <div 
      onClick={() => setExpanded(!expanded)} 
      className={`p-5 w-full bg-white border rounded-2xl cursor-pointer hover:shadow-md transition-all duration-300 ${
        expanded ? 'border-slate-200 shadow-sm' : 'border-slate-100'
      }`}
    >
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3.5 min-w-0'>
          <div className={`p-2.5 rounded-xl border shrink-0 ${getTypeStyle(item.type)}`}>
            {item.type === 'image' ? <ImageIcon className='w-4.5 h-4.5' /> : <Sparkles className='w-4.5 h-4.5' />}
          </div>
          <div className='min-w-0'>
            <h3 className='font-bold text-slate-800 text-sm truncate leading-snug max-w-xl md:max-w-2xl'>
              {item.prompt}
            </h3>
            <div className='flex items-center gap-2 text-slate-400 text-xs mt-1 font-medium'>
              <Calendar className='w-3.5 h-3.5' />
              <span>{new Date(item.created_at || item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-3 shrink-0'>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize tracking-wider ${getTypeStyle(item.type)}`}>
            {item.type}
          </span>
          <div className='text-slate-400 p-1 hover:bg-slate-50 rounded-lg transition-colors'>
            {expanded ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className='mt-5 pt-5 border-t border-slate-100 animate-fade-in'>
          {item.type === 'image' ? (
            <div className='relative group max-w-lg overflow-hidden rounded-2xl border border-slate-100 shadow-sm'>
              <img src={item.content} alt={item.prompt} className='w-full object-cover max-h-96' />
            </div>
          ) : (
            <div className='bg-slate-50/50 border border-slate-100/50 p-5 rounded-2xl max-w-none text-slate-700 leading-relaxed text-sm overflow-x-auto custom-scrollbar prose prose-sm prose-indigo'>
              <div className='reset-tw'>
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreationItem
