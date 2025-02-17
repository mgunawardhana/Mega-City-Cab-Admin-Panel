// @ts-nocheck
import { del, put, post } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../../mega-city-services/url_helper';

export const deleteWebArticle = (id: string | number) => del(`${url.DELETE_WEB_ARTICLE}${id}`);

export const updateWebsiteArticle = (data: any) => put(url.UPDATE_WEBSITE_ARTICLE, data);

export const saveWebArticle = (data: any) => post(url.CREATE_WEBSITE_ARTICLE, data);


