import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import { SIGN_IN, VALIDATE_TOKEN } from 'src/app/axios/services/AuthServices';
import { PartialDeep } from 'type-fest';
import { toast } from 'react-toastify';
import { User } from '../../user';
import config from './jwtAuthConfig';

export type JwtAuthStatus = 'configuring' | 'authenticated' | 'unauthenticated';

export type JwtAuthConfig = {
	tokenStorageKey: string;
	signInUrl: string;
	signUpUrl: string;
	tokenRefreshUrl: string;
	getUserUrl: string;
	updateUserUrl: string;
	/**
	 * If the response auth header contains a new access token, update the token
	 * in the Authorization header of the successful responses
	 */
	updateTokenFromHeader: boolean;
};

export type SignInPayload = {
	userName: string;
	password: string;
};

export type SignUpPayload = {
	displayName: string;
	password: string;
	email: string;
};

export type JwtAuthContextType = {
	user?: User;
	updateUser: (U: User) => void;
	signIn?: (credentials: SignInPayload) => Promise<User | AxiosError>;
	signUp?: (U: SignUpPayload) => Promise<User | AxiosError>;
	signOut?: () => void;
	refreshToken?: () => void;
	isAuthenticated: boolean;
	isLoading: boolean;
	setIsLoading?: (T: boolean) => void;
	authStatus: JwtAuthStatus;
};

const defaultAuthContext: JwtAuthContextType = {
	isAuthenticated: false,
	isLoading: false,
	user: null,
	updateUser: null,
	signIn: null,
	signUp: null,
	signOut: null,
	refreshToken: null,
	setIsLoading: () => {},
	authStatus: 'configuring'
};

export const JwtAuthContext = createContext<JwtAuthContextType>(defaultAuthContext);

export type JwtAuthProviderProps = {
	children: React.ReactNode;
};

interface LoginDataType {
	access_token?: string;
	refresh_token?: string;
}

interface LoginResponseType {
	data?: LoginDataType;
}

