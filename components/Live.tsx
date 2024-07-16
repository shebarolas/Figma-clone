import React, { useCallback, useEffect, useState } from 'react'
import LiveCursor from './Cursor/LiveCursor'
import { useMyPresence, useOthers } from '@liveblocks/react'
import CursorChat from './Cursor/CursorChat';
import { CursorMode } from '@/types/type';

export default function Live() {
    const others = useOthers();
    const [{cursor}, updateMyPresence] = useMyPresence() as any;
    const [cursorState, setCursorState] = useState({
        mode: CursorMode.Hidden,
    });

    const handlePointerMove = useCallback((event : React.PointerEvent) =>{
        event.preventDefault();

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
        updateMyPresence({
            cursor:{
                x,y
            }
        })

    },[])
    const handlePointerLeave = useCallback((event : React.PointerEvent) =>{
        setCursorState({
            mode: CursorMode.Hidden
        })

       updateMyPresence({
        cursor:null,
        message:null
       })

    },[])
    const handlePointerDown = useCallback((event : React.PointerEvent) =>{
        event.preventDefault();

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
        updateMyPresence({
            cursor:{
                x,y
            }
        })

    },[])
    
   useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) =>{
        console.log(e.key);
        if(e.key === '/'){
            setCursorState({
                mode: CursorMode.Chat,
                previousMessage: null,
                message: ''
            })
        }else if(e.key === 'Escape'){
            setCursorState({
                mode: CursorMode.Hidden
            })
            updateMyPresence({
                message: ''
            })
        }
    }
    const onKeyDown = (e: KeyboardEvent) =>{
        if(e.key === '/'){
            e.preventDefault();
        }
    }

    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);
    return () => {
        window.removeEventListener('keyup', onKeyUp);
        window.removeEventListener('keydown', onKeyDown);
    }
  }, [updateMyPresence])

    return (
        <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onPointerDown={handlePointerDown} className="bg-slate-500 h-screen w-full flex justify-center items-center text-center">
            <h1 className="text-xl text-white">Figma Clone</h1>
            {cursor && (
                <CursorChat
                    cursor={cursor}
                    cursorState={cursorState}
                    setCursorState={setCursorState}
                    updateMyPresence={updateMyPresence}
                />
            )}
            <LiveCursor others={others} />
        </div>
    )
}
