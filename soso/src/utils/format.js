// const 앞에 export를 붙여주세요.
export const formatTime = (seconds) => {
    if (seconds < 0) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};
