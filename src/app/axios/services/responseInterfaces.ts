/** responses */

export interface RolePermissions {
	moduleId: string;
	permissions: {
		create: boolean;
		view: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
}
export interface Role {
	isActive: boolean;
	updatedAt: string; // ISO date string
	status: string;
	createdAt: string; // ISO date string
	description: string;
	roleId: string;
	roleName: string;
	permissions?: RolePermissions[]; // Optional, only present in some roles
}

export interface LotteryProfile {
	isActive: boolean;
	lotteryProfileId: string;
	fromDate: Date;
	lotteryStatus: string;
	designApprovalStatus: string;
	updatedAt: Date;
	lotteryName: string;
	createdAt: Date;
	dbApprovalStatus: string;
	price: number;
	toDate: Date;
}

export interface Lotteries {
	batchNo: number;
	lotteryProfileID: string;
	remainingCount: number;
	soldCount: number;
	createdAt: Date;
	uploadedDate: Date;
	dbApprovalStatus: string;
	isActive: string;
	count: number;
	updatedAt: Date;
	lotteryID: string;
	lastSerialNo: string;
	startSerialNo: string;
	lotteryName: string;
}

// Interface for the response containing roles
export interface GetRolesResponse {
	message: string;
	result: Role[];
}

/** response save roles */

export interface SaveRolesResponse {
	message: string;
	result: UserRoleResult;
}

interface UserRoleResult {
	roleId: string;
	roleName: string;
	description: string;
	status: string;
}

/** response update roles */

export interface UserRoleUpdateResponse {
	message: string;
	result: {
		isActive: boolean;
		updatedAt: string;
		status: string;
		createdAt: string;
		description: string;
		roleId: string;
		roleName: string;
	};
}

/** response get Users */

export interface AdminUser {
	phoneNumber: string;
	employeeName: string;
	isActive: boolean;
	createAt: string;
	userId: string;
	updatedAt: string;
	status: string;
	userName: string;
	email: string;
	createdBy?: string; // Marked as optional because "updatedBy" might be present instead
	updatedBy?: string; // Marked as optional because "createdBy" might be present instead
	roleId: string;
}

export interface UsersFetchResponse {
	message: string;
	result: AdminUser[];
}
// Interface for the response containing lottery profiles
export interface GetLotteryProfileResponse {
	message: string;
	result: LotteryProfile[];
}

// Interface for the response containing lotteries
export interface GetLotteriesResponse {
	message: string;
	result: Lotteries[];
}

/** response validate Token */

interface Permissions {
	cancel: boolean;
	print: boolean;
	read: boolean;
	submit: boolean;
	report: boolean;
	create: boolean;
	delete: boolean;
	export: boolean;
}

interface UserRolePermissions {
	moduleId: string;
	permissions: Permissions;
}

interface UserData {
	phoneNumber: string;
	employeeName: string;
	isActive: boolean;
	createAt: string;
	userId: string;
	updatedAt: string;
	status: string;
	userName: string;
	updatedBy: string;
	email: string;
	roleId: string;
	roleName: string;
	permissions: UserRolePermissions[];
}

export interface AccessTokenResponse {
	message: string;
	data: {
		accessToken: string;
		userData: UserData;
	};
}

/** response user registration */

interface User {
	userId: string;
	roleId: string;
	employeeName: string;
	email: string;
	phoneNumber: string;
	userName: string;
	status: 'ACTIVE' | 'INACTIVE'; // Assuming status can be either 'ACTIVE' or 'INACTIVE'
	createdBy: string;
}

export interface UserRegistrationResponse {
	message: string;
	user: User;
}

/** response user update */
interface RoleUpdateResult {
	roleId: string;
	status: 'ACTIVE' | 'INACTIVE'; // Assuming status can be either 'ACTIVE' or 'INACTIVE'
}

export interface UserUpdateResponse {
	message: string;
	result: RoleUpdateResult;
}

/** response Get Permissons Modules */

export interface GetPermissionModule {
	isActive: boolean;
	parentModuleId?: string;
	moduleCode: string;
	updatedAt: string; // ISO date string
	parentModuleName?: string;
	moduleId: string;
	createdAt: string; // ISO date string
	updatedBy: string;
	moduleName: string;
	remarks: string;
	createdBy: string;
}

export interface GetPermissionModulesResponse {
	message: string;
	result: GetPermissionModule[];
}

export interface PasswordResetResponse {
	message: string;
}
