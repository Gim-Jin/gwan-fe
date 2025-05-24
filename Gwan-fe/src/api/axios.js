// src/api/axios.js

import axios from 'axios'

// .env에서 baseURL을 가져옵니다 (VITE_ 접두사 주의)
const baseURL = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
    baseURL: baseURL, // 예: http://localhost:8080
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
        // 401 에러 시 토큰 재발급 시도
        if (error.response && error.response.status === 401) {
            try {
                // 토큰 재발급 요청
                await axios.put('/api/auth/reissue', {}, {
                    baseURL: baseURL,
                    withCredentials: true
                });
                
                // 원래 요청 재시도
                return instance(error.config);
            } catch (refreshError) {
                console.warn('인증 실패: 로그인이 필요합니다');
                // 재로그인이 필요한 경우 로그인 페이지로 리다이렉트
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
