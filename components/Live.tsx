import React, { useCallback, useEffect, useState } from 'react'
import LiveCursor from './Cursor/LiveCursor'
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '@liveblocks/react'
import CursorChat from './Cursor/CursorChat';
import { CursorMode, CursorState, Reaction } from '@/types/type';
import ReactionSelector from './Reaction/ReactionSelector';
import FlyingReaction from './Reaction/FlyingReaction';
import useInterval from '@/hooks/useInterval';

export default function Live() {
    const others = useOthers();
    const [{ cursor }, updateMyPresence] = useMyPresence() as any;
    const [cursorState, setCursorState] = useState<CursorState>({
        mode: CursorMode.Hidden,
    });
    const [reaction, setReaction] = useState<Reaction[]>([])

    const broadcast = useBroadcastEvent();

    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        event.preventDefault();

        if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {
            const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
            const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
            updateMyPresence({
                cursor: {
                    x, y
                }
            })
        }



    }, [])
    const handlePointerLeave = useCallback((event: React.PointerEvent) => {
        setCursorState({
            mode: CursorMode.Hidden
        })

        updateMyPresence({
            cursor: null,
            message: null
        })

    }, [])
    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        event.preventDefault();

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
        updateMyPresence({
            cursor: {
                x, y
            }
        })
        setCursorState((state: CursorState) => 
            cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
        );

    }, [cursorState.mode, setCursorState])

    const handlePointerUp = useCallback((event: React.PointerEvent) => {
        setCursorState((state: CursorState) =>
            cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state
        );
    }, [cursorState.mode, setCursorState])
    
    const setReactions = useCallback((reaction: string) => {
        setCursorState({mode: CursorMode.Reaction, reaction, isPressed: false});
    },[]);
    

    useInterval(() => {
        if(cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor){
            console.log(cursorState, cursor);
            setReaction((reaction) => reaction.concat([
                {
                    point: {x: cursor.x, y: cursor.y},
                    value: cursorState.reaction,
                    timestamp: Date.now()
                }
            ]));
            broadcast({
                x: cursor.x,
                y: cursor.y,
                value: cursorState.reaction,
                othe: "hola"
            })
        }
    }, 100);

    useEventListener((eventData) =>{
        const event = eventData.event as any;
        console.log(event);

        setReaction((reaction) => reaction.concat([
            {
                point: {x: event.x, y: event.y},
                value: event.value,
                timestamp: Date.now()
            }
        ]));
    });

    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
            console.log(e.key);
            if (e.key === '/') {
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: ''
                })
            } else if (e.key === 'Escape') {
                setCursorState({
                    mode: CursorMode.Hidden
                })
                updateMyPresence({
                    message: ''
                })
            }else if (e.key === 'e'){
                setCursorState({
                    mode: CursorMode.ReactionSelector
                });
            }
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/') {
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
        <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} className="bg-slate-500 h-screen w-full flex justify-center items-center text-center">
            <h1 className="text-xl text-white">Figma Clone</h1>
            {console.log(reaction)}
            {reaction.map((r) => (
                <FlyingReaction
                    key={r.timestamp.toString()}
                    x={r.point.x}
                    y={r.point.y}
                    timestamp={r.timestamp}
                    value={r.value}
                />
            ))}
            {cursor && (
                <CursorChat
                    cursor={cursor}
                    cursorState={cursorState}
                    setCursorState={setCursorState}
                    updateMyPresence={updateMyPresence}
                />
            )}
            {cursorState.mode === CursorMode.ReactionSelector && (
                <ReactionSelector
                    setReaction={setReactions}
                />
            )}
            <LiveCursor others={others} />
        </div>
    )
}
