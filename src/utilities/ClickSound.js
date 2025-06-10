// ClickSound.js
import clickSound from '@/assets/sound/clickbutton.mp3';
import clickBackSound from '@/assets/sound/littleidea.mp3';
import tutor1 from '@/assets/sound/dub_lvl1.mp3';

let tutor1Audio = null;
let clickBackAudio = new Audio(clickBackSound);
clickBackAudio.loop = true;

export const ClickSound = () => {
    const audio = new Audio(clickSound);
    audio.currentTime = 0;
    audio.play();
};

export const Tutor1 = () => {
    // Jika audio sebelumnya sedang main, hentikan dulu
    if (tutor1Audio) {
        tutor1Audio.pause();
        tutor1Audio.currentTime = 0;
    }

    tutor1Audio = new Audio(tutor1);
    tutor1Audio.play();
};

export const pauseTutor1 = () => {
    if (tutor1Audio) {
        tutor1Audio.pause();
        tutor1Audio.currentTime = 0;
    }
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
