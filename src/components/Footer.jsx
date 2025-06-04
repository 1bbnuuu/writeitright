import '@/App.css'
import React from 'react';

const Footer = () => {
    return (
        <footer
            className="flex">
            <div>
                <svg className="w-8 h-8 text-sky-400" width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20 16.918C17.5533 13.9313 15.3807 12.2367 13.482 11.834C11.5833 11.4313 9.77567 11.3705 8.059 11.6515V17L0 8.2725L8.059 0V5.0835C11.2333 5.1085 13.932 6.24733 16.155 8.5C18.3777 10.7527 19.6593 13.5587 20 16.918Z" fill="#0084FF"/>
                </svg>
            </div>
            <div></div>
        </footer>
    );
};

export default Footer;