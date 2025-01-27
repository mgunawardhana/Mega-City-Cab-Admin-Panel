import { get, post, put, del } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../url_helper';

export const createArticleCategories = (data) => post(`${url.CREATE_ARTICLE_CATEGORIES}`, data);
export const getAllArticleCategoriesWithPagination = (pageNo, pageSize) =>
	get(`${url.GET_ALL_ARTICLE_CATEGORIES_WITH_PAGINATION}limit=${pageSize}&page=${pageNo}`);
export const updateArticleCategories = (data, id) => put(`${url.UPDATE_ARTICLE_CATEGORIES}${id}`, data);
export const deleteArticleCategories = (id) => del(`${url.UPDATE_ARTICLE_CATEGORIES}${id}`);
export const getAllArticleCategoriesWithOutPagination = () => get(url.GET_ALL_ARTICLE_CATEGORIES_WITHOUT_PAGINATION);
export const createArticle = (data) => post(`${url.CREATE_ARTICLE}`, data);
export const getAllArticleWithOutPagination = () => get(url.GET_ALL_ARTICLE_WITHOUT_PAGINATION);
export const getAllArticleWithPagination = (pageNo, pageSize) =>
	get(`${url.GET_ALL_ARTICLE_WITH_PAGINATION}limit=${pageSize}&page=${pageNo}`);
export const updateArticle = (data, id) => put(`${url.UPDATE_ARTICLE}${id}`, data);
export const deleteArticle = (id) => del(`${url.UPDATE_ARTICLE}${id}`);
export const getArticleUsingId = (id) => get(`${url.UPDATE_ARTICLE}${id}`);
export const getAllAdvanceFilteringArticleDataWithPagination = (
	code,
	article_category_id,
	title,
	start_date,
	keywords,
	author,
	pageNo,
	pageSize
) =>
	get(
		`${url.ADVANCE_FILTERING_ARTICLE_DATA}code,${code}|article_category_id,${article_category_id}|title,${title}|start_date,${start_date}|keywords,${keywords}|author,${author}&limit=${pageSize}&page=${pageNo}`
	);
export const getAllAdvanceFilteringArticleCategoriesDataWithPagination = (name, pageNo, pageSize) =>
	get(`${url.ADVANCE_FILTERING_ARTICLE_CATEGORIES_DATA}name,${name}&limit=${pageSize}&page=${pageNo}`);
