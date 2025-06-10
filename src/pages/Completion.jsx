import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ClickSound } from '@/utilities/ClickSound';
import completionSound from '@/assets/sound/completion.wav';

const Completion = () => {
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = new Audio(completionSound);
        audioRef.current = audio;
        audio.play();

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 flex flex-col justify-center items-center text-center p-6">
            <div className="bg-white rounded-3xl p-8 shadow-2xl transform scale-105 flex flex-col gap-2">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-3xl font-bold text-orange-500 mb-4">SELAMAT!</h1>
                <p className="text-gray-600 mb-6">Anda telah menyelesaikan semua stage! Hebat sekali!</p>
                <div className="flex flex-col">
                    <Link to="/level-one" className="bg-gradient-to-r from-orange-400 to-pink-400 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 mb-2">
                        <button onClick={ClickSound}>
                            <span>🎮 Main Lagi</span>
                        </button>
                    </Link>
                    
                    <Link to="/select-level">
                        <button 
                            className="bg-orange-500 text-white w-full py-3 px-8 rounded-full font-semibold shadow-lg text-lg hover:bg-orange-600 transform hover:scale-105 transition-all duration-200"
                            onClick={ClickSound}
                        >
                            🏠 Pilih Level
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Completion;
