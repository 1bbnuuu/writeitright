import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClickSound } from '@/utilities/ClickSound';

const LevelOne = () => {
const canvasRef = useRef(null);
const [isDrawing, setIsDrawing] = useState(false);
const [currentLine, setCurrentLine] = useState(null);
const [lines, setLines] = useState([]);
const [score, setScore] = useState(0);
const [gameComplete, setGameComplete] = useState(false);
const [isMobile, setIsMobile] = useState(true);
const [currentStage, setCurrentStage] = useState(1);
const [allStagesComplete, setAllStagesComplete] = useState(false);

const symbolCollection = [
    '🍎', '🌟', '❤️', '🌙', '🐱', '🌸', '⚡', '🎵', 
    '🦋', '🌈', '🔥', '💎', '🌺', '🎈', '🎯', '🎪',
    '🌊', '☀️', '🌿', '🍀', '🎭', '🎨', '🎲', '🎸',
    '🦄', '🌞', '🐠', '🌻', '🎀', '🔮', '💫', '🌷'
];

const totalStages = 2;

useEffect(() => {
    const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
}, []);

const generateRandomSymbols = (count) => {
    const shuffled = [...symbolCollection].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

const getItemPositions = (stage) => {
    // Stage 1-5: tantangan bertambah sesuai stage, stage 6+ tetap 5 tantangan
    const itemCount = Math.min(stage, 5);
    const symbols = generateRandomSymbols(itemCount);
    
    const rightSymbols = [...symbols].sort(() => Math.random() - 0.5);
    
    // Mobile-first design dengan layout yang lebih playful
    const leftItems = symbols.map((symbol, index) => ({
        id: index + 1,
        symbol: symbol,
        x: 80,
        y: 80 + (index * 70),
        matched: false
    }));
    
    const rightItems = rightSymbols.map((symbol, index) => ({
        id: symbols.indexOf(symbol) + 1,
        symbol: symbol,
        x: 240,
        y: 80 + (index * 70),
        matched: false
    }));
    
    return { leftItems, rightItems };
};

const [leftItemsState, setLeftItemsState] = useState(() => getItemPositions(currentStage).leftItems);
const [rightItemsState, setRightItemsState] = useState(() => getItemPositions(currentStage).rightItems);

useEffect(() => {
    const positions = getItemPositions(currentStage);
    setLeftItemsState(positions.leftItems);
    setRightItemsState(positions.rightItems);
    resetGame();
}, [isMobile, currentStage]);

useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background pattern
    // ctx.fillStyle = '#FFF7ED';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some playful dots
    // ctx.fillStyle = '#FED7AA';
    // for (let i = 0; i < 20; i++) {
    //     const x = Math.random() * canvas.width;
    //     const y = Math.random() * canvas.height;
    //     ctx.beginPath();
    //     ctx.arc(x, y, 2, 0, 2 * Math.PI);
    //     ctx.fill();
    // }

    // Draw connection lines
    lines.forEach(line => {
        ctx.strokeStyle = line.correct ? '#10B981' : '#EF4444';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.shadowColor = line.correct ? '#10B981' : '#EF4444';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();
        ctx.shadowBlur = 0;
    });

    // Draw current line being drawn
    if (currentLine) {
        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#F97316';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(currentLine.startX, currentLine.startY);
        ctx.lineTo(currentLine.endX, currentLine.endY);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}, [lines, currentLine, isMobile]);

const getEventPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
};

const isNearItem = (eventPos, item, threshold = 50) => {
    const distance = Math.sqrt(
        Math.pow(eventPos.x - item.x, 2) + Math.pow(eventPos.y - item.y, 2)
    );
    return distance <= threshold;
};

const findNearestItem = (eventPos, items) => {
    return items.find(item => isNearItem(eventPos, item)) || null;
};

const handleStart = (e) => {
    e.preventDefault();
    const eventPos = getEventPos(e);
    const leftItem = findNearestItem(eventPos, leftItemsState);

    if (leftItem && !leftItem.matched) {
        setIsDrawing(true);
        setCurrentLine({
            startX: leftItem.x,
            startY: leftItem.y,
            endX: eventPos.x,
            endY: eventPos.y,
            startItem: leftItem
        });
    }
};

