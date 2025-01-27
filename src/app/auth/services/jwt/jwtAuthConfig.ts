import { JwtAuthConfig } from './JwtAuthProvider';

const jwtAuthConfig: JwtAuthConfig = {
	tokenStorageKey: 'jwt_access_token',
	// signInUrl: 'http://localhost:3002/admin/login',
	signInUrl: 'http://localhost:3000/sign-in',
	signUpUrl: 'mock-api/auth/sign-up',
	tokenRefreshUrl: 'mock-api/auth/refresh',
	getUserUrl: 'mock-api/auth/user',
	updateUserUrl: 'mock-api/auth/user',
	updateTokenFromHeader: true
};

export default jwtAuthConfig;

// signInUrl: 'http://localhost:3002/admin/login',
