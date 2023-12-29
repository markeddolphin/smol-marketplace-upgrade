import { toHMS } from "@utils";
import { useEffect, useRef, useState } from "react";

const Timer = ({seconds, onElapsed} : {seconds: number; onElapsed: () => void;}) => {
    const [timeLeft, setTimeLeft] = useState<number>(seconds);
    const interval = useRef<NodeJS.Timeout>();
    const previousValue = useRef<number>(seconds);
    useEffect(() => {
        interval.current = setInterval(() => {
            if (previousValue.current < 1) {    
                clearInterval(interval.current);
            } else {
                setTimeLeft(prevVal => prevVal - 1);
            }
        }, 1000);
        return () => clearInterval(interval.current);
    }, []); 
    useEffect(() => {
        if (timeLeft < 1) onElapsed();
        previousValue.current = timeLeft;
    }, [timeLeft])
    return (
        <>{toHMS(timeLeft)}</>
    )
}

export default Timer;