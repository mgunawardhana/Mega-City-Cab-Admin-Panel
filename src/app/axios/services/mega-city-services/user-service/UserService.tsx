//ts-nocheck
import {del, get, post, put} from '../../../http/LiveAquariaServiceMethods'
import * as url from '../../mega-city-services/url_helper';

// @ts-ignore
export const fetchAllUsers = (pageNo: string | number, pageSize: string | number) =>
	post(`${url.FETCH_ALL_USERS}${pageNo}&size=${pageSize}`);