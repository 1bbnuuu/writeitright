import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
// import completeStageSound from "@/assets/sound/completestage.wav";
import { ClickSound } from "@/utilities/ClickSound";

const targetShape = [
    {
        name: "Garis",
        points: [
            { x: 30, y: 50 },
            { x: 290, y: 350 },
        ],
    },
    {
        name: "Segitiga",
        points: [
            { x: 160, y: 50 },
            { x: 60, y: 300 },
            { x: 260, y: 300 },
            { x: 160, y: 50 },
        ],
    },
    {
        name: "Kotak",
        points: [
            { x: 60, y: 100 },
            { x: 260, y: 100 },
            { x: 260, y: 300 },
            { x: 60, y: 300 },
            { x: 60, y: 100 },
        ],
    },
    {
        name: "Lingkaran",
        center: { x: 160, y: 200 },
        radius: 100,
        isCircle: true,
    },
    {
        name: "Trapesium",
        points: [
            { x: 100, y: 100 },
            { x: 220, y: 100 },
            { x: 280, y: 300 },
            { x: 40, y: 300 },
            { x: 100, y: 100 },
        ],
    },
];

const LevelTwo = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [userPath, setUserPath] = useState([]);
    const [accuracy, setAccuracy] = useState(0);

    const [gameComplete, setGameComplete] = useState(false);
    const [_isMobile, _setIsMobile] = useState(true);
    const [currentStage, setCurrentStage] = useState(1);

    const drawTargetShape = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(0,0,255,0.3)";
        ctx.lineWidth = 3;
        ctx.beginPath();

        const currentShape = targetShape[currentStage - 1];
        if (currentShape.isCircle) {
            const { center, radius } = currentShape;
            ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        } else {
            currentShape.points.forEach((pt, i) => {
                if (i === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            });
        }

        ctx.closePath();
        ctx.stroke();
    };

    useEffect(() => {
        drawTargetShape();
        setGameComplete(false);
    }, [currentStage]);
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
            y: clientY - rect.top,
        };
    };

    const handleStart = (e) => {
        if (gameComplete) return;
        setDrawing(true);
        const event = getEventPos(e);

        setUserPath([{ ...event }]);
    };

    const handleMove = (e) => {
        if (!drawing) return;
        const event = getEventPos(e);
        const point = { ...event };
        setUserPath((prev) => {
            const newPath = [...prev, point];
            const ctx = canvasRef.current.getContext("2d");
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(prev[prev.length - 1].x, prev[prev.length - 1].y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
            return newPath;
        });
    };

    const handleEnd = () => {
        setDrawing(false);
        setGameComplete(true);

        if (currentStage === targetShape.length) {
            setTimeout(() => {
                navigate("/completion");
            }, 1000);
        }
    };

    const handleCancel = () => {
        setDrawing(false);
    };
    useEffect(() => {
        if (userPath.length < 5) {
            setAccuracy(null);
            return;
        }

        // ===== Resample Path =====
        function resamplePath(path, count) {
            if (path.length === 0) return [];

            const totalLength = path.reduce((sum, pt, i) => {
                if (i === 0) return 0;
                const dx = pt.x - path[i - 1].x;
                const dy = pt.y - path[i - 1].y;
                return sum + Math.sqrt(dx * dx + dy * dy);
            }, 0);

            const segmentLength = totalLength / (count - 1);
            let resampled = [path[0]];
            let distAcc = 0;
            let i = 1;

            while (resampled.length < count && i < path.length) {
                const prev = resampled[resampled.length - 1];
                const curr = path[i];
                const dx = curr.x - prev.x;
                const dy = curr.y - prev.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (distAcc + dist >= segmentLength) {
                    const ratio = (segmentLength - distAcc) / dist;
                    const newX = prev.x + ratio * dx;
                    const newY = prev.y + ratio * dy;
                    resampled.push({ x: newX, y: newY });
                    distAcc = 0;
                } else {
                    distAcc += dist;
                    i++;
                }
            }

            while (resampled.length < count) {
                resampled.push(path[path.length - 1]);
            }

            return resampled;
        }

        // ===== Generate Target Shape Points =====
        let targetPath = [];

        const shape = targetShape[currentStage - 1];
        if (shape.isCircle) {
            const { center, radius } = shape;
            for (let i = 0; i < 100; i++) {
                const angle = (i / 100) * 2 * Math.PI;
                targetPath.push({
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle),
                });
            }
        } else {
            const points = shape.points;
            for (let i = 0; i < points.length - 1; i++) {
                const start = points[i];
                const end = points[i + 1];
                for (let j = 0; j < 20; j++) {
                    const t = j / 20;
                    targetPath.push({
                        x: start.x + t * (end.x - start.x),
                        y: start.y + t * (end.y - start.y),
                    });
                }
            }
        }

        const resampledTarget = resamplePath(targetPath, 100);
        const resampledUser = resamplePath(userPath, 100);

        let totalDist = 0;
        for (let i = 0; i < 100; i++) {
            const dx = resampledTarget[i].x - resampledUser[i].x;
            const dy = resampledTarget[i].y - resampledUser[i].y;
            totalDist += Math.sqrt(dx * dx + dy * dy);
        }

        const avg = totalDist / 100;
        const acc = Math.max(0, 100 - avg); // skala akurasi dari 0 - 100

        setAccuracy(acc.toFixed(2));
    }, [userPath, currentStage]);

    return (
        <div className=" min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col">
            <div className="bg-white/80 backdrop-blur-sm shadow-lg p-4 rounded-b-3xl">
                <h1 className="text-2xl font-bold text-center text-orange-500 mb-2">
                    Gambar Geometri
                </h1>
                <div className="flex justify-center items-center gap-4 text-sm">
                    <div className="bg-orange-100 px-3 py-1 rounded-full">
                        <span className="text-orange-600 font-semibold">
                            Stage {currentStage}/{targetShape.length} {accuracy}
                            %
                        </span>
                    </div>
                </div>
            </div>

            <div className="absolute w-full">
                {gameComplete && (
                    <div className="relative z-20">
                        <div className=" bg-green-100 border-2 border-green-300 rounded-b-3xl p-4 text-center shadow-lg">
                            <div className="text-3xl mb-2">🎉</div>
                            <p className="text-green-700 font-bold">
                                Selamat! Stage {currentStage} selesai! dengan
                                akurasi {accuracy}%
                            </p>
                            {currentStage < targetShape.length ? (
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

            <div className="flex-1 flex justify-center items-center p-4">
                <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        width={320}
                        height={440}
                        className="block touch-none"
                        style={{
                            touchAction: "none",
                            cursor: "auto",
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
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-center">
                    <button
                        onClick={() => {
                            drawTargetShape();
                            setGameComplete(false);
                            setUserPath([]);
                            setAccuracy(0.0);
                            ClickSound();
                        }}
                        className="bg-gradient-to-r from-red-400 to-pink-400 text-white py-3 px-6 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        🔄 Reset Stage
                    </button>
                </div>

                <div className="flex justify-between items-center px-4">
                    <button
                        onClick={() => {
                            setCurrentStage((prev) => prev - 1);
                            ClickSound();
                            setUserPath([]);
                            setAccuracy(0.0);
                        }}
                        disabled={currentStage === 1}
                        className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                            currentStage === 1
                                ? "opacity-30 cursor-not-allowed bg-gray-300"
                                : "bg-gradient-to-r from-blue-400 to-purple-400 hover:scale-110 shadow-xl"
                        }`}
                    >
                        <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 17"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M20 16.918C17.5533 13.9313 15.3807 12.2367 13.482 11.834C11.5833 11.4313 9.77567 11.3705 8.059 11.6515V17L0 8.2725L8.059 0V5.0835C11.2333 5.1085 13.932 6.24733 16.155 8.5C18.3777 10.7527 19.6593 13.5587 20 16.918Z"
                            />
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
                        onClick={() => {
                            setCurrentStage((prev) => prev + 1);
                            ClickSound();
                            setUserPath([]);
                            setAccuracy(0.0);
                        }}
                        disabled={
                            !gameComplete || currentStage === targetShape.length
                        }
                        className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                            !gameComplete || currentStage === targetShape.length
                                ? "opacity-30 cursor-not-allowed bg-gray-300"
                                : "bg-gradient-to-r from-green-400 to-blue-400 hover:scale-110 shadow-xl"
                        }`}
                    >
                        <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 17"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0 16.918C2.44667 13.9313 4.61933 12.2367 6.518 11.834C8.41667 11.4313 10.2243 11.3705 11.941 11.6515V17L20 8.2725L11.941 0V5.0835C8.76667 5.1085 6.068 6.24733 3.845 8.5C1.62233 10.7527 0.340666 13.5587 0 16.918Z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelTwo;