import React from 'react'

const Header = ({heading, text}) => {
  return (
    <div>
      <div className='grid gap-y-3 font-light'>
          <div className=' text-xl font-bold text-neutral-200'>{heading}</div>
          <div >{text}</div>
        </div>
    </div>
  )
}

export default Header