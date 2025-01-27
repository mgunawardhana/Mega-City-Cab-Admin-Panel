import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import SignInPage from './SignInPage';
import authRoles from '../../auth/authRoles';
import ClassicForgotPasswordPage from '../pages/authentication/forgot-password/ClassicForgotPasswordPage';

const SignInConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'sign-in',
			element: <SignInPage />
		},
		{
			path: 'forgot-password',
			element: <ClassicForgotPasswordPage />
		},
		{
			path: 'forgot-password/:extraPath',
			element: <ClassicForgotPasswordPage />
		}
	]
};

export default SignInConfig;
