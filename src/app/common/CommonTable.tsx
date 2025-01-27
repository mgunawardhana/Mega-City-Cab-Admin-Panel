/* eslint-disable */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

// StyledTableCell with CSS reset to prevent inheritance
const StyledTableCell = styled(TableCell)(({ theme }) => ({
	all: 'unset', // Reset all styles to avoid inheritance
	display: 'table-cell', // Reapply table-cell display after unset
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: '#354a95', // Custom header background color
		color: theme.palette.common.white, // Custom header text color
		padding: '8px', // Reduced padding for more compact cells
		fontSize: 12 // Adjusted font size for headers
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 12, // Adjusted font size for body cells
		padding: '8px' // Reduced padding for more compact cells
	}
}));

// StyledTableRow with CSS reset to prevent inheritance
const StyledTableRow = styled(TableRow)(({ theme }) => ({
	all: 'unset', // Reset all styles to avoid inheritance
	display: 'table-row', // Reapply table-row display after unset
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover // Apply your custom styling
	},
	'&:last-child td, &:last-child th': {
		border: 0
	}
}));

/**
 * A React functional component that renders a customized table with pagination.
 *
 * @param {Object} props - The props for the component.
 * @param {Array} props.headers - The headers for the table.
 * @param {Array} props.data - The data for the table.
 * @returns {JSX.Element} The rendered table component.
 */
export default function CustomizedTables({ headers, data }) {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	return (
		<TableContainer component={Paper}>
			<Table
				sx={{ minWidth: 500, tableLayout: 'fixed', borderRadius: '0 !important' }}
				aria-label="customized table"
			>
				<TableHead>
					<TableRow>
						{headers.map((header) => (
							<StyledTableCell
								key={header.field}
								align={header.align || 'left'}
								style={{ width: header.width || 'auto' }}
							>
								{header.title}
							</StyledTableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{paginatedData.map((row, index) => (
						<StyledTableRow key={index}>
							{headers.map((header) => (
								<StyledTableCell
									key={header.field}
									align={header.align || 'left'}
									style={{ width: header.width || 'auto' }}
								>
									{row[header.field]}
								</StyledTableCell>
							))}
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</TableContainer>
	);
}
