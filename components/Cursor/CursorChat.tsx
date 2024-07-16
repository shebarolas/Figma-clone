import CursorSVG from '@/public/assets/CursorSVG'
import { CursorChatProps, CursorMode } from '@/types/type'
import React from 'react'

export default function CursorChat({ cursor, cursorState, setCursorState, updateMyPresence }: CursorChatProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({
      message: e.target.value
    })
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: e.target.value
    })

  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e);
    if (e.key === 'Enter') {
      setCursorState({
        mode: CursorMode.Chat,
        previousMessage: cursorState.message,
        message: ''
      });
    } else if (e.key === 'Escape') {
      setCursorState({
        mode: CursorMode.Hidden
      });
    }


  }

  return (
    <div className='absolute top-0 left-0' style={{
      transform: `translatex(${cursor.x}px) translateY(${cursor.y}px)`
    }}>
      {
        cursorState.mode === CursorMode.Chat && (
          <>
            <CursorSVG color='#000' />
            <div className="absolute left-2 top-5 bg-blue-400 px-4 py-2 leading-relaxed text-white rounded-3xl">
              <input type="text" className='z-10 w-60 border-none bg-transparent text-white outline-none placeholder-blue-100'
                onChange={handleChange} onKeyDown={handleKeyDown}
                autoFocus={true} placeholder='Text' />
            </div>
          </>
        )
      }



    </div>
  )
}
