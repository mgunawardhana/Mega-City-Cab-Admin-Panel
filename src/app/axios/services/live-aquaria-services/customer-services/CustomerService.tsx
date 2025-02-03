const CUSTOMER_BASE_URL: string = import.meta.env.VITE_BASE_URL_SERVICE as string;

export const GET_SCHEDULE_OPTIONS = `${CUSTOMER_BASE_URL}/api/admin/v1/delivery-durations`;
export const GET_ALL_AUTO_DELIVERY = `${CUSTOMER_BASE_URL}/api/admin/v1/customers`;