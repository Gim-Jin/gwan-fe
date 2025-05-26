// src/api/axios.js

import axios from 'axios'

// .env에서 baseURL을 가져옵니다 (VITE_ 접두사 주의)
const baseURL = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
    baseURL: baseURL, 
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 쿠키 전송을 위해 필수
});

// 토큰 재발급 상태 관리
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

// 요청 인터셉터 (요청 전 처리)
instance.interceptors.request.use(
    (config) => {
        // 요청 로그 출력
        console.log('[AXIOS REQUEST]', {
            url: config.url,
            method: config.method,
            data: config.data,
            params: config.params,
            headers: config.headers
        });
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
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // 토큰 재발급과 로그인 관련 요청은 제외
            const excludeUrls = ['/api/auth/login', '/api/auth/signup', '/api/auth/reissue', '/api/auth/logout', '/api/auth/me'];
            const shouldExclude = excludeUrls.some(url => originalRequest.url.includes(url));
            
            if (shouldExclude) {
                return Promise.reject(error);
            }

            // 이미 재발급 중인 경우 대기열에 추가
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return instance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // 토큰 재발급 요청
                await axios.put('/api/auth/reissue', {}, {
                    baseURL: baseURL,
                    withCredentials: true
                });
                
                // 대기 중인 요청들 처리
                processQueue(null);
                isRefreshing = false;
                
                // 원래 요청 재시도
                return instance(originalRequest);
                
            } catch (refreshError) {
                // 재발급 실패 시 대기 중인 요청들 모두 실패 처리
                processQueue(refreshError);
                isRefreshing = false;
                
                // 재발급 실패 시 로그아웃 처리
                if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
                    // 로그아웃 처리 (auth store 사용)
                    try {
                        const { useAuthStore } = await import('@/stores/auth');
                        const authStore = useAuthStore();
                        await authStore.logoutUser();
                        
                        // 로그인 페이지로 리다이렉트
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                    } catch (logoutError) {
                        console.error('자동 로그아웃 처리 실패:', logoutError);
                    }
                }
                
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default instance;