const handleMove = (e) => {
    e.preventDefault();
    if (!isDrawing || !currentLine) return;
    
    const eventPos = getEventPos(e);
    setCurrentLine(prev => ({
        ...prev,
        endX: eventPos.x,
        endY: eventPos.y
    }));
};

const handleEnd = (e) => {
    e.preventDefault();
    if (!isDrawing || !currentLine) return;

    const eventPos = getEventPos(e);
    const rightItem = findNearestItem(eventPos, rightItemsState);

    if (rightItem && !rightItem.matched) {
        const isCorrect = currentLine.startItem.id === rightItem.id;

        const newLine = {
            startX: currentLine.startX,
            startY: currentLine.startY,
            endX: rightItem.x,
            endY: rightItem.y,
            correct: isCorrect,
            startItem: currentLine.startItem,
            endItem: rightItem
        };

        setLines(prev => [...prev, newLine]);

        if (isCorrect) {
            setScore(prev => prev + 10);
            setLeftItemsState(prev =>
                prev.map(item =>
                    item.id === currentLine.startItem.id ? { ...item, matched: true } : item
                )
            );
            setRightItemsState(prev =>
                prev.map(item =>
                    item.id === rightItem.id ? { ...item, matched: true } : item
                )
            );

            const totalMatched = leftItemsState.filter(item => item.matched).length + 1;
            if (totalMatched === leftItemsState.length) {
                setGameComplete(true);
                if (currentStage === totalStages) {
                    setAllStagesComplete(true);
                }
            }
        }
    }

    setIsDrawing(false);
    setCurrentLine(null);
};

const handleCancel = () => {
    setIsDrawing(false);
    setCurrentLine(null);
};

const resetGame = () => {
    const positions = getItemPositions(currentStage);
    setLines([]);
    setScore(0);
    setGameComplete(false);
    setLeftItemsState(positions.leftItems);
    setRightItemsState(positions.rightItems);
    setCurrentLine(null);
    setIsDrawing(false);
};

const nextStage = () => {
    if (currentStage < totalStages) {
        setCurrentStage(prev => prev + 1);
    }
};

const previousStage = () => {
    if (currentStage > 1) {
        setCurrentStage(prev => prev - 1);
    }
};

const handleBackClick = () => {
    if (currentStage > 1) {
        previousStage();
    }
};

const handleForwardClick = () => {
    if (gameComplete && currentStage < totalStages) {
        nextStage();
    }
};

if (allStagesComplete) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 flex flex-col justify-center items-center text-center p-6">
            <div className="bg-white rounded-3xl p-8 shadow-2xl transform scale-105 flex flex-col gap-2">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-3xl font-bold text-orange-500 mb-4">SELAMAT!</h1>
                <p className="text-gray-600 mb-6">Anda telah menyelesaikan semua stage! Hebat sekali!</p>
                <button 
                    className="bg-gradient-to-r from-orange-400 to-pink-400 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={() => window.location.reload()}
                >
                    <span>Main Lagi 🎮</span>
                </button>
                <Link to="/select-level">
                <button className="bg-orange-500 text-white w-full py-3 px-8 rounded-full font-semibold shadow-lg text-lg hover:bg-orange-600 transition-colors"
                >🏠 pilih level</button>
                </Link>
            </div>
        </div>
    );
}

const getCurrentChallengeCount = (stage) => {
    return Math.min(stage, 5);
};

