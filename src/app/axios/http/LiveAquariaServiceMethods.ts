import { AxiosRequestConfig } from 'axios';
import { axiosApi } from '../axios_instances';

export function getAccessToken<T>() {
	return localStorage.getItem('jwt_access_token');
}

export async function get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
	const accessToken = getAccessToken();
	console.log('2', accessToken);
	if (accessToken != null) {
		config.headers = { ...config.headers, Authorization: `Bearer ${accessToken}` };
	}
	const response = await axiosApi.get<T>(url, config);
	return response.data;
}

export async function post<T>(url: string, data: any, config: AxiosRequestConfig = {}): Promise<T> {
	const accessToken = getAccessToken();
	console.log('2', accessToken);
	if (accessToken != null) {
		config.headers = { ...config.headers, Authorization: `Bearer ${accessToken}` };
	}
	const response = await axiosApi.post<T>(url, data, config);
	return response.data;
}

export async function put<T>(url: string, data: any, config: AxiosRequestConfig = {}): Promise<T> {
	const accessToken = getAccessToken();
	console.log('2', accessToken);
	if (accessToken != null) {
		config.headers = { ...config.headers, Authorization: `Bearer ${accessToken}` };
	}
	const response = await axiosApi.put<T>(url, data, config);
	return response.data;
}

export async function del<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
	const accessToken = getAccessToken();
	console.log('2', accessToken);
	if (accessToken != null) {
		config.headers = { ...config.headers, Authorization: `Bearer ${accessToken}` };
	}
	const response = await axiosApi.delete<T>(url, config);
	return response.data;
}
