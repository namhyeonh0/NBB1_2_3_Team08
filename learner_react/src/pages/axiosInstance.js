import Cookies from 'js-cookie';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://52.79.149.176',
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                const response = await axiosInstance.post('/reissue', {}, {
                    withCredentials: true,
                });


                if (response.status === 200) {
                    const {accessToken} = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    return axiosInstance(error.config);
                }
            } catch (refreshError) {
                console.error("토큰 갱신 실패:", refreshError);

                // 로그아웃 처리 및 로그인 모달 표시 이벤트 트리거
                localStorage.removeItem('accessToken');
                Cookies.remove('Authorization');
                const event = new CustomEvent('showLoginModal');
                window.dispatchEvent(event);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
