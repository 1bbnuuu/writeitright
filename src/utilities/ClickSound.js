import clickSound from '@/assets/sound/clickbutton.mp3';
import clickBackSound from '@/assets/sound/littleidea.mp3';

let clickBackAudio = new Audio(clickBackSound);
clickBackAudio.loop = true; // Loop terus

export const ClickSound = () => {
    const audio = new Audio(clickSound);
    audio.currentTime = 0;
    audio.play();
};

export const ClickBackSound = () => {
    const audio = new Audio(clickBackSound);
    audio.currentTime = 0;
    audio.play();
};

export const playClickBackSound = () => {
    clickBackAudio.currentTime = 0;
    clickBackAudio.play();
};

export const pauseClickBackSound = () => {
    clickBackAudio.pause();
};
