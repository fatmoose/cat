import { useState } from 'react';
import './counter.css';
import ConfettiExplosion from 'react-confetti-explosion';

const Counter = () => {
    const [progress, setProgress] = useState(1);
    const total = 1000000;
    const increment = total * 0.01;
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiKey, setConfettiKey] = useState(0);

    const incrementProgress = () => {
        if (progress <= total) {
            setProgress(progress + increment);
            setShowConfetti(true);
            setConfettiKey(confettiKey + 1);
        }
    };

    const confettiComplete = () => {
        setShowConfetti(false);
    };

    return (
        <div className="container">
            <div className="progress">
                <div className="progress-bar" style={{ width: `${(progress / total) * 100}%` }}>
                    {showConfetti && <ConfettiExplosion key={confettiKey} onComplete={confettiComplete} force={0.8} particleCount={500} width={1600} duration={2000}/>}
                </div>
            </div>
            <div className="progress-text">{progress}/{total}</div>
            <button className="button" onClick={incrementProgress}>Increment</button>
        </div>
    );
};

export default Counter;
