import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import MaterialTable from 'material-table';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { TablePagination, Pagination } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface StatusStyles {
	border: string;
	color: string;
}

interface TableColumn {
	title: string;
	field: string;
	render?: (rowData: any) => React.ReactNode;
}

interface TableData {
	[key: string]: any; // Define more specific type if possible
}

interface TableProps {
	title: string;
	data: TableData[];
	columns: TableColumn[];
	externalAddButton?: boolean;
	externalAddHandler?: () => void;
	editRowHandler?: (data: any) => void;
	viewRowHandler?: (data: any) => void;
	downloadRowHandler?: (data: any) => void;
	draftRowHandler?: (data: any) => void;
	manageRowHandlerWinng?: (data: any) => void;
	uploadRowHandler?: (data: any) => void;
	addText?: string;
	pageSize?: number;
	exportHandler?: boolean;
	handleChangePage?: (event: unknown, newPage: number) => void;
	handleChangeRowsPerPage?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	currentPage: number;
	totalCount: number;
	dataLoading?: boolean;
	isSearchAvailable?: boolean;
}

const getStatusStyles = (status: string): StatusStyles => {
	switch (status) {
		case 'PENDING':
			return {
				border: '1px solid #631878',
				color: '#631878'
			};
		case 'IN PROGRESS':
			return {
				border: '1px solid #D39C2F',
				color: '#D39C2F'
			};
		case 'APPROVED':
		case 'ACTIVE':
		case 'VERIFIED':
			return {
				border: '1px solid #629C44',
				color: '#629C44'
			};
		case 'REJECTED':
		case 'BLACKLIST':
			return {
				border: '1px solid #B70F0A',
				color: '#B70F0A'
			};
		case 'INACTIVE':
		case 'ON HOLD':
		case 'UN-VERIFIED':
			return {
				border: '1px solid #606060',
				color: '#606060'
			};
		default:
			return { border: '1px solid #000', color: '#000' };
	}
};

const getActiveStatusStyles = (status: boolean): StatusStyles => {
	return status
		? { border: '1px solid #629C44', color: '#629C44' }
		: { border: '1px solid #606060', color: '#606060' };
};

function ExternalAddButton({ onClick, addText }: { onClick?: () => void; addText?: string }) {
	return (
		<Button
			className="whitespace-nowrap text-white"
			variant="contained"
			color="primary"
			startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus-circle</FuseSvgIcon>}
			onClick={onClick}
		>
			{addText}
		</Button>
	);
}

interface CustomPaginationProps {
	page: number;
	rowsPerPage: number;
	count: number;
	onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
	onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomPagination({
	page,
	rowsPerPage,
	count,
	onPageChange,
	onRowsPerPageChange
}: CustomPaginationProps) {
	const totalPages = Math.ceil(count / rowsPerPage);

	const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
		onPageChange(null, newPage - 1); // Material-Table uses zero-based page index
	};

	return (
		<div className="flex flex-wrap justify-center md:justify-between items-center">
			<TablePagination
				component="div"
				count={count}
				page={page}
				rowsPerPage={rowsPerPage}
				onPageChange={onPageChange}
				onRowsPerPageChange={onRowsPerPageChange}
			/>
			<Pagination
				className="custom-pagination"
				count={totalPages} // total items/rows per page
				page={page + 1} // Adjust for zero-based index
				onChange={handlePageChange}
				color="primary"
				showFirstButton
				showLastButton
			/>
		</div>
	);
}