return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg p-4 rounded-b-3xl">
            <h1 className="text-2xl font-bold text-center text-orange-500 mb-2">
                HUBUNGKAN GAMBAR
            </h1>
            <div className="flex justify-center items-center gap-4 text-sm">
                <div className="bg-orange-100 px-3 py-1 rounded-full">
                    <span className="text-orange-600 font-semibold">Stage {currentStage}/{totalStages}</span>
                </div>
            </div>
        </div>

        {/* Success Message */}
        <div className="absolute w-full">
        {gameComplete && (
            <div className="relative z-20">
                <div className=" bg-green-100 border-2 border-green-300 rounded-b-3xl p-4 text-center shadow-lg">
                    <div className="text-3xl mb-2">🎉</div>
                    <p className="text-green-700 font-bold">
                        Selamat! Stage {currentStage} selesai!
                    </p>
                    {currentStage < totalStages && (
                        <p className="text-green-600 text-sm mt-1">
                            Tap panah kanan untuk lanjut →
                        </p>
                    )}
                </div>
            </div>
        )}
        </div>

        {/* Game Canvas */}
        <div className="flex-1 flex justify-center items-center p-4">
            <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={320}
                    height={440}
                    className="block touch-none"
                    style={{ 
                        touchAction: 'none',
                        cursor: isDrawing ? 'grabbing' : 'crosshair'
                    }}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleCancel}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                    onTouchCancel={handleCancel}
                />

                {/* Left Items */}
                {leftItemsState.map(item => (
                    <div
                        key={`left-${item.id}`}
                        className={`absolute text-4xl select-none pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                            item.matched 
                                ? 'opacity-30 scale-75' 
                                : 'opacity-100 scale-100 drop-shadow-lg hover:scale-110'
                        }`}
                        style={{ 
                            left: item.x, 
                            top: item.y,
                            filter: item.matched ? 'grayscale(50%)' : 'none'
                        }}
                    >
                        <div className={`bg-white rounded-full p-2 border-4 ${
                            item.matched ? 'border-green-300' : 'border-orange-300'
                        } shadow-lg`}>
                            {item.symbol}
                        </div>
                    </div>
                ))}

                {/* Right Items */}
                {rightItemsState.map(item => (
                    <div
                        key={`right-${item.id}`}
                        className={`absolute text-4xl select-none pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                            item.matched 
                                ? 'opacity-30 scale-75' 
                                : 'opacity-100 scale-100 drop-shadow-lg hover:scale-110'
                        }`}
                        style={{ 
                            left: item.x, 
                            top: item.y,
                            filter: item.matched ? 'grayscale(50%)' : 'none'
                        }}
                    >
                        <div className={`bg-white rounded-full p-2 border-4 ${
                            item.matched ? 'border-green-300' : 'border-blue-300'
                        } shadow-lg`}>
                            {item.symbol}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Controls */}
        <div className="p-4">
            <div className="flex justify-center">
                <button
                    onClick={() => {resetGame();ClickSound();}}
                    className="bg-gradient-to-r from-red-400 to-pink-400 text-white py-3 px-6 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                    🔄 Reset Stage
                </button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center px-4">
                <button 
                    onClick={() => {handleBackClick();ClickSound()}}
                    disabled={currentStage === 1}
                    className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                        currentStage === 1 
                            ? 'opacity-30 cursor-not-allowed bg-gray-300' 
                            : 'bg-gradient-to-r from-blue-400 to-purple-400 hover:scale-110 shadow-xl'
                    }`}
                >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 17">
                        <path fillRule="evenodd" clipRule="evenodd" d="M20 16.918C17.5533 13.9313 15.3807 12.2367 13.482 11.834C11.5833 11.4313 9.77567 11.3705 8.059 11.6515V17L0 8.2725L8.059 0V5.0835C11.2333 5.1085 13.932 6.24733 16.155 8.5C18.3777 10.7527 19.6593 13.5587 20 16.918Z"/>
                    </svg>
                </button>
                <div className="text-center mt-4">
                    <Link to="/select-level" onClick={ClickSound}>
                        <button className="bg-orange-500 text-white py-2 px-6 rounded-full font-semibold shadow-lg hover:bg-orange-600 transition-colors">
                            🏠 pilih level
                        </button>
                    </Link>
                </div>
                <button 
                    onClick={() => {handleForwardClick();ClickSound()}}
                    disabled={!gameComplete || currentStage === totalStages}
                    className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                        (!gameComplete || currentStage === totalStages)
                            ? 'opacity-30 cursor-not-allowed bg-gray-300' 
                            : 'bg-gradient-to-r from-green-400 to-blue-400 hover:scale-110 shadow-xl'
                    }`}
                >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 17">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 16.918C2.44667 13.9313 4.61933 12.2367 6.518 11.834C8.41667 11.4313 10.2243 11.3705 11.941 11.6515V17L20 8.2725L11.941 0V5.0835C8.76667 5.1085 6.068 6.24733 3.845 8.5C1.62233 10.7527 0.340666 13.5587 0 16.918Z"/>
                    </svg>
                </button>
            </div>
            
        </div>
    </div>
);
};

export default LevelOne;