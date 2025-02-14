import CursorSVG from "@/public/assets/CursorSVG"

type Props = {
    color: string,
    x: number,
    y: number,
    message: string
}
export default function Cursor({ color, x, y, message }: Props) {
    return (
        <div className="pointer-events-none absolute top-0 left-0" style={{
            transform: `translateX(${x}px) translateY(${y}px)`,
        }}>
            <CursorSVG color={color} /> 
            {
                message && (
                    <div className="absolute left-2 top-5 px-4 py-2 leading-relaxed text-white rounded-3xl" style={{
                        backgroundColor: color,
                    }}>
                        <p>{message}</p>
                    </div>
                )
            }
        </div>
    )
}
