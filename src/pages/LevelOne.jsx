import { useState, useRef, useEffect } from 'react';
import '@/App.css';

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
        { id: 1, symbol: '🍎', x: 50, y: 50, matched: false },
        { id: 2, symbol: '🌟', x: 50, y: 150, matched: false },
        { id: 3, symbol: '❤️', x: 50, y: 250, matched: false },
        { id: 4, symbol: '🌙', x: 50, y: 350, matched: false }
        ],
        rightItems: [
        { id: 3, symbol: '❤️', x: 270, y: 50, matched: false },
        { id: 2, symbol: '🌟', x: 270, y: 150, matched: false },
        { id: 4, symbol: '🌙', x: 270, y: 250, matched: false },
        { id: 1, symbol: '🍎', x: 270, y: 350, matched: false }
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
    <main className="p-2 sm:p-4 flex flex-col justify-center items-center mt-5 text-orange-500">
        <h1 className="text-2xl font-bold mb-2">HUBUNGKAN</h1>
        <p className="mb-4 text-sm sm:text-base text-center">Hubungkan gambar yang sama dengan menarik garis</p>

        {gameComplete && (
        <div className="absolute top-5">
            <div className=" relative z-1000 mb-4 py-3 px-8 bg-green-100 border border-green-400 rounded text-green-700 text-center text-sm sm:text-base max-w-sm">
                🎉 Selamat! Anda berhasil menyelesaikan stage ini!
            </div>
        </div>
        )}
        {/* buat jika ada beberapa yang salah muncul ini */}
        {/* {gameNotComplete && (
        <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 rounded text-red-700 text-center text-sm sm:text-base max-w-sm">
            🎉 Selamat! Anda berhasil menyelesaikan semua pasangan!
        </div>
        )} */}
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
        {/* <div className="text-base sm:text-lg font-semibold">Skor: {score}</div> */}
        <button
            onClick={resetGame}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm sm:text-base touch-manipulation"
        >
            Reset Game
        </button>
        </div>
        <footer
        className="flex w-full justify-between px-5"
        >
            <div>
                <svg className="w-10 h-10 text-sky-400" width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20 16.918C17.5533 13.9313 15.3807 12.2367 13.482 11.834C11.5833 11.4313 9.77567 11.3705 8.059 11.6515V17L0 8.2725L8.059 0V5.0835C11.2333 5.1085 13.932 6.24733 16.155 8.5C18.3777 10.7527 19.6593 13.5587 20 16.918Z" fill="#0084FF"/>
                </svg>
            </div>
            <div>
                <svg className="w-10 h-10 text-sky-400" width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 16.918C2.44667 13.9313 4.61933 12.2367 6.518 11.834C8.41667 11.4313 10.2243 11.3705 11.941 11.6515V17L20 8.2725L11.941 0V5.0835C8.76667 5.1085 6.068 6.24733 3.845 8.5C1.62233 10.7527 0.340666 13.5587 0 16.918Z" fill="#0084FF"/>
                </svg>
            </div>
        </footer>
    </main>
    </>
);
};

export default LevelOne;