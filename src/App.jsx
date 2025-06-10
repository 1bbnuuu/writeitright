import "@/App.css";
import Navbar from "@/components/Navbar";
import introVideo from "@/assets/video/logo.mp4";
import { Link } from "react-router-dom";
import { ClickSound } from "@/utilities/ClickSound";

function App() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4 gap-5">
                <div>
                    <video
                        src={introVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full max-w-[400px]"
                    ></video>
                </div>

                <Link to="/select-level" onClick={ClickSound}>
                    <button className="group relative bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white px-12 py-4 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                        <div className="relative z-10 flex items-center gap-3">
                            <span>Pilih Level</span>
                        </div>
                    </button>
                </Link>
                <Link to="/about">
                    <button className="group relative bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white px-12 py-4 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                        Copyrights
                    </button>
                </Link>
            </main>
        </div>
    );
}

export default App;

