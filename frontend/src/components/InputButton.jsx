import React from 'react'
import Input from './Input'

const InputButton = ({text, type, disabled, isLoading, loadingText, onClick}) => {
  return (
    <div>
      <button onClick={onClick} type={type} className='w-full font-bold focus:outline-2 focus:outline-white rounded-md h-10 bg-[#27272a] placeholder-text-neutral-600' disabled={disabled}>{isLoading ? loadingText : text}</button>
    </div>
  )
}

export default InputButton