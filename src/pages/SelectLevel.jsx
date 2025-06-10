import '@/App.css'
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { ClickSound } from '@/utilities/ClickSound';

const SelectLevel = () => {
    return (
        <>
            <Navbar/>
            <main className="p-4 flex flex-col justify-center items-center mt-5 text-orange-500">
                <h1 className="text-2xl font-bold">KATEGORI</h1>
                <p>Pilih kategori sesuai usiamu!</p>
            </main>
            <section className=" p-8 text-white flex flex-col gap-4">
                <Link to="/level-one" onClick={ClickSound}>
                    <div className="card flex justify-between bg-gradient-to-r from-orange-600 to-orange-400 items-center px-4 py-6 rounded-lg">
                        <div>
                            <h2 className="text-xl font-bold">Balita</h2>
                            <p>Menghubungkan objek yang sama</p>
                        </div>
                        <p className=" bg-white rounded-full p-2 text-2xl">👶</p>
                    </div>
                </Link>
                <div className="card flex justify-between bg-gradient-to-r from-sky-600 to-sky-400 items-center px-4 py-6 rounded-lg">
                    <div>
                        <h2 className="text-xl font-bold">Pra-sekolah</h2>
                        <p>Mengenal bentuk dan ruang</p>
                    </div>
                    <p className=" bg-white rounded-full p-2 text-2xl">🧒</p>
                </div>
                <div className="card flex justify-between bg-gradient-to-r from-blue-700 to-blue-500 items-center px-4 py-6 rounded-lg">
                    <div>
                        <h2 className="text-xl font-bold">Anak-anak</h2>
                        <p>Menulis huruf dan angka</p>
                    </div>
                    <p className=" bg-white rounded-full p-2 text-2xl">👦</p>
                </div>
            </section>
            {/* <Footer/> */}
        </>
    );
};

export default SelectLevel;