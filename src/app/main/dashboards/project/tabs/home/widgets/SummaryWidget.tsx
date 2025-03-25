//ts-nocheck
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetProjectDashboardWidgetsQuery } from '../../../ProjectDashboardApi';
import WidgetDataType, { RangeType } from './types/WidgetDataType';
import {
	fetchAllBookings
} from '../../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import { WebTypeResp } from '../../../../../live-aquaria/sample-component/booking-management/types/ShippingTypes';
import { toast } from 'react-toastify';
import { businessSummery } from '../../../../../../axios/services/mega-city-services/reporting/BusinessDetailsService';

/**
 * The SummaryWidget widget.
 */

interface Completed {
	taxes: number;
	tax_without_cost: number;
	status: string;
	row_count: number;
}

function SummaryWidget() {


	const { data: widgets, isLoading } = useGetProjectDashboardWidgetsQuery();

	const [sampleData, setSampleData] = useState<Completed>();
	const widget = widgets?.summary as WidgetDataType;

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	useEffect(() => {
		fetchAllShippingTypes().then(r => (r));
	}, []);

	const fetchAllShippingTypes = async () => {
		try {
			const response = await businessSummery();
			setSampleData(response.result);
			console.log('Business summery:', sampleData[2]);
		} catch (error) {
			console.error('Error fetching shipping types:', error);
		} finally {
		}
	};

	const { data, ranges, currentRange: currentRangeDefault } = widget;

	const [currentRange, setCurrentRange] = useState<RangeType>(currentRangeDefault as RangeType);

	function handleChangeRange(event: SelectChangeEvent<string>) {
		setCurrentRange(event.target.value as RangeType);
	}

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between px-8 pt-12">
				<Typography
					className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
					color="text.secondary"
				>
					Transaction Not Completed
				</Typography>
				<IconButton
					aria-label="more"
					size="large"
				>
					<FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
				</IconButton>
			</div>
			<div className="text-center mt-8">
				<Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-green-500">
					{sampleData?.[2]?.row_count}
				</Typography>
				<Typography className="text-lg font-medium text-green dark:text-green-500">{sampleData?.[2]?.status}</Typography>
			</div>
			<Typography
				className="flex items-baseline justify-center w-full mt-20 mb-24"
				color="text.secondary"
			>
				<span className="truncate">bank holds</span>:<b className="px-8">{sampleData?.[2]?.total_income}</b>
			</Typography>
		</Paper>
	);
}

export default memo(SummaryWidget);
