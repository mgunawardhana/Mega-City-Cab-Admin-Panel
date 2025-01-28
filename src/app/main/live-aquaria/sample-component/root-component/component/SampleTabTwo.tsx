// SampleTabTwo.tsx
import Button from '@mui/material/Button';
import React from 'react';

interface SampleTabTwoProps {
	onEditClick: () => void;
}

function SampleTabTwo({ onEditClick }: SampleTabTwoProps) {
	return (
		<div>
			<h1>Sample Tab Two</h1>
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

export default SampleTabTwo;
