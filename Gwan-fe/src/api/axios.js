// src/api/axios.js

import axios from 'axios'

// .env에서 baseURL을 가져옵니다 (VITE_ 접두사 주의)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const instance = axios.create({
    baseURL: baseURL, 
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 쿠키 전송을 위해 필수
});

// 요청 인터셉터 (요청 전 처리)
instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 응답 처리 등)
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // 401 에러이고, 재시도하지 않은 요청인 경우에만 토큰 재발급 시도
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // 특정 요청들은 토큰 재발급 대상에서 제외
            const excludeUrls = ['/auth/', '/login', '/signup', '/mypage', '/reissue'];
            const shouldExclude = excludeUrls.some(url => originalRequest.url.includes(url));
            
            if (shouldExclude) {
                return Promise.reject(error);
            }
            
            try {
                // 토큰 재발급 요청
                await axios.put('/api/auth/reissue', {}, {
                    baseURL: baseURL,
                    withCredentials: true
                });
                
                // 원래 요청 재시도
                return instance(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
