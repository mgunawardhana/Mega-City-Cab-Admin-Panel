/// * eslint-disable */
import { alpha, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { selectContrastMainTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { ApexOptions } from 'apexcharts';

import { useAppSelector } from 'app/store/hooks';
import VisitorsOverviewWidgetType from './types/VisitorsOverviewWidgetType';
import { selectWidget } from '../AnalyticsDashboardApi';

/**
 * The visitors overview widget.
 */
function VisitorsOverviewWidget() {
	const theme = useTheme();
	const contrastTheme = useAppSelector(selectContrastMainTheme(theme.palette.primary.dark));
	const widget = useAppSelector(selectWidget<VisitorsOverviewWidgetType>('visitors'));

	if (!widget) {
		return null;
	}

	const { series, ranges } = widget;

	const [tabValue, setTabValue] = useState(0);
	const currentRange = Object.keys(ranges)[tabValue];

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				speed: 400, animateGradually: {
					enabled: false
				}
			}, fontFamily: 'inherit', foreColor: 'inherit', width: '100%', height: '100%', type: 'area', toolbar: {
				show: false
			}, zoom: {
				enabled: false
			}
		}, colors: [contrastTheme.palette.secondary.light], dataLabels: {
			enabled: false
		}, fill: {
			colors: [contrastTheme.palette.secondary.dark]
		}, grid: {
			show: true, borderColor: alpha(contrastTheme.palette.primary.contrastText, 0.1), padding: {
				top: 10, bottom: -40, left: 0, right: 0
			}, position: 'back', xaxis: {
				lines: {
					show: true
				}
			}
		}, stroke: {
			width: 2
		}, tooltip: {
			followCursor: true, theme: 'dark', x: {
				format: 'MMM dd, yyyy'
			}, y: {
				formatter: (value) => `${value}`
			}
		}, xaxis: {
			axisBorder: {
				show: false
			}, axisTicks: {
				show: false
			}, crosshairs: {
				stroke: {
					color: contrastTheme.palette.secondary.main, dashArray: 0, width: 2
				}
			}, labels: {
				offsetY: -20, style: {
					colors: contrastTheme.palette.primary.contrastText
				}
			}, tickAmount: 20, tooltip: {
				enabled: false
			}, type: 'datetime'
		}, yaxis: {
			axisTicks: {
				show: false
			}, axisBorder: {
				show: false
			}, min: (min) => min - 750, max: (max) => max + 250, tickAmount: 5, show: false
		}
	};

	return <></>;
}

export default VisitorsOverviewWidget;