function JwtAuthProvider(props: JwtAuthProviderProps) {
	const [user, setUser] = useState<User>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [authStatus, setAuthStatus] = useState('configuring');

	const { children } = props;

	/**
	 * Handle sign-in success
	 */
	const handleSignInSuccess = useCallback((userData: User, accessToken: string) => {
		setSession(accessToken);
		setIsAuthenticated(true);
		setUser(userData);
	}, []);

	/**
	 * Handle sign-up success
	 */
	const handleSignUpSuccess = useCallback((userData: User, accessToken: string) => {
		setSession(accessToken);

		setIsAuthenticated(true);

		setUser(userData);
	}, []);

	/**
	 * Handle sign-in failure
	 */
	const handleSignInFailure = useCallback((error: AxiosError) => {
		resetSession();

		setIsAuthenticated(false);
		setUser(null);

		handleError(error);
	}, []);

	/**
	 * Handle sign-up failure
	 */
	const handleSignUpFailure = useCallback((error: AxiosError) => {
		resetSession();

		setIsAuthenticated(false);
		setUser(null);

		handleError(error);
	}, []);

	/**
	 * Handle error
	 */
	const handleError = useCallback((error: AxiosError) => {
		resetSession();
		setIsAuthenticated(false);
		setUser(null);
	}, []);

	// Set session
	const setSession = useCallback((accessToken: string) => {
		if (accessToken) {
			localStorage.setItem(config.tokenStorageKey, accessToken);
			axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

			// localStorage.setItem(config.tokenStorageKey, accessToken);
			// localStorage.setItem(config.refreshTokenStorageKey, refreshToken);
			// axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
			// axios.defaults.headers.common['x-refresh-token'] = `${refreshToken}`;
		}
	}, []);

	// Reset session
	const resetSession = useCallback(() => {
		localStorage.removeItem(config.tokenStorageKey);
		delete axios.defaults.headers.common.Authorization;
	}, []);

	// Get access token from local storage
	const getAccessToken = useCallback(() => {
		return localStorage.getItem(config.tokenStorageKey);
	}, []);

	// Check if the access token is valid
	const isTokenValid = useCallback((accessToken: string) => {
		if (accessToken) {
			try {
				const decoded = jwtDecode<JwtPayload>(accessToken);
				const currentTime = Date.now() / 1000;
				return decoded.exp > currentTime;
			} catch (error) {
				return false;
			}
		}

		return false;
	}, []);

	// Check if the access token exist and is valid on mount
	useEffect(() => {
		const attemptAutoLogin = async () => {
			const accessToken = getAccessToken();

			// if (isTokenValid(accessToken)) {
			if (accessToken) {
				try {
					setIsLoading(true);

					const response: AxiosResponse<LoginDataType> = await axios.post(
						VALIDATE_TOKEN,
						{}, // Pass an empty body since the token is in the headers
						{
							headers: {
								Authorization: `Bearer ${accessToken}` // Include the token in the Authorization header
							}
						}
					);

					const data: LoginDataType = response?.data;

					const tempData: Partial<User> = {
						uid: 'XgbuVEXBU5gtSKdbQRP1Zbbby1i1',
						role: 'admin',
						data: {
							displayName: 'Live Aquaria Admin',
							photoURL: 'assets/images/avatars/demo-admin.png',
							email: 'admin@nlb.com',
							settings: {
								layout: {},
								theme: {}
							} as Partial<FuseSettingsConfigType>,
							shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts'],
							loginRedirectUrl: '/aaaaaaa'
						}
					};

					handleSignInSuccess({ ...data, ...tempData }, data.access_token);
					setAuthStatus('authenticated');
					// handleSignInSuccess(data, accessToken);
					return true;
				} catch (error) {
					const axiosError = error as AxiosError;

					handleSignInFailure(axiosError);
					return false;
				}
			} else {
				resetSession();
				return false;
			}
		};

		if (!isAuthenticated) {
			attemptAutoLogin().then((signedIn) => {
				setIsLoading(false);
				setAuthStatus(signedIn ? 'authenticated' : 'unauthenticated');
			});
		}
	}, [
		isTokenValid,
		setSession,
		handleSignInSuccess,
		handleSignInFailure,
		handleError,
		getAccessToken,
		isAuthenticated
	]);

	const handleRequest = async (
		url: string,
		dataCredentials: SignInPayload | SignUpPayload,
		handleSuccess: (T: User, H: string) => void,
		handleFailure: (T: AxiosError) => void
	): Promise<User | AxiosError> => {
		try {
			const response: AxiosResponse<LoginDataType> = await axios.post(SIGN_IN, dataCredentials);

			const data: LoginDataType = response?.data;

			const tempData: Partial<User> = {
				uid: 'XgbuVEXBU5gtSKdbQRP1Zbbby1i1',
				role: 'admin',
				data: {
					displayName: 'Live Aquaria Admin',
					photoURL: 'assets/images/avatars/demo-admin.png',
					email: 'admin@nlb.com',
					settings: {
						layout: {},
						theme: {}
					} as Partial<FuseSettingsConfigType>,
					shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts'],
					loginRedirectUrl: '/aaaaaaa'
				}
			};

			handleSuccess({ ...tempData, ...tempData }, data.access_token);
			return tempData;
		} catch (error) {
			const axiosError = error as AxiosError;

			if (
				axiosError?.response?.data &&
				typeof axiosError.response.data === 'object' &&
				'message' in axiosError.response.data
			) {
				const errorMessage = (axiosError.response.data as { message: string }).message;
				toast.error(errorMessage);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}

			handleFailure(axiosError);

			return axiosError;
		}
	};

	// Refactor signIn function
	const signIn = (credentials: SignInPayload) => {
		return handleRequest(config.signInUrl, credentials, handleSignInSuccess, handleSignInFailure);
	};

	// Refactor signUp function
	const signUp = useCallback((data: SignUpPayload) => {
		return handleRequest(config.signUpUrl, data, handleSignUpSuccess, handleSignUpFailure);
	}, []);

	/**
	 * Sign out
	 */
	const signOut = useCallback(() => {
		resetSession();

		setIsAuthenticated(false);
		setUser(null);
	}, []);

	/**
	 * Update user
	 */
	const updateUser = useCallback(async (userData: PartialDeep<User>) => {
		try {
			const response: AxiosResponse<User, PartialDeep<User>> = await axios.put(config.updateUserUrl, userData);

			const updatedUserData = response?.data;

			setUser(updatedUserData);

			return null;
		} catch (error) {
			const axiosError = error as AxiosError;

			handleError(axiosError);
			return axiosError;
		}
	}, []);

	/**
	 * Refresh access token
	 */
	const refreshToken = async () => {
		setIsLoading(true);
		try {
			const response: AxiosResponse<string> = await axios.post(config.tokenRefreshUrl);

			const accessToken = response?.headers?.['New-Access-Token'] as string;

			if (accessToken) {
				setSession(accessToken);
				return accessToken;
			}

			return null;
		} catch (error) {
			const axiosError = error as AxiosError;

			handleError(axiosError);
			return axiosError;
		}
	};

	/**
	 * if a successful response contains a new Authorization header,
	 * updates the access token from it.
	 *
	 */
	useEffect(() => {
		if (config.updateTokenFromHeader && isAuthenticated) {
			axios.interceptors.response.use(
				(response) => {
					const newAccessToken = response?.headers?.['New-Access-Token'] as string;

					if (newAccessToken) {
						setSession(newAccessToken);
					}

					return response;
				},
				(error) => {
					const axiosError = error as AxiosError;

					if (axiosError?.response?.status === 401) {
						signOut();
						// eslint-disable-next-line no-console
						console.warn('Unauthorized request. User was signed out.');
					}

					return Promise.reject(axiosError);
				}
			);
		}
	}, [isAuthenticated]);

	useEffect(() => {
		if (user) {
			setAuthStatus('authenticated');
		} else {
			setAuthStatus('unauthenticated');
		}
	}, [user]);

	// console.log('is authenticated', isAuthenticated);
	// console.log('user', user);

	const authContextValue = useMemo(
		() =>
			({
				user,
				isAuthenticated,
				authStatus,
				isLoading,
				signIn,
				signUp,
				signOut,
				updateUser,
				refreshToken,
				setIsLoading
			}) as JwtAuthContextType,
		[user, isAuthenticated, isLoading, signIn, signUp, signOut, updateUser, refreshToken, setIsLoading]
	);

	return <JwtAuthContext.Provider value={authContextValue}>{children}</JwtAuthContext.Provider>;
}

export default JwtAuthProvider;
