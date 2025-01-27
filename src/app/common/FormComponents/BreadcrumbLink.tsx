import { Typography } from '@mui/material';
import React from 'react';

interface BreadcrumbLinkProps {
	label: string;
	onClick: () => void;
}

function BreadcrumbLink({ label, onClick }: BreadcrumbLinkProps) {
	return (
		<Typography
			onClick={onClick}
			className="cursor-pointer text-[8px] sm:text-[10px] lg:text-[12px] text-gray-600 font-500 leading-[1.2] last:text-primaryBlue last:font-600"
		>
			{label}
		</Typography>
	);
}

export default BreadcrumbLink;
