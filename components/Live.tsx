import React, { useCallback, useState } from 'react'
import LiveCursor from './Cursor/LiveCursor'
import { useMyPresence, useOthers } from '@liveblocks/react'
import CursorChat from './Cursor/CursorChat';
import { CursorMode } from '@/types/type';

export default function Live() {
    const others = useOthers();
    const [{cursor}, updateMyPresence] = useMyPresence() as any;
    const [cursorState, setCursorState] = useState({
        cursor: CursorMode.Hidden
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
            cursor: CursorMode.Hidden
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
