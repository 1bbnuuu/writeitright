import { useState, useRef, useEffect } from 'react';
import '@/App.css';
import Navbar from '../components/Navbar';

const LevelOne = () => {
const canvasRef = useRef(null);
const [isDrawing, setIsDrawing] = useState(false);
const [currentLine, setCurrentLine] = useState(null);
const [lines, setLines] = useState([]);
const [score, setScore] = useState(0);
const [gameComplete, setGameComplete] = useState(false);
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
    const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
}, []);

// ini dibikin array biar acak
const getItemPositions = () => {
    if (isMobile) {
    return {
        leftItems: [
        { id: 1, symbol: '🍎', x: 50, y: 80, matched: false },
        { id: 2, symbol: '🌟', x: 50, y: 160, matched: false },
        { id: 3, symbol: '❤️', x: 50, y: 240, matched: false },
        { id: 4, symbol: '🌙', x: 50, y: 320, matched: false }
        ],
        rightItems: [
        { id: 3, symbol: '❤️', x: 270, y: 80, matched: false },
        { id: 2, symbol: '🌟', x: 270, y: 160, matched: false },
        { id: 4, symbol: '🌙', x: 270, y: 240, matched: false },
        { id: 1, symbol: '🍎', x: 270, y: 320, matched: false }
        ]
    };
    } else {
    return {
        leftItems: [
        { id: 1, symbol: '🍎', x: 50, y: 80, matched: false },
        { id: 2, symbol: '🌟', x: 50, y: 160, matched: false },
        { id: 3, symbol: '❤️', x: 50, y: 240, matched: false },
        { id: 4, symbol: '🌙', x: 50, y: 320, matched: false }
        ],
        rightItems: [
        { id: 3, symbol: '❤️', x: 550, y: 80, matched: false },
        { id: 2, symbol: '🌟', x: 550, y: 160, matched: false },
        { id: 4, symbol: '🌙', x: 550, y: 240, matched: false },
        { id: 1, symbol: '🍎', x: 550, y: 320, matched: false }
        ]
    };
    }
};

const [leftItemsState, setLeftItemsState] = useState(getItemPositions().leftItems);
const [rightItemsState, setRightItemsState] = useState(getItemPositions().rightItems);

useEffect(() => {
    const positions = getItemPositions();
    setLeftItemsState(positions.leftItems);
    setRightItemsState(positions.rightItems);
    resetGame();
}, [isMobile]);

useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lines.forEach(line => {
    ctx.strokeStyle = line.correct ? '#10B981' : '#EF4444';
    ctx.lineWidth = isMobile ? 2 : 3;
    ctx.beginPath();
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
    ctx.stroke();
    });

    if (currentLine) {
    ctx.strokeStyle = '#F97316';
    ctx.lineWidth = isMobile ? 2 : 3;
    ctx.beginPath();
    ctx.moveTo(currentLine.startX, currentLine.startY);
    ctx.lineTo(currentLine.endX, currentLine.endY);
    ctx.stroke();
    }
}, [lines, currentLine, isMobile]);

// Get position from both mouse and touch events
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

const isNearItem = (eventPos, item, threshold = null) => {
    const defaultThreshold = isMobile ? 40 : 30;
    const actualThreshold = threshold || defaultThreshold;
    
    const distance = Math.sqrt(
    Math.pow(eventPos.x - item.x, 2) + Math.pow(eventPos.y - item.y, 2)
    );
    return distance <= actualThreshold;
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
    const positions = getItemPositions();
    setLines([]);
    setScore(0);
    setGameComplete(false);
    setLeftItemsState(positions.leftItems);
    setRightItemsState(positions.rightItems);
    setCurrentLine(null);
    setIsDrawing(false);
};

return (
    <>
    <Navbar />
    <main className="p-2 sm:p-4 flex flex-col justify-center items-center mt-4 sm:mt-10 text-orange-500">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">HUBUNGKAN</h1>
        <p className="mb-4 text-sm sm:text-base text-center">Hubungkan gambar yang sama dengan menarik garis</p>

        {gameComplete && (
        <div className="mb-4 p-3 sm:p-4 bg-green-100 border border-green-400 rounded text-green-700 text-center text-sm sm:text-base max-w-sm">
            🎉 Selamat! Anda berhasil menyelesaikan semua pasangan!
        </div>
        )}

        <div className="relative rounded-lg w-full max-w-[320px] md:max-w-[600px] overflow-hidden">
        <canvas
            ref={canvasRef}
            width={isMobile ? 320 : 600}
            height={isMobile ? 400 : 600}
            className="block w-full h-auto touch-none"
            style={{ 
            touchAction: 'none',
            cursor: isDrawing ? 'grabbing' : 'crosshair'
            }}
            // Mouse events
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleCancel}
            // Touch events
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            onTouchCancel={handleCancel}
        />

        {leftItemsState.map(item => (
            <div
            key={`left-${item.id}`}
            className={`absolute ${isMobile ? 'text-2xl' : 'text-4xl'} select-none pointer-events-none transform -translate-x-1/2 -translate-y-1/2 ${
                item.matched ? 'opacity-50' : 'opacity-100'
            }`}
            style={{ left: item.x, top: item.y }}
            >
            {item.symbol}
            </div>
        ))}

        {rightItemsState.map(item => (
            <div
            key={`right-${item.id}`}
            className={`absolute ${isMobile ? 'text-2xl' : 'text-4xl'} select-none pointer-events-none transform -translate-x-1/2 -translate-y-1/2 ${
                item.matched ? 'opacity-50' : 'opacity-100'
            }`}
            style={{ left: item.x, top: item.y }}
            >
            {item.symbol}
            </div>
        ))}
        </div>
                <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
        <div className="text-base sm:text-lg font-semibold">Skor: {score}</div>
        <button
            onClick={resetGame}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm sm:text-base touch-manipulation"
        >
            Reset Game
        </button>
        </div>
    </main>
    </>
);
};

export default LevelOne;