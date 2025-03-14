import axios, { AxiosInstance } from 'axios';

// Get Token From local storage
const tokenString = localStorage.getItem('token');
const token: string | null = tokenString ? (JSON.parse(tokenString) as string) : null;

const VITE_BASE_URL_SERVICE: string = import.meta.env.VITE_BASE_URL_SERVICE as string;
const VITE_BASE_URL_AUTH_SERVICE: string = import.meta.env.VITE_BASE_URL_AUTH_SERVICE as string;
// const VITE_BASE_URL_ADMIN_SERVICE: string = import.meta.env.VITE_BASE_URL_ADMIN_SERVICE as string;
// const VITE_BASE_URL_FILE_SERVICE: string = import.meta.env.VITE_BASE_URL_FILE_SERVICE as string;
// const VITE_BASE_URL_USER_WALLET_SERVICE: string = import.meta.env.VITE_BASE_URL_USER_WALLET_SERVICE as string;
// const VITE_BASE_URL_USER_NOTIFICATION_SERVICE: string = import.meta.env
// 	.VITE_BASE_URL_USER_NOTIFICATION_SERVICE as string;

const axiosApi: AxiosInstance = axios.create({
	baseURL: VITE_BASE_URL_SERVICE,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		traceId: '123',
		allowedHeaders: '*'
	}
});

const axiosApiAuth: AxiosInstance = axios.create({
	baseURL: VITE_BASE_URL_AUTH_SERVICE,
	headers: {
		'Content-Type': 'application/json',
		Authorization: token ? `${token}` : '',
		allowedHeaders: '*'
	}
});


export { axiosApi, axiosApiAuth };
