import Typography from '@mui/material/Typography';
// import AvatarGroup from '@mui/material/AvatarGroup';
// import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import CardContent from '@mui/material/CardContent';
import JwtLoginTab from './tabs/JwtSignInTab';
import FirebaseSignInTab from './tabs/FirebaseSignInTab';
import AwsSignInTab from './tabs/AwsSignInTab';
import image from '../../assets/Flux_Schnell_A_highly_detailed_and_realistic_scene_of_a_vibran_0.jpeg';


const tabs = [
	{
		id: 'jwt',
		title: 'JWT',
		logo: 'assets/images/logo/jwt.svg',
		logoClass: 'h-80 p-4 rounded-12'
	}
];

/**
 * The sign in page.
 */
function SignInPage() {
	const [selectedTabId, setSelectedTabId] = useState(tabs[0].id);

	function handleSelectTab(id: string) {
		setSelectedTabId(id);
	}

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-40">
			<Paper className="flex min-h-full w-full overflow-hidden rounded-0 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:shadow md:w-full md:max-w-6xl">
				<div className="w-full px-16 py-32 ltr:border-r-1 rtl:border-l-1 sm:w-auto sm:p-48 md:p-64">
					<CardContent className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
						{/* <img
							className="w-48"
							src="assets/images/logo/logo.svg"
							alt="logo"
						/> */}

						<Typography className="text-4xl text-gray-800 font-extrabold leading-tight tracking-tight">
							Sign In
						</Typography>
						{/* <div className="mt-2 flex items-baseline font-medium">
							<Typography>Don't have an account?</Typography>
							<Link
								className="ml-4"
								to="/sign-up"
							>
								Sign up
							</Link>
						</div> */}

						{/* Remove Logo */}

						{/* <Tabs
							value={_.findIndex(tabs, { id: selectedTabId })}
							variant="fullWidth"
							className="w-full mt-24 mb-32"
							indicatorColor="secondary"
						>
							{tabs.map((item) => (
								<Tab
									onClick={() => handleSelectTab(item.id)}
									key={item.id}
									icon={
										<img
											className={item.logoClass}
											src={logo}
											alt={item.title}
										/>
									}
									className="min-w-0"
									// label={item.title}
								/>
							))}

						</Tabs> */}

						{selectedTabId === 'jwt' && <JwtLoginTab />}
						{selectedTabId === 'firebase' && <FirebaseSignInTab />}
						{selectedTabId === 'aws' && <AwsSignInTab />}
					</CardContent>
				</div>
				<Box
					className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
					sx={{
						backgroundImage: `url(${image})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						filter: 'brightness(0.9)'
					}}
				>
					<Box
						component="svg"
						className="absolute -right-64 -top-64 opacity-20"
						sx={{ color: 'primary.light' }}
						viewBox="0 0 220 192"
						width="220px"
						height="192px"
						fill="none"
					>
						<defs>
							<pattern
								id="837c3e70-6c3a-44e6-8854-cc48c737b659"
								x="0"
								y="0"
								width="20"
								height="20"
								patternUnits="userSpaceOnUse"
							>
								<rect
									x="0"
									y="0"
									width="4"
									height="4"
									fill="currentColor"
								/>
							</pattern>
						</defs>
						<rect
							width="220"
							height="192"
							fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
						/>
					</Box>

					<div className="relative z-10 w-full max-w-2xl">
						<div className="text-7xl font-bold leading-none text-white">
							<div>Welcome to Mega City Cab Service</div>
						</div>
						<div className="mt-24 text-lg leading-6 tracking-tight text-white">
							Committed to enhancing lives by providing safe, reliable, and innovative transportation
							solutions today for a smoother tomorrow.
						</div>
					</div>
				</Box>
			</Paper>
		</div>
	);
}

export default SignInPage;
