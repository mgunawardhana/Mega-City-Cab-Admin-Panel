import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetProjectDashboardWidgetsQuery } from '../../../ProjectDashboardApi';
import WidgetDataType from './types/WidgetDataType';
import { businessSummery } from '../../../../../../axios/services/mega-city-services/reporting/BusinessDetailsService';

interface Pending {
	taxes: number;
	tax_without_cost: number;
	status: string;
	row_count: number;
}


function IssuesWidget() {
	const { data: widgets, isLoading } = useGetProjectDashboardWidgetsQuery();
	const [sampleData, setSampleData] = useState<Pending>();

	const widget = widgets?.issues as WidgetDataType;

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	const { data, title } = widget;
	useEffect(() => {
		fetchAllShippingTypes().then(r => (r));
	}, []);

	const fetchAllShippingTypes = async () => {
		try {
			const response = await businessSummery();
			setSampleData(response.result);
			console.log('Business summery:', sampleData[3]);
		} catch (error) {
			console.error('Error fetching shipping types:', error);
		} finally {
		}
	};

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between px-8 pt-12">
				<Typography
					className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
					color="text.secondary"
				>
					Bookings for Upcoming Days
				</Typography>
				<IconButton
					aria-label="more"
					size="large"
				>
					<FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
				</IconButton>
			</div>
			<div className="text-center mt-8">
				<Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-amber-500">
					{sampleData?.[3]?.row_count}
				</Typography>
				<Typography className="text-lg font-medium text-amber-600">{sampleData?.[3]?.status}</Typography>
			</div>
			<Typography
				className="flex items-baseline justify-center w-full mt-20 mb-24"
				color="text.secondary"
			>
				<span className="truncate">estimated profit</span>:<b className="px-8">{sampleData?.[3]?.total_income}</b>
			</Typography>
		</Paper>
	);
}

export default memo(IssuesWidget);
