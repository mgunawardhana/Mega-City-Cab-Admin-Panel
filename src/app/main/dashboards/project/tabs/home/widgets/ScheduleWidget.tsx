import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
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
 * The ScheduleWidget widget.
 */
function ScheduleWidget() {
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

	const currentRange = 'all'; // Simplified to "all" statuses since we have one tab

	// Map business data to schedule-like items
	const series = businessData.map((item) => ({
		title: `${item.status} Status`,
		time: `Rows: ${item.row_count}`,
		location: `Income: $${item.total_income.toLocaleString()}`,
	}));

	return (
		<Paper
			className="flex flex-col flex-auto p-24 shadow-lg rounded-2xl overflow-hidden h-full"
			sx={{
				background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', // Modern gradient background
				border: '1px solid rgba(0, 0, 0, 0.1)', // Subtle border for depth
			}}
		>
			<div className="flex flex-col sm:flex-row items-start justify-between mb-16">
				<Typography
					className="text-2xl font-bold tracking-tight leading-8 truncate"
					sx={{ color: 'text.primary' }}
				>
					Business Status Overview
				</Typography>
				<div className="mt-12 sm:mt-0 sm:ml-16">
					<Tabs
						value={tabValue}
						onChange={(ev, value: number) => setTabValue(value)}
						indicatorColor="primary" // Modern primary color for indicator
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="-mx-16 min-h-40"
						TabIndicatorProps={{
							style: {
								height: 3, // Thin, modern indicator line
								backgroundColor: 'primary.main', // Match theme primary color
								borderRadius: 2,
							},
						}}
					>
						<Tab
							className="text-16 font-medium min-h-40 min-w-72 mx-4 px-16 capitalize"
							disableRipple
							label="All Statuses"
							sx={{
								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.04)', // Subtle hover effect
									borderRadius: 2,
								},
							}}
						/>
					</Tabs>
				</div>
			</div>
			<List className="py-0 divide-y divide-gray-200">
				{series.map((item, index) => (
					<ListItem
						key={index}
						className="px-0 py-12 transition-all duration-300 hover:bg-gray-50" // Modern hover effect
						sx={{
							borderRadius: 1, // Rounded corners for each item
							boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', // Subtle shadow for depth
						}}
					>
						<ListItemText
							classes={{ root: 'px-16', primary: 'text-lg font-semibold' }}
							primary={item.title}
							secondary={
								<span className="flex flex-col sm:flex-row sm:items-center -ml-4 mt-8 sm:mt-4 space-y-4 sm:space-y-0 sm:space-x-16">
                  {item.time && (
					  <span className="flex items-center">
                      <FuseSvgIcon
						  size={20}
						  color="action"
					  >
                        heroicons-solid:clock
                      </FuseSvgIcon>
                      <Typography
						  component="span"
						  className="mx-8 text-md font-medium"
						  color="text.secondary"
					  >
                        {item.time}
                      </Typography>
                    </span>
				  )}

									{item.location && (
										<span className="flex items-center">
                      <FuseSvgIcon
						  size={20}
						  color="action"
					  >
                        heroicons-solid:location-marker
                      </FuseSvgIcon>
                      <Typography
						  component="span"
						  className="mx-8 text-md font-medium"
						  color="text.secondary"
					  >
                        {item.location}
                      </Typography>
                    </span>
									)}
                </span>
							}
							sx={{
								'& .MuiListItemText-secondary': {
									color: 'text.secondary',
								},
							}}
						/>
						<ListItemSecondaryAction>
							<IconButton
								aria-label="more"
								size="large"
								sx={{
									backgroundColor: 'primary.light', // Modern button background
									'&:hover': {
										backgroundColor: 'primary.main', // Darker on hover
										color: 'white',
									},
									borderRadius: 2, // Rounded corners
								}}
							>
								<FuseSvgIcon>heroicons-solid:chevron-right</FuseSvgIcon>
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
		</Paper>
	);
}

export default memo(ScheduleWidget);