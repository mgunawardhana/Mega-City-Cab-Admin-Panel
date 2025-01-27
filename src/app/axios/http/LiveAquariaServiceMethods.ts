import { AxiosRequestConfig } from 'axios';
import { axiosApi } from '../axios_instances';

export async function get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
	const response = await axiosApi.get<T>(url, config);
	return response.data;
}

export async function post<T>(url: string, data: any, config: AxiosRequestConfig = {}): Promise<T> {
	const response = await axiosApi.post<T>(url, data, config);
	return response.data;
}

export async function put<T>(url: string, data: any, config: AxiosRequestConfig = {}): Promise<T> {
	const response = await axiosApi.put<T>(url, data, config);
	return response.data;
}

export async function del<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
	const response = await axiosApi.delete<T>(url, config);
	return response.data;
}
