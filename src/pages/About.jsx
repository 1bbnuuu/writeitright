import '@/App.css'
import Navbar from '@/components/Navbar';

const About = () => {
    return (
        <>
            <Navbar/>
            <div className="min-h-screen py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            Tentang Kami
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                    </div>

                    {/* Main Content Card */}
                    <div className="rounded-3xl shadow-2xl border border-white/20 overflow-hidden">

                        {/* Information Cards */}
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Personal Info Card */}
                                <div className="rounded-2xl p-6 border border-blue-200/50">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">Ibnu Rofik</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">NIM:</span>
                                            <span className="font-medium text-gray-800">C2255201109</span>
                                        </div>
                                    </div>
                                </div>
                                                                <div className="rounded-2xl p-6 border border-blue-200/50">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">Josepha Amanda V.R.</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">NIM:</span>
                                            <span className="font-medium text-gray-800">C2255201116</span>
                                        </div>
                                    </div>
                                </div>
                                                                <div className="rounded-2xl p-6 border border-blue-200/50">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">Daniel Setiawan Purnomo</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">NIM:</span>
                                            <span className="font-medium text-gray-800">C2255201107</span>
                                        </div>
                                    </div>
                                </div>
                                                                <div className="rounded-2xl p-6 border border-blue-200/50">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">Kevin Octavian V.</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">NIM:</span>
                                            <span className="font-medium text-gray-800">C2255201117</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;