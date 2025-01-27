import { lazy } from 'react';

const UserPermissionsApp = lazy(() => import('./UserPermissionsApp'));

/**
 * The finance dashboard app config.
 */
const UserPermissionsConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'user-management/permissions',
			element: <UserPermissionsApp />
		}
	]
};

export default UserPermissionsConfig;
