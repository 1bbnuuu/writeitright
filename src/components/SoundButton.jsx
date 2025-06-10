import clickSound from '@/assets/sound/clickbutton.mp3';
import { useNavigate } from 'react-router-dom';

const SoundButton = ({ to, children, className }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        const audio = new Audio(clickSound);
        audio.play();
        setTimeout(() => {
        navigate(to);
        }, 100);
    };

    return (
        <div onClick={handleClick} className={className} role="button">
        {children}
        </div>
    );
};

export default SoundButton;
