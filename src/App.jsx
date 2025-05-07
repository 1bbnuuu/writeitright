import { useState } from 'react'
import '@/App.css'
import Navbar from '@/components/Navbar';
import logowrite from '@/assets/img/logowrite.png';
import { Link } from 'react-router-dom'


function App() {
  return (
    <>
      <Navbar />
      <main className="p-4 flex flex-col justify-center items-center mt-20 gap-20">
        <img className=' w-full max-w-60'
        src={logowrite}
        alt="" />
      <Link
        to="/select-level"
        className="bg-sky-400 text-white px-12 py-2 rounded-full font-bold">
          Pilih Level
      </Link>
      </main>
    </>
  )
}

export default App
