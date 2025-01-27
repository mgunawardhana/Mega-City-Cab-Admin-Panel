/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import MaterialTable from 'material-table';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

interface StatusStyles {
	background: string;
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
	addText?: string;
	pageSize?: number;
	exportHandler?: boolean;
}

const getStatusStyles = (status: string): StatusStyles => {
	switch (status) {
		case 'PENDING':
			return { background: '#631878', color: 'white' };
		case 'In Progress':
			return { background: '#D39C2F', color: 'white' };
		case 'Approved':
			return { background: '#629C44', color: 'white' };
		case 'Rejected':
			return { background: '#B70F0A', color: 'white' };
		case 'ACTIVE':
			return { background: '#629C44', color: 'white' };
		case 'Inactive':
			return { background: '#606060', color: 'white' };
		case 'On Hold':
			return { background: '#606060', color: 'white' };
		case 'Verified':
			return { background: '#629C44', color: 'white' };
		case 'Un-Verified':
			return { background: '#606060', color: 'white' };
		default:
			return { background: '#000', color: 'white' };
	}
};

const getActiveStatusStyles = (status: boolean): StatusStyles => {
	return status ? { background: '#629C44', color: 'white' } : { background: '#606060', color: 'white' };
};

function ExternalAddButton({ onClick, addText }: { onClick?: () => void; addText?: string }) {
	return (
		<Button
			className="whitespace-nowrap"
			variant="contained"
			color="primary"
			startIcon={<FuseSvgIcon size={20}>heroicons-outline:document-add</FuseSvgIcon>}
			onClick={onClick}
		>
			{addText}
		</Button>
	);
}

function MaterialTableWrapper({
	title,
	data,
	columns,
	externalAddButton = false,
	externalAddHandler,
	editRowHandler,
	viewRowHandler,
	downloadRowHandler,
	draftRowHandler,
	manageRowHandlerWinng,
	addText,
	pageSize = 10,
	exportHandler = false
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
								style={{
									...getActiveStatusStyles(fieldValue),
									padding: '5px',
									borderRadius: '5px',
									textAlign: 'center',
									width: '50%'
								}}
							>
								{fieldValue ? 'Active' : 'Inactive'}
							</div>
						);
					}

					return (
						<div
							style={{
								...getStatusStyles(fieldValue),
								padding: '5px',
								borderRadius: '5px',
								textAlign: 'center'
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

	return (
		<MaterialTable
			title={title}
			data={data}
			columns={enhancedColumns}
			// isLoading={true}
			actions={[
				externalAddButton && {
					// eslint-disable-next-line react/no-unstable-nested-components
					icon: () => (
						<ExternalAddButton
							onClick={externalAddHandler}
							addText={addText}
						/>
					),
					tooltip: addText, // Fix this line
					isFreeAction: true,
					onClick: (event) => externalAddHandler && externalAddHandler() // Ensure handler is called
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
						if (selectedRow.designApprovalStatus === 'In Progress') {
							draftRowHandler(selectedRow);
						}
					}
				},

				manageRowHandlerWinng && {
					icon: () => <CurrencyExchangeIcon />,
					tooltip: 'Draft',
					disabled: false,
					onClick: (event, selectedRow) => {
						if (selectedRow.claimedStatus !== 'Verified') {
							manageRowHandlerWinng(selectedRow);
						}
					}
				}
			].filter(Boolean)}
			options={{
				showTitle: true,
				search: true,
				actionsColumnIndex: -1,
				exportButton: exportHandler,
				headerStyle: {
					background: '#4c56a3',
					color: 'white',
					paddingRight: '1rem',
					alignItems: 'center'
				},
				pageSize, // Set default page size
				pageSizeOptions: [5, 10, 25, 50, 75, 100] // Optional: set options for page sizes
			}}
		/>
	);
}

export default MaterialTableWrapper;
