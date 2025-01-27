import { AxiosRequestConfig } from 'axios';
import { get, post, put, del } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../url_helper';

export const loadAllGeneratedCode = (pageNo: string | number, pageSize: string | number) =>
	get(`${url.CODE_GENERATOR}?limit=${pageSize}&page=${pageNo}`);

export const createNewCodeFormat = (data: AxiosRequestConfig) => post(url.CODE_GENERATOR, data);

export const updateCodeFormat = (id: string | number, data: AxiosRequestConfig) =>
	put(`${url.CODE_GENERATOR}/${id}`, data);

export const deleteCodeFormat = (id: string | number) => del(`${url.CODE_GENERATOR}/${id}`);
