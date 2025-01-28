import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Tooltip } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useAppSelector } from 'app/store/hooks';
import VisitorsVsPageViewsType from './types/VisitorsVsPageViewsType';
import { selectWidget } from '../AnalyticsDashboardApi';

/**
 * Visitors vs. Page Views widget.
 */
function VisitorsVsPageViewsWidget() {
	const theme = useTheme();

	const widget = useAppSelector(selectWidget<VisitorsVsPageViewsType>('visitorsVsPageViews'));

	if (!widget) {
		return null;
	}

	const { series, averageRatio, predictedRatio, overallScore } = widget;

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				enabled: false
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'area',
			toolbar: {
				show: false
			},
			zoom: {
				enabled: false
			}
		},
		colors: [theme.palette.primary.light, theme.palette.primary.light],
		dataLabels: {
			enabled: false
		},
		fill: {
			colors: [theme.palette.primary.dark, theme.palette.primary.light],
			opacity: 0.5
		},
		grid: {
			show: false,
			padding: {
				bottom: -40,
				left: 0,
				right: 0
			}
		},
		legend: {
			show: false
		},
		stroke: {
			curve: 'smooth',
			width: 2
		},
		tooltip: {
			followCursor: true,
			theme: 'dark',
			x: {
				format: 'MMM dd, yyyy'
			}
		},
		xaxis: {
			axisBorder: {
				show: false
			},
			labels: {
				offsetY: -20,
				rotate: 0,
				style: {
					colors: theme.palette.text.secondary
				}
			},
			tickAmount: 3,
			tooltip: {
				enabled: false
			},
			type: 'datetime'
		},
		yaxis: {
			labels: {
				style: {
					colors: theme.palette.divider
				}
			},
			max: (max) => max + 250,
			min: (min) => min - 250,
			show: false,
			tickAmount: 5
		}
	};

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
		</Paper>
	);
}

export default VisitorsVsPageViewsWidget;
