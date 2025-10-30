import React from 'react'

const CreationItem = ({ item }) => {
  return (
    <div className='p-4 max-w-5xl w-full bg-white border border-gray-200 rounded-lg cursor-pointer hover:-translate-y-1 transition-all duration-200'>
      <div className='flex justify-between items-center gap-4'>
        <div>
          <h2 className='font-medium text-gray-700'>{item.prompt}</h2>
          <p className='text-gray-500 text-sm'>
            {item.type} • {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full text-xs font-medium'>
          {item.type}
        </button>
      </div>
    </div>
  )
}

export default CreationItem
