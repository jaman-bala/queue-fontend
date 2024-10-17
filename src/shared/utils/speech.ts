export function speakMessage(message: string) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);

    utterance.lang = 'ru-RU';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    synth.speak(utterance);
}

export function playNotificationSound() {
    const audio = new Audio('/audio/notification.mp3');
    audio.play();
}
