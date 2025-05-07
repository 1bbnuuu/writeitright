import '@/App.css'
import React from 'react';
import soundIcon from '@/assets/svg/sound.svg';
import Navbar from '../components/Navbar';


const SelectLevel = () => {
    return (
        <>
            <Navbar/>
            <main className="p-4 flex flex-col justify-center items-center mt-20 text-orange-500">
                <h1 className="text-2xl font-bold">KATEGORI</h1>
                <p>Pilih kategori sesuai usiamu!</p>
            </main>
            <section className=' p-8 text-white flex flex-col gap-4'>
                <div className="card flex justify-between bg-orange-400 items-center px-4 py-6 rounded-lg">
                    <div>
                        <h2>Balita</h2>
                        <p>3-4 Tahun</p>
                    </div>
                    <p className=' bg-white rounded-full p-2'>👶</p>
                </div>
                <div className="card flex justify-between bg-sky-400 items-center px-4 py-6 rounded-lg">
                    <div>
                        <h2>Balita</h2>
                        <p>3-4 Tahun</p>
                    </div>
                    <p className=' bg-white rounded-full p-2'>🧒</p>
                </div>
                <div className="card flex justify-between bg-blue-700 items-center px-4 py-6 rounded-lg">
                    <div>
                        <h2>Balita</h2>
                        <p>3-4 Tahun</p>
                    </div>
                    <p className=' bg-white rounded-full p-2'>👦</p>
                </div>
            </section>
        </>
    );
};

export default SelectLevel;