import '@/App.css'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { playClickBackSound, pauseClickBackSound, ClickSound } from '@/utilities/ClickSound';


const Navbar = () => {
    const [isSoundOn, setIsSoundOn] = useState(false);

    const toggleSound = () => {
        if (isSoundOn) {
            pauseClickBackSound();
        } else {
            playClickBackSound();
        }
        setIsSoundOn(!isSoundOn);
    };
    return (
        <nav className="flex justify-between items-center p-4">
                    <Link to="/" onClick={ClickSound}>
                        <button className="bg-orange-500 text-white p-3 rounded-full font-semibold shadow-lg hover:bg-orange-600 transition-colors">
                            🏠
                        </button>
                    </Link>
            
            {isSoundOn ? (
                <div className="p-2 rounded-full shadow-sm" onClick={toggleSound}>
                    <svg className="w-8 h-8 text-sky-400" width="39" height="33" viewBox="0 0 39 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.0769 11.8889C26.0769 11.8889 28.641 13.1587 28.641 16.3333C28.641 19.5079 26.0769 20.7778 26.0769 20.7778M28.641 4.26984C33.7692 6.80952 36.3333 10.619 36.3333 16.3333C36.3333 22.0476 33.7692 25.8571 28.641 28.3968M3 10.619V22.0476H9.41026L19.6667 29.6667V3L9.41026 10.619H3Z" stroke="#80C4E9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            ):(
                <div className="p-2 rounded-full shadow-sm" onClick={toggleSound}>
                    <svg className="w-8 h-8 text-sky-400" width="39" height="33" viewBox="0 0 39 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M36.3333 21.3333L26.3333 11.3333M36.3333 11.3333L26.3333 21.3333" stroke="#D2462D" stroke-width="5" stroke-linecap="round"/>
                        <path d="M3 21.265V11.4C3 10.4434 3.74667 9.66669 4.66667 9.66669H10.6433C10.8639 9.66591 11.082 9.62046 11.2845 9.5331C11.487 9.44573 11.6698 9.31825 11.8217 9.15836L16.8217 3.51169C17.8717 2.41835 19.6667 3.19336 19.6667 4.73836V27.9284C19.6667 29.485 17.85 30.2534 16.8067 29.1384L11.8233 23.5234C11.671 23.3589 11.4864 23.2276 11.2811 23.1375C11.0758 23.0475 10.8542 23.0007 10.63 23H4.66667C3.74667 23 3 22.2234 3 21.265Z" stroke="#D2462D" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
