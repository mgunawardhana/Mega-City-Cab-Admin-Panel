import { lazy } from 'react';

const UserRolesApp = lazy(() => import('./UserRolesApp'));

/**
 * The finance dashboard app config.
 */
const UserRolesAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'user-management/roles',
			element: <UserRolesApp />
		}
	]
};

export default UserRolesAppConfig;
