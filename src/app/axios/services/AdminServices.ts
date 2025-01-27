const ADMIN_BASE_URL: string = import.meta.env.VITE_BASE_URL_SERVICE as string;

export const GET_USER_ROLES = `${ADMIN_BASE_URL}/api/admin/v1/roles`;
export const SAVE_ADMIN_ROLE = `${ADMIN_BASE_URL}/api/admin/v1/roles`;
export const UPDATE_ADMIN_ROLE = `${ADMIN_BASE_URL}/api/admin/v1/roles/`;

export const GET_ADMIN_USERS = `${ADMIN_BASE_URL}/api/admin/v1/admins`;

export const GET_PERMISSIONS_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/permissions/`;
export const UPDATE_PERMISSIONS = `${ADMIN_BASE_URL}/api/admin/v1/permissions/`;

export const FETCH_ORDER_REVIEWS = `${ADMIN_BASE_URL}/api/admin/v1/order-reviews`;
export const FETCH_ORDER_REVIEW_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/order-reviews/`;

export const FETCH_ORDER_PLANINGS = `${ADMIN_BASE_URL}/api/admin/v1/order-planing`;
export const FETCH_ORDER_PLANING_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/order-planing/`;
export const CREATE_PLAN_FOR_TODAY = `${ADMIN_BASE_URL}/api/admin/v1/order-planing`;

export const FETCH_WAREHOUSE_PLANINGS = `${ADMIN_BASE_URL}/api/admin/v1/warehouse-planing`;
export const FETCH_WAREHOUSE_PLANING_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/warehouse-planing/`;

export const FETCH_ORDER_CANCEL_REASONS = `${ADMIN_BASE_URL}/api/admin/v1/order-cancel-reasons?paginate=false`;
export const FETCH_ORDER_STATUS = `${ADMIN_BASE_URL}/api/admin/v1/order-status`;

export const ORDER_REVIEW_UPDATE_ITEM = `${ADMIN_BASE_URL}/api/admin/v1/order-reviews/`;
export const ORDER_PLANING_DELETE_ITEM = `${ADMIN_BASE_URL}/api/admin/v1/order-reviews/`;
export const ORDER_REVIEW_UPDATE = `${ADMIN_BASE_URL}/api/admin/v1/order-reviews/`;

export const ORDER_PLANING_UPDATE = `${ADMIN_BASE_URL}/api/admin/v1/order-planing/`;

export const FETCH_PICKER_LIST = `${ADMIN_BASE_URL}/api/admin/v1/all-pickers`;
export const CREATE_PICKER_ASSIGN_WAREHOUSE_ORDERS = `${ADMIN_BASE_URL}/api/admin/v1/warehouse-planing`;

export const FETCH_ORDERS_FOR_PICKER = `${ADMIN_BASE_URL}/api/admin/v1/order-pickers`;

export const FETCH_BACK_ORDERS = `${ADMIN_BASE_URL}/api/admin/v1/back-orders`;
export const FETCH_BACK_ORDER_HISTORY = `${ADMIN_BASE_URL}/api/admin/v1/back-order-histories`;
export const FETCH_BACK_ORDER_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/back-orders/`;
export const BACK_ORDER_UPDATE_ITEM = `${ADMIN_BASE_URL}/api/admin/v1/back-orders/`;
export const BACK_ORDER_DELETE_ITEM = `${ADMIN_BASE_URL}/api/admin/v1/back-orders/`;
export const BACK_ORDER_UPDATE = `${ADMIN_BASE_URL}/api/admin/v1/back-orders/`;
export const FETCH_BACK_ORDER_HISTORY_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/back-order-histories/`;

export const FETCH_PICKER_LIST_BY_PICKER = `${ADMIN_BASE_URL}/api/admin/v1/order-pickers`;
export const FETCH_PICKER_LIST_BY_ORDER_ID = `${ADMIN_BASE_URL}/api/admin/v1/order-pickers/`;

export const POST_PICKERLIST_PRINT_BAG = `${ADMIN_BASE_URL}/api/admin/v1/bag-label-print`;
export const POST_PICKERLIST_BOX_LABEL = `${ADMIN_BASE_URL}/api/admin/v1/box-label-print`;

export const GET_GENERAL_PAGES = `${ADMIN_BASE_URL}/api/admin/v1/general-pages`;
export const POST_GENERAL_PAGE = `${ADMIN_BASE_URL}/api/admin/v1/general-pages`;
export const UPDATE_GENERAL_PAGE = `${ADMIN_BASE_URL}/api/admin/v1/general-pages/`;

// export const DELETE_ADMIN_ROLE = `${ADMIN_BASE_URL}/userRole/delete`;
export const GET_LOTTERY_PROFILES = `${ADMIN_BASE_URL}/lotteryProfile/getAll`;
export const GET_ALL_LOTTERIES = `${ADMIN_BASE_URL}/lottery`;

export const GET_PERMISSION_MODULES = `${ADMIN_BASE_URL}/userRole/getAllModules`;

// cancel orders
export const GET_CANCEL_ORDERS = `${ADMIN_BASE_URL}/api/admin/v1/order-cancels`;
export const GET_CANCEL_ORDER_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/order-cancels/`;
export const CREATE_CANCEL_ORDER = `${ADMIN_BASE_URL}/api/admin/v1/order-cancels`;
