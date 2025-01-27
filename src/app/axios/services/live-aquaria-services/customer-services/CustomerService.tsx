import { get, post, put, del } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../url_helper';
import AutoDeliveryViewForm
	from '../../../../main/live-aquaria/customer/customer-profile/componets/AutoDeliveryViewForm';

const CUSTOMER_BASE_URL: string = import.meta.env.VITE_BASE_URL_SERVICE as string;

export const saveCustomer = (data) => post(url.POST_CUSTOMER, data);
export const advanceFilterCustomer = (data) => post(url.POST_CUSTOMER_ADVANCE_FILTERING, data);
export const getAllCustomers = (pageNo, pageSize) => get(`${url.GET_ALL_CUSTOMERS}limit=${pageSize}&page=${pageNo}`);
export const deleteCustomers = (customerId) => del(url.DELETE_CUSTOMERS + customerId);
export const updateCustomers = (customerId, data) => put(url.DELETE_CUSTOMERS + customerId, data);
export const getAllCounties = () => get(url.GET_COUNTIES);
export const getProfileDetailsByID = (profileID: string) => get(url.GET_PROFILE_DETAILS_BY_ID + profileID);
export const updateProfileDetails = (profileID: string, data: any) =>
	put(url.UPDATE_PROFILE_DETAILS_BY_ID + profileID, data);
export const deleteAddressByCustomerIdSpecifyingAddressByAddressId = (profileID: string, addressID: string) =>
	del(url.SPECIFYING_CUSTOMER + profileID + url.ADDRESSES + addressID);
export const newAddressSave = (profileID: string, data: any) =>
	post(url.SPECIFYING_CUSTOMER + profileID + url.CUSTOM_ADDRESS, data);
export const addressUpdate = (profileID: string, addressId: string, data: any) =>
	put(url.SPECIFYING_CUSTOMER + profileID + url.ADDRESSES + addressId, data);
export const getAllAdvanceFilteringCustomerDataWithPagination = (
	first_name,
	last_name,
	mobile_no,
	email,
	number,
	country_code,
	state,
	city,
	pageNo,
	pageSize
) =>
	get(
		`${url.ADVANCE_FILTERING_CUSTOMER_DATA}first_name,${first_name}|last_name,${last_name}|mobile_no,${mobile_no}|email,${email}|number,${number}|addresses.country_code,${country_code}|addresses.state,${state}|addresses.city,${city}&limit=${pageSize}&page=${pageNo}`
	);
export const createCreditPoints = (profileID: string, data: any) =>
	post(`${url.SPECIFYING_CUSTOMER}${profileID}/points`, data);
export const getUsedCreditPoints = (profileID: string) =>
	get(`${url.SPECIFYING_CUSTOMER}${profileID}/point-used`);
export const getCreatedCreditPoints = (profileID: string) =>
	get(`${url.SPECIFYING_CUSTOMER}${profileID}/points`);
export const updateCreditPoints = (profileID: string,pointID: string, data: any) =>
	put(`${url.SPECIFYING_CUSTOMER}${profileID}/points/${pointID}`, data);
export const deleteCreditPoints = (profileID: string,pointID: string) =>
	del(`${url.SPECIFYING_CUSTOMER}${profileID}/points/${pointID}`);
export const enableSubServices = (data: any) =>
	post(`${url.ENABLE_SUBSCRIBES_SERVICE}`, data);
export const forgetPassword = (profileID: string) =>
	get(`${url.SPECIFYING_CUSTOMER}forgot-password/${profileID}`);
export const getOrderHistory = (profileID: string,order_code,common_name,cis_code,start_date,end_date) =>
	get(`${url.SPECIFYING_CUSTOMER}${profileID}/order-history?filter=order_code,${order_code}|orderShipmentItems.item.common_name,${common_name}|orderShipmentItems.itemSelectionType.masterData.cis_code,${cis_code}|start_date,${start_date}|end_date,${end_date}&paginate=false`);
export const getOrderViewHistory = (profileID: string,orderId) =>
	get(`${url.SPECIFYING_CUSTOMER}${profileID}/order-history/${orderId}`);

export const GET_SCHEDULE_OPTIONS = `${CUSTOMER_BASE_URL}/api/admin/v1/delivery-durations`;
export const GET_ALL_AUTO_DELIVERY = `${CUSTOMER_BASE_URL}/api/admin/v1/customers`;