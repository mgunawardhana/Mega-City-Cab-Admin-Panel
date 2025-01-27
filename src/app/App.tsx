import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache, { Options } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrentLanguageDirection } from 'app/store/i18nSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import MockAdapterProvider from '@mock-api/MockAdapterProvider';
import { useAppSelector } from 'app/store/hooks';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import withAppProviders from './withAppProviders';
import AuthenticationProvider from './auth/AuthenticationProvider';
import 'react-toastify/dist/ReactToastify.css';

// import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
	rtl: {
		key: 'muirtl',
		stylisPlugins: [rtlPlugin],
		insertionPoint: document.getElementById('emotion-insertion-point')
	},
	ltr: {
		key: 'muiltr',
		stylisPlugins: [],
		insertionPoint: document.getElementById('emotion-insertion-point')
	}
};

/**
 * The main App component.
 */
function App() {
	/**
	 * The language direction from the Redux store.
	 */
	const langDirection = useAppSelector(selectCurrentLanguageDirection);

	/**
	 * The main theme from the Redux store.
	 */
	const mainTheme = useSelector(selectMainTheme);

	return (
		<MockAdapterProvider>
			<CacheProvider value={createCache(emotionCacheOptions[langDirection] as Options)}>
				<FuseTheme
					theme={mainTheme}
					direction={langDirection}
				>
					<AuthenticationProvider>
						<SnackbarProvider
							maxSnack={5}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right'
							}}
							classes={{
								containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99'
							}}
						>
							<FuseLayout layouts={themeLayouts} />
							<ToastContainer
								progressStyle={{
									transformOrigin: 'right',
									transform: 'scaleX(-1)'
								}}
								autoClose={3000}
								position="bottom-right"
								style={{ zIndex: 15000 }} // Ensure this is higher than your highest modal zIndex
							/>
						</SnackbarProvider>
					</AuthenticationProvider>
				</FuseTheme>
			</CacheProvider>
			<ToastContainer />
		</MockAdapterProvider>
	);
}

export default withAppProviders(App);
