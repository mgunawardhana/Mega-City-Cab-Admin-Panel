import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import FuseLoading from '@fuse/core/FuseLoading';
import AccountBalanceWidgetType from './types/AccountBalanceWidgetType';
import { useGetFinanceDashboardWidgetsQuery } from '../FinanceDashboardApi';

/**
 * The AccountBalanceWidget widget.
 */
function AccountBalanceWidget() {
	const theme = useTheme();

	const { data: widgets, isLoading } = useGetFinanceDashboardWidgetsQuery();

	if (isLoading) {
		return <FuseLoading />;
	}

	const widget = widgets?.accountBalance as AccountBalanceWidgetType;

	if (!widget) {
		return null;
	}

	const { series, growRate, ami } = widget;

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				speed: 400,
				animateGradually: {
					enabled: false
				}
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			width: '100%',
			height: '100%',
			type: 'area',
			sparkline: {
				enabled: true
			}
		},
		colors: [theme.palette.secondary.light, theme.palette.secondary.light],
		fill: {
			colors: [theme.palette.secondary.dark, theme.palette.secondary.light],
			opacity: 0.5
		},
		series,
		stroke: {
			curve: 'straight',
			width: 2
		},
		tooltip: {
			followCursor: true,
			theme: 'dark',
			x: {
				format: 'MMM dd, yyyy'
			},
			y: {
				formatter: (value) => `${value}%`
			}
		},
		xaxis: {
			type: 'datetime'
		}
	};

	return <div />;
}

export default AccountBalanceWidget;
