import React from 'react';
import Button from '@mui/material/Button';

interface SampleTabFourProps {
	onEditClick: () => void;
}

function SampleTabFour({ onEditClick }: SampleTabFourProps) {
	return (
		<div>
			<h1>Sample Tab Four</h1>
			<Button
				variant="contained"
				className="searchButton"
				color="primary"
				style={{ marginTop: '10px' }}
				onClick={onEditClick}
			>
				Edit
			</Button>
			<div className="p-2" />
		</div>
	);
}

export default SampleTabFour;
