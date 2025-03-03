import Paper from '@mui/material/Paper';
import { lighten, useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
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
 * The BusinessSummaryWidget widget.
 */
function BusinessSummaryWidget() {
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
	const statuses = businessData.map((item) => item.status);
	const totalIncome = businessData.map((item) => item.total_income);
	const taxes = businessData.map((item) => item.taxes);
	const taxWithoutCost = businessData.map((item) => item.tax_without_cost);

	const chartOptions: ApexOptions = {
		chart: {
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'bar', // Bar chart for comparison
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		colors: [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.error.main],
		xaxis: {
			categories: statuses, // e.g., ['CLOSED', 'CANCELLED', 'COMPLETED', 'PENDING']
			labels: {
				style: {
					colors: theme.palette.text.secondary,
				},
			},
		},
		yaxis: {
			labels: {
				offsetX: -16,
				style: {
					colors: theme.palette.text.secondary,
				},
			},
			title: {
				text: 'Amount ($)',
			},
		},
		plotOptions: {
			bar: {
				columnWidth: '50%',
			},
		},
		dataLabels: {
			enabled: false, // Disable data labels for cleaner look
		},
		grid: {
			borderColor: theme.palette.divider,
		},
		tooltip: {
			theme: theme.palette.mode,
		},
		legend: {
			show: true,
		},
	};

	const chartSeries = [
		{
			name: 'Total Income',
			data: totalIncome, // e.g., [152032.86, 145126.82, 156285.5, 149772.5]
		},
		{
			name: 'Taxes',
			data: taxes, // e.g., [12548.93, 12583.89, 13067.57, 12319.2]
		},
		{
			name: 'Tax Without Cost',
			data: taxWithoutCost, // e.g., [4748.00, 4948.13, 5145.75, 4902.6]
		},
	];

	if (awaitRender) {
		return null;
	}

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
			<div className="flex flex-col sm:flex-row items-start justify-between">
				<Typography className="text-lg font-medium tracking-tight leading-6 truncate">
					Business Summary by Status
				</Typography>
				<div className="mt-12 sm:mt-0 sm:ml-8">
					<Tabs
						value={tabValue}
						onChange={(ev, value: number) => setTabValue(value)}
						indicatorColor="primary" // Use a subtle indicator color
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="-mx-4 min-h-40"
						TabIndicatorProps={{
							style: {
								display: 'none', // Hide the indicator completely to remove the blue box
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
			<div className="grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-24 w-full mt-32 sm:mt-16">
				<div className="flex flex-col flex-auto">
					<Typography className="font-medium" color="text.secondary">
						Income and Tax Breakdown by Status
					</Typography>
					<div className="flex flex-col flex-auto">
						<ReactApexChart
							className="flex-auto w-full"
							options={chartOptions}
							series={chartSeries}
							height={320}
							type="bar"
						/>
					</div>
				</div>
				<div className="flex flex-col">
					<Typography className="font-medium" color="text.secondary">
						Status Overview
					</Typography>
					<div className="flex-auto grid grid-cols-2 gap-16 mt-24">
						{businessData.map((item, index) => (
							<Box
								key={index}
								sx={{
									backgroundColor: lighten(theme.palette.background.default, 0.4),
								}}
								className="flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
							>
								<Typography className="text-3xl font-semibold leading-none tracking-tight">
									{item.row_count}
								</Typography>
								<Typography className="mt-4 text-sm font-medium text-center">
									{item.status} Rows
								</Typography>
								<Typography className="mt-2 text-sm text-secondary">
									Income: ${item.total_income.toLocaleString()}
								</Typography>
								<Typography className="mt-2 text-sm text-secondary">
									Taxes: ${item.taxes.toLocaleString()}
								</Typography>
							</Box>
						))}
					</div>
				</div>
			</div>
		</Paper>
	);
}

export default memo(BusinessSummaryWidget);