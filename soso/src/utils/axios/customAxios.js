import axios from "axios";
import { getDefaultStore } from "jotai";
import { accessTokenState, clearLoginState, refreshTokenState } from "../jotai";

// 1. 외부에서 jotai를 이용하기 위한 도구 생성
const store = getDefaultStore();

// 2. Axios 인스턴스 생성 (전역 axios를 건드리지 않음)
const customAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // .env 파일 설정(.env.development는 비어있음 -> Proxy 탐)
    timeout: 10000,
});

// 3. [요청 인터셉터] 나가는 요청 가로채기
customAxios.interceptors.request.use((config) => {
    // Jotai 저장소에서 최신 토큰을 바로 꺼내서 헤더에 실어줍니다.
    const accessToken = store.get(accessTokenState);
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // 현재 페이지 주소 첨부 (필요하신 기능)
    config.headers["Frontend-Url"] = window.location.href;
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 4. [응답 인터셉터] 들어오는 응답 가로채기
customAxios.interceptors.response.use((response) => {
    // 서버가 헤더에 새 토큰을 담아줬다면 갱신 (TokenRenewalInterceptor 대응)
    const newAccessToken = response.headers["access-token"];
    if(newAccessToken) {
        store.set(accessTokenState, newAccessToken);
    }
    return response;
}, async (error) => {
    // 에러 발생 시 처리
    const originalRequest = error.config;
    const data = error.response?.data;

    // 401 에러이고, 메시지가 "TOKEN_EXPIRED"인 경우 (토큰 만료)
    // _retry 속성은 무한 루프 방지용 (이미 한 번 재시도 했으면 포기)
    if(data?.status === "401" && data?.message === "TOKEN_EXPIRED" && !originalRequest._retry) {
        
        originalRequest._retry = true; // 재시도 플래그 설정

        try {
            const refreshToken = store.get(refreshTokenState);
            
            // 리프레시 토큰으로 갱신 요청
            // 주의: 여기서도 customAxios를 쓰면 좋지만, 헤더 설정이 꼬일 수 있으므로 
            // 갱신 요청은 쌩 axios로 보내거나, customAxios를 쓰되 Authorization 헤더를 덮어써야 합니다.
            const response = await axios.post("/account/refresh", { 
                refreshToken : `Bearer ${refreshToken}` 
            }, {
                baseURL: import.meta.env.VITE_BASE_URL // baseURL 맞춰주기
            });

            // 갱신 성공! Jotai 상태 업데이트
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            store.set(accessTokenState, accessToken);
            store.set(refreshTokenState, newRefreshToken);

            // 실패했던 원래 요청의 헤더를 새 토큰으로 갈아끼우기
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            
            // 원래 요청 다시 실행 (customAxios로 실행)
            return customAxios(originalRequest);
        }
        catch(ex) {
            // 리프레시 토큰도 만료되었거나 갱신 실패 -> 로그아웃 처리
            store.set(clearLoginState); // Jotai 초기화
            alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
            window.location.href = "/account/login";
            return Promise.reject(ex);
        }
    }

    return Promise.reject(error);
});

export default customAxios;