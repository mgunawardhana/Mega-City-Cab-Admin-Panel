import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';

export interface ModulePermissions {
	moduleName: string;
	moduleCode: string;
	moduleId: string;
	permissions: Permission[];
}

export interface Permission {
	id?: string;
	create?: boolean;
	update?: boolean;
	view?: boolean;
	delete?: boolean;
	export?: boolean;
	approve?: boolean;
}

export interface User {
	id?: string;
	phoneNumber?: string;
	employeeName?: string;
	isActive?: boolean;
	createAt?: string;
	userId?: string;
	updatedAt?: string;
	status?: string;
	userName?: string;
	updatedBy?: string;
	email?: string;
	roleId?: string;
	roleName?: string;
	permissions: ModulePermissions[];

	uid?: string;
	role?: string[] | string | null;
	data?: {
		displayName?: string;
		photoURL?: string;
		email?: string;
		shortcuts?: string[];
		settings?: Partial<FuseSettingsConfigType>;
		loginRedirectUrl?: string; // The URL to redirect to after login.
	};
	// displayName?: string;
	// photoURL?: string;
	// shortcuts?: string[];
	// settings?: Partial<FuseSettingsConfigType>;
	// loginRedirectUrl?: string; // The URL to redirect to after login.
}

// export type User = {
// 	accessToken: string;
// 	idToken: string;
// 	refreshToken: string;
// 	ExpiresIn: number;
// 	userData: UserData;
// };

export interface UserInterface {
	accessToken?: string;
	idToken?: string;
	refreshToken?: string;
	ExpiresIn?: number;
	userData?: User;
}
