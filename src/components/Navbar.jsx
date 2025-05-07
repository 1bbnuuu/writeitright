import '@/App.css'
import React from 'react';
import soundIcon from '@/assets/svg/sound.svg';

const Navbar = () => {
    return (
        <nav className=' flex justify-between items-center p-4'>
            <h1 className=' font-bold'>WR</h1>
            <div className=' p-2 bg-white rounded-full'>
                <img 
                className=' w-8'
                src={soundIcon}
                alt="Sound Icon" />
            </div>
        </nav>
    );
};

export default Navbar;
