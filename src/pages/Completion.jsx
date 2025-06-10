import '@/App.css'
import { Link } from 'react-router-dom';
import { ClickSound } from '@/utilities/ClickSound';

const Completion = () => {
    return (
        <>
            <main className="p-4 flex flex-col justify-center items-center text-orange-500 h-screen text-center">
                <h1 className="text-3xl font-bold">SELAMAT!</h1>
                <p>Anda telah meyelesaikan kategori ini, silahkan lanjut ke kategori berikutnya!</p>
                <Link to={"/select-level"} onClick={ClickSound}
                className=" bg-orange-500 text-white py-2 px-4 rounded mt-2"
                >
                    <span>Lanjut</span>
                </Link>
            </main>
        </>
    );
};

export default Completion;