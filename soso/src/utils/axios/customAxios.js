// src/utils/customAxios.js
import axios from "axios";

// 1. Axios 인스턴스 생성
const customAxios = axios.create({
    // [핵심] 비워두면 현재 주소(개발 땐 localhost:5173)를 기준으로 요청을 보냅니다.
    // -> 그러면 vite.config.js의 Proxy 설정이 가로채서 스프링(8080)으로 넘겨줍니다.
    // -> 배포 후에는 "내 사이트 주소"를 기준으로 하므로 역시 문제 없습니다.
    baseURL: "", 
    
    // (참고) 나중에 타임아웃 같은 것도 여기서 한 번에 설정 가능합니다.
    // timeout: 5000, 
});

// 2. (선택) 요청 채기 (Interceptors)
// 나중에 로그인 토큰(JWT) 같은 걸 여기서 자동으로 헤더에 끼워 넣을 수 있습니다.
// customAxios.interceptors.request.use(config => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export default customAxios;