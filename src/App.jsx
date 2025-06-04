import { useState } from 'react'
import '@/App.css'
import Navbar from '@/components/Navbar';
import logowrite from '@/assets/img/logowrite.png';
import { Link } from 'react-router-dom'


function App() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
            <Navbar />
            
            <main className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4 gap-16">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <img 
                    className=''
                    src={logowrite}
                    alt="Sound Icon" />
                </div>

                <Link
                  to="/select-level">
                  <button
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="group relative bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white px-12 py-4 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >

                    <div className="relative z-10 flex items-center gap-3">
                        <span>Pilih Level</span>
                        <div className={`transform transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </div>
                  </button>
                </Link>
            </main>
        </div>
    );
}

export default App;