import React from 'react'

const Input = ({placeholder, label, type, onChange, value}) => {
  return (
    <div>
      <div className='pb-1 font-semibold'>
      <label className=''>{label}</label>
      </div>
      <input onChange={onChange} type={type} value={value} className='w-full py-2 pl-3 focus:outline-2 focus:outline-zinc-600 rounded-md h-10 bg-[#27272a] placeholder-text-neutral-600' placeholder={placeholder} />
    </div>
  )
}

export default Input