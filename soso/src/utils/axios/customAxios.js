import axios from "axios";
import { getDefaultStore } from "jotai";
import { accessTokenState, clearLoginState, refreshTokenState } from "../jotai";

const store = getDefaultStore();

const customAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
});

// [요청 인터셉터]
customAxios.interceptors.request.use((config) => {
    
    // 🚨 [수정 전] Jotai 상태가 로딩되기 전일 수 있음
    // const accessToken = store.get(accessTokenState);

    // ✅ [수정 후] 저장소에서 직접 꺼내기 (가장 확실함!)
    // 주의: 저장할 때 키 이름을 "accessToken"으로 했다고 가정합니다.
    // atomWithStorage를 썼다면 키 이름이 다를 수 있으니 F12 > Application 탭에서 키 이름을 확인하세요.
    let accessToken = window.sessionStorage.getItem("accessToken"); 

    // (참고) atomWithStorage는 값을 "값" 이렇게 따옴표까지 저장하는 경우가 있어서
    // 만약 토큰 앞뒤로 따옴표(")가 붙어있다면 제거해주는 로직이 필요할 수 있습니다.
    if (accessToken && accessToken.startsWith('"') && accessToken.endsWith('"')) {
        accessToken = accessToken.slice(1, -1);
    }

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    config.headers["Frontend-Url"] = window.location.href;
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

// [응답 인터셉터] ... (나머지는 아주 훌륭합니다! 그대로 두세요)
customAxios.interceptors.response.use((response) => {
    const newAccessToken = response.headers["access-token"];
    if(newAccessToken) {
        store.set(accessTokenState, newAccessToken);
        // [추가] Jotai만 업데이트하지 말고, 스토리지도 직접 최신화해주면 더 안전합니다.
        window.sessionStorage.setItem("accessToken", newAccessToken); 
    }
    return response;
}, async (error) => {
    // ... (에러 처리 로직 유지) ...
    // ... 리프레시 로직 ...
});

export default customAxios;