function MaterialTableWrapperModified({
	title,
	data,
	columns,
	externalAddHandler,
	editRowHandler,
	viewRowHandler,
	downloadRowHandler,
	draftRowHandler,
	manageRowHandlerWinng,
	addText,
	pageSize,
	exportHandler = false,
	handleChangePage,
	handleChangeRowsPerPage,
	currentPage,
	totalCount,
	dataLoading = false,
	isSearchAvailable = false,
	uploadRowHandler
}: TableProps) {
	const enhancedColumns = columns.map((column: TableColumn) => {
		if (column.field.toLowerCase().includes('status')) {
			return {
				...column,
				render: (rowData: TableData) => {
					const fieldValue = rowData[column.field];

					if (typeof fieldValue === 'boolean') {
						return (
							<div
								className="min-w-[87px] max-w-max text-[10px] md:text-[12px] text-center capitalize px-[10px] py-[4px] font-600 rounded-full"
								style={{
									...getActiveStatusStyles(fieldValue)
								}}
							>
								{fieldValue ? 'Active' : 'Inactive'}
							</div>
						);
					}

					return (
						<div
							className="min-w-[87px] max-w-max text-[10px] md:text-[12px] text-center capitalize px-[10px] py-[4px] font-600 rounded-full"
							style={{
								...getStatusStyles(fieldValue)
							}}
						>
							{fieldValue}
						</div>
					);
				}
			};
		}

		return column;
	});

	function ExternalAddAction({ onClick, addText }) {
		return (
			<ExternalAddButton
				onClick={onClick}
				addText={addText}
			/>
		);
	}

	function UploadAction() {
		return <CloudUploadIcon />;
	}

	function DraftAction() {
		return <CurrencyExchangeIcon />;
	}

	function CustomPaginationComponent({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) {
		return (
			<CustomPagination
				count={count}
				page={page}
				rowsPerPage={rowsPerPage}
				onPageChange={onPageChange}
				onRowsPerPageChange={onRowsPerPageChange}
			/>
		);
	}

	return (
		<MaterialTable
			title={title}
			data={data}
			columns={enhancedColumns}
			isLoading={dataLoading}
			actions={[
				externalAddHandler && {
					icon: () => (
						<ExternalAddAction
							onClick={externalAddHandler}
							addText={addText}
						/>
					),
					tooltip: addText,
					isFreeAction: true,
					onClick: () => externalAddHandler && externalAddHandler()
				},

				editRowHandler && {
					icon: 'edit',
					tooltip: 'Edit',
					disabled: false,
					onClick: (event, selectedRow) => {
						editRowHandler(selectedRow);
					}
				},

				viewRowHandler && {
					icon: 'visibility',
					tooltip: 'View',
					disabled: false,
					onClick: (event, selectedRow) => {
						viewRowHandler(selectedRow);
					}
				},

				downloadRowHandler && {
					icon: 'download',
					tooltip: 'Download',
					disabled: false,
					onClick: (event, selectedRow) => {
						viewRowHandler(selectedRow);
					}
				},

				draftRowHandler && {
					icon: 'bookmark',
					tooltip: 'Draft',
					disabled: false,
					onClick: (event, selectedRow) => {
						draftRowHandler(selectedRow);
					}
				}

				// uploadRowHandler && {
				// 	icon: () => <UploadAction onClick={uploadRowHandler} />,
				// 	tooltip: 'upload',
				// 	disabled: false,
				// 	onClick: (event, selectedRow) => {
				// 	  uploadRowHandler(selectedRow);
				// 	}
				// },

				// manageRowHandlerWinng && {
				// 	icon: () => <DraftAction onClick={manageRowHandlerWinng} />,
				// 	tooltip: 'Draft',
				// 	disabled: false,
				// 	onClick: (event, selectedRow) => {
				// 	  if (!selectedRow.isCollected) {
				// 		manageRowHandlerWinng(selectedRow);
				// 	  }
				// 	}
				// }
			].filter(Boolean)}
			options={{
				showTitle: true,
				search: isSearchAvailable,
				actionsColumnIndex: -1,
				exportButton: exportHandler,
				headerStyle: {
					background: '#4c56a3',
					color: 'white',
					paddingRight: '1rem',
					alignItems: 'center'
				},
				pageSize: 100, // Set default page size
				pageSizeOptions: [5, 10, 25, 50, 75, 100], // Optional: set options for page sizes
				emptyRowsWhenPaging: false // Optional: show empty rows when paging
			}}
			components={{
				Pagination: (props) => (
					<CustomPaginationComponent
						{...props}
						count={totalCount}
						page={currentPage}
						rowsPerPage={pageSize}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				)
			}}
		/>
	);
}

export default MaterialTableWrapperModified;
