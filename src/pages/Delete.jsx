import React, { useState } from 'react'

const Delete = () => {

  const [show, setShow] = useState(true)

  const hide = () => {
    setShow(false)
  }

  return (
    <>
      <div className='bg-zinc-900 text-emerald-400 h-screen w-full flex flex-col items-center justify-center gap-8'>
        
        {show && (
          <h1 className='text-5xl font-bold '>
            Hi! I'll disappear when you click that button
          </h1>
        )}

        <button
          onClick={hide}
          className='px-8 py-4 text-xl font-semibold rounded-xl
                     bg-emerald-500 text-zinc-900
                     hover:bg-emerald-400 hover:scale-105'
        >
          Click me
        </button>

      </div>
    </>
  )
}

export default Delete
