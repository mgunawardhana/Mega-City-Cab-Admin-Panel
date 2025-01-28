import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CommonHeading from '../../../../../../common/FormComponents/CommonHeading';

const rows = [
	{ type: 'Heatpack', quantity: 2, cost: '$15.00' },
	{ type: 'Icepack', quantity: 3, cost: '$20.00' }
];

function PackingMaterials() {
	return (
		<div className="min-w-full max-w-[100vw]">
			<CommonHeading title="Packing Materials" />
			<Paper className="rounded-[0px] p-[16px]">
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						xs={12}
					>
						<FormControlLabel
							control={<Checkbox />}
							label="Shared Space"
						/>
						<FormControlLabel
							control={<Checkbox />}
							label="Individual Space"
						/>
					</Grid>
					<Grid
						item
						xs={12}
					>
						<TableContainer
							component={Paper}
							sx={{ borderRadius: 0 }}
						>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell
											sx={{ backgroundColor: '#354a95', color: '#fff', fontWeight: 'bold' }}
										>
											<Typography variant="subtitle1">Packing Material Type</Typography>
										</TableCell>
										<TableCell
											sx={{ backgroundColor: '#354a95', color: '#fff', fontWeight: 'bold' }}
										>
											<Typography variant="subtitle1">Quantity</Typography>
										</TableCell>
										<TableCell
											sx={{ backgroundColor: '#354a95', color: '#fff', fontWeight: 'bold' }}
										>
											<Typography variant="subtitle1">Packing Cost</Typography>
										</TableCell>
										<TableCell
											sx={{ backgroundColor: '#354a95', color: '#fff', fontWeight: 'bold' }}
										>
											<Typography variant="subtitle1">Action</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map((row, index) => (
										<TableRow key={index}>
											<TableCell>{row.type}</TableCell>
											<TableCell>{row.quantity}</TableCell>
											<TableCell>{row.cost}</TableCell>
											<TableCell> {/* Add any action buttons here */} </TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
			</Paper>
		</div>
	);
}

export default PackingMaterials;
