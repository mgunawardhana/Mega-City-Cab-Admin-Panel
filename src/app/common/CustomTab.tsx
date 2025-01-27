import React from 'react';
import Tab from '@mui/material/Tab';

interface CustomTabProps {
	label: string;
	index: number;
	sx?: object;
	[key: string]: any;
}

function CustomTab({ label, index, sx = {}, ...other }: CustomTabProps) {
	const a11yProps = (index: number) => ({
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	});

	return (
		<Tab
			label={label}
			{...a11yProps(index)}
			sx={{
				'&.Mui-selected': {
					backgroundColor: 'transparent',
					color: '#387ed4',
					fontWeight: '600',
					textTransform: 'none',
					height: '30px'
				},
				textTransform: 'none',
				borderRadius: '16px',
				backgroundColor: 'transparent',
				margin: '4px',
				color: '#575252',
				width: '100%',
				minWidth: 'max-content',
				minHeight: '30px',
				height: '30px',
				...sx
			}}
			{...other}
		/>
	);
}

export default CustomTab;
