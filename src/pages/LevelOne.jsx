import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import completeStageSound from '@/assets/sound/completestage.wav';
import { ClickSound,Tutor1,pauseTutor1} from '@/utilities/ClickSound';
import lvl1 from '@/assets/sound/dub_lvl1.mp3';
import vtutor1 from "@/assets/video/lvl1.mp4"

const LevelOne = () => {
const navigate = useNavigate();
const canvasRef = useRef(null);
const videoRef = useRef(null);
const [isDrawing, setIsDrawing] = useState(false);
const [currentLine, setCurrentLine] = useState(null);
const [lines, setLines] = useState([]);
const [score, setScore] = useState(0);
const [gameComplete, setGameComplete] = useState(false);
const [isMobile, setIsMobile] = useState(true);
const [currentStage, setCurrentStage] = useState(1);
const [showTutorial, setShowTutorial] = useState(true);
const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

const symbolCollection = [
    '🍎', '🌟', '❤️', '🌙', '🐱', '🌸', '⚡', '🎵', 
    '🦋', '🌈', '🔥', '💎', '🌺', '🎈', '🎯', '🎪',
    '🌊', '☀️', '🌿', '🍀', '🎭', '🎨', '🎲', '🎸',
    '🦄', '🌞', '🐠', '🌻', '🎀', '🔮', '💫', '🌷'
];

const totalStages = 5;

const playCompleteStageMusic = () => {
    try {
        const audio = new Audio(completeStageSound);
        audio.volume = 0.7;
        audio.play().catch(error => {
            console.log('Audio play failed:', error);
        });
    } catch (error) {
        console.log('Audio creation failed:', error);
    }
};

    const audioRef = useRef(null);

    useEffect(() => {
        const audio = new Audio(lvl1);
        audioRef.current = audio;
        audio.play();

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

const closeTutorial = () => {
    setShowTutorial(false);
    setHasSeenTutorial(true);
    if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
    }
    ClickSound();
    pauseTutor1();
}
const skipTutorial = () => {
    pauseTutor1();
    closeTutorial();
};

const openTutorial = () => {
    setShowTutorial(true);
    ClickSound();
    Tutor1();
};

useEffect(() => {
    const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
}, []);

useEffect(() => {
    if (gameComplete) {
        playCompleteStageMusic();
    }
}, [gameComplete]);

useEffect(() => {
    if (showTutorial && videoRef.current) {
        videoRef.current.play().catch(error => {
            console.log('Video autoplay failed:', error);
        });
    }
}, [showTutorial]);

const generateRandomSymbols = (count) => {
    const shuffled = [...symbolCollection].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

const getItemPositions = (stage) => {
    const itemCount = Math.min(stage, 5);
    const symbols = generateRandomSymbols(itemCount);
    
    const rightSymbols = [...symbols].sort(() => Math.random() - 0.5);
    
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
                    setTimeout(() => {
                        navigate('/completion');
                    }, 1000);
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

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col">
        {/* Video Tutorial Popup */}
        {showTutorial && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-4 text-white">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                🎯 Tutorial Game
                            </h2>
                            <button
                                onClick={closeTutorial}
                                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
                            <video
                                src={vtutor1}
                                autoPlay
                                muted
                                loop
                            >
                                <p className="p-4 text-center text-gray-600">
                                    Browser Anda tidak mendukung pemutaran video.
                                </p>
                            </video>
                        </div>

                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Cara Bermain:
                            </h3>
                            <div className="text-sm text-gray-600 space-y-2">
                                <p>🎯 Hubungkan gambar yang sama di sisi kiri dan kanaSn</p>
                                <p>✨ Tarik garis dari gambar kiri ke gambar kanan yang cocok</p>
                                <p>🏆 Selesaikan semua pasangan untuk menyelesaikan stage</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={skipTutorial}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-full font-semibold transition-colors"
                            >
                                Skip Tutorial
                            </button>
                            <button
                                onClick={closeTutorial}
                                className="flex-1 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white py-3 px-6 rounded-full font-semibold transition-all transform hover:scale-105"
                            >
                                Mulai Game! 🎮
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg p-4 rounded-b-3xl">
            <h1 className="text-2xl font-bold text-center text-orange-500 mb-2">
                HUBUNGKAN GAMBAR
            </h1>
            <div className="flex justify-center items-center gap-4 text-sm">
                <div className="bg-orange-100 px-3 py-1 rounded-full">
                    <span className="text-orange-600 font-semibold">Stage {currentStage}/{totalStages}</span>
                </div>
                {/* Button untuk membuka tutorial lagi */}
                {hasSeenTutorial && (
                    <button
                        onClick={openTutorial}
                        className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full text-blue-600 text-xs font-semibold transition-colors"
                    >
                        🎯 Tutorial
                    </button>
                )}
            </div>
        </div>

        {/* Game Complete Notification */}
        <div className="absolute w-full">
        {gameComplete && (
            <div className="relative z-20">
                <div className="bg-green-100 border-2 border-green-300 rounded-b-3xl p-4 text-center shadow-lg">
                    <div className="text-3xl mb-2">🎉</div>
                    <p className="text-green-700 font-bold">
                        Selamat! Stage {currentStage} selesai!
                    </p>
                    {currentStage < totalStages ? (
                        <p className="text-green-600 text-sm mt-1">
                            Tap panah kanan untuk lanjut →
                        </p>
                    ) : (
                        <p className="text-green-600 text-sm mt-1">
                            Menuju halaman selesai...
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