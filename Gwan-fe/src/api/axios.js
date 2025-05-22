// src/api/axios.js

import axios from 'axios'

// .env에서 baseURL을 가져옵니다 (VITE_ 접두사 주의)
const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: baseURL, // 예: http://localhost:8080
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 필요 시 쿠키/세션 전송 가능
});

// 요청 인터셉터 (요청 전 처리: 토큰 삽입 등)
axiosInstance.interceptors.request.use(
    (config) => {
        // 예: localStorage에서 accessToken을 읽어 헤더에 삽입
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 응답 처리 등)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 예: 401 응답 시 리프레시 토큰 처리 등
        if (error.response && error.response.status === 401) {
            console.warn('인증 실패: 로그인 다시 필요');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
