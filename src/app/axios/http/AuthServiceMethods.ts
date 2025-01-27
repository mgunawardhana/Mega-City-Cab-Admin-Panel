import { AxiosRequestConfig } from 'axios';
import { axiosApiAuth } from '../axios_instances';

export async function getAuth<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
	const response = await axiosApiAuth.get<T>(url, { ...config });
	return response.data;
}

// export async function postAuth<T>(url: string, data: any, config: AxiosRequestConfig = {}): Promise<T> {
// 	const response = await axiosApiAuth.post<T>(url, { ...data }, { ...config });
// 	return response;
// }

export async function postAuth<T>(url: string, data: any, config: AxiosRequestConfig = {}): Promise<T> {
	const response = await axiosApiAuth.post<T>(url, data, config);
	return response.data;
}

export async function putAuth<T>(url: string, data: any, config: AxiosRequestConfig = {}): Promise<T> {
	const response = await axiosApiAuth.put<T>(url, { ...data }, { ...config });
	return response.data;
}

export async function delAuth<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
	const response = await axiosApiAuth.delete<T>(url, { ...config });
	return response.data;
}
