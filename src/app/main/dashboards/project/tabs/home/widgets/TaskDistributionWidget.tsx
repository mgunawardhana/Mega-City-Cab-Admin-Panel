import Paper from '@mui/material/Paper';
import { lighten, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { ApexOptions } from 'apexcharts';
import FuseLoading from '@fuse/core/FuseLoading';
import { businessSummery } from '../../../../../../axios/services/mega-city-services/reporting/BusinessDetailsService';

interface BusinessSummary {
	taxes: number;
	tax_without_cost: number;
	total_income: number;
	status: string;
	row_count: number;
}

/**
 * The TaskDistributionWidget widget.
 */
function TaskDistributionWidget() {
	const theme = useTheme();
	const [awaitRender, setAwaitRender] = useState(true);
	const [tabValue, setTabValue] = useState(0);
	const [businessData, setBusinessData] = useState<BusinessSummary[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchBusinessSummary();
		setAwaitRender(false);
	}, []);

	const fetchBusinessSummary = async () => {
		try {
			const response = await businessSummery();
			setBusinessData(response.result); // Store the API response result
			console.log('Business summary widget:', response);
		} catch (error) {
			console.error('Error fetching business summary:', error);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading || !businessData) {
		return <FuseLoading />;
	}

	// Prepare chart data from API response
	const statuses = businessData.map((item) => item.status); // e.g., ['CLOSED', 'CANCELLED', 'COMPLETED', 'PENDING']
	const rowCounts = businessData.map((item) => item.row_count); // e.g., [492, 503, 519, 486]

	const chartOptions: ApexOptions = {
		chart: {
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'polarArea', // Keep polar area chart for task distribution
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
			animations: {
				enabled: true, // Enable animations
				easing: 'easeinout', // Smooth easing for animations
				speed: 800, // Animation duration in milliseconds
				animateGradually: {
					enabled: true,
					delay: 150, // Delay between animating each element
				},
				dynamicAnimation: {
					enabled: true,
					speed: 350, // Speed for dynamic updates
				},
			},
		},
		labels: statuses, // Use statuses as labels for the polar area chart
		legend: {
			position: 'bottom',
		},
		plotOptions: {
			polarArea: {
				spokes: {
					connectorColors: theme.palette.divider,
				},
				rings: {
					strokeColor: theme.palette.divider,
				},
			},
		},
		states: {
			hover: {
				filter: {
					type: 'darken',
					value: 0.75,
				},
			},
		},
		stroke: {
			width: 2,
		},
		theme: {
			monochrome: {
				enabled: true,
				color: theme.palette.success.main, // Use green color for the chart
				shadeIntensity: 0.75,
				shadeTo: 'dark',
			},
		},
		tooltip: {
			followCursor: true,
			theme: 'dark',
		},
		yaxis: {
			labels: {
				style: {
					colors: theme.palette.text.secondary,
				},
			},
		},
	};

	const chartSeries = rowCounts; // Use row_count as the data for the polar area chart

	// Function to handle tab change with animation
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		// Force chart update with animation by re-rendering
		setBusinessData([...businessData]); // Trigger re-render to animate
	};

	if (awaitRender) {
		return null;
	}

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden h-full">
			<div className="flex flex-col sm:flex-row items-start justify-between">
				<Typography className="text-lg font-medium tracking-tight leading-6 truncate">
					Business Status Distribution
				</Typography>
				<div className="mt-3 sm:mt-0 sm:ml-2">
					<Tabs
						value={tabValue}
						onChange={handleTabChange} // Use custom handler for animation
						indicatorColor="primary" // Use a subtle indicator color
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="-mx-4 min-h-40"
						TabIndicatorProps={{
							style: {
								display: 'none', // Hide the indicator completely to avoid any unwanted boxes
							},
						}}
					>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="All Statuses"
						/>
					</Tabs>
				</div>
			</div>
			<div className="flex flex-col flex-auto mt-6">
				<ReactApexChart
					className="flex-auto w-full"
					options={chartOptions}
					series={chartSeries}
					type={chartOptions?.chart?.type}
				/>
			</div>
			<Box
				sx={{
					backgroundColor: (_theme) =>
						_theme.palette.mode === 'light'
							? lighten(theme.palette.background.default, 0.4)
							: lighten(theme.palette.background.default, 0.02),
				}}
				className="grid grid-cols-2 border-t divide-x -m-24 mt-16"
			>
				<div className="flex flex-col items-center justify-center p-24 sm:p-32">
					<div className="text-5xl font-semibold leading-none tracking-tighter">
						{businessData.reduce((sum, item) => sum + item.row_count, 0)}
					</div>
					<Typography className="mt-4 text-center text-secondary">Total Rows</Typography>
				</div>
				<div className="flex flex-col items-center justify-center p-6 sm:p-8">
					<div className="text-5xl font-semibold leading-none tracking-tighter">
						{businessData.reduce((sum, item) => sum + item.total_income, 0).toLocaleString()}
					</div>
					<Typography className="mt-4 text-center text-secondary">Total Income ($)</Typography>
				</div>
			</Box>
		</Paper>
	);
}

export default memo(TaskDistributionWidget);