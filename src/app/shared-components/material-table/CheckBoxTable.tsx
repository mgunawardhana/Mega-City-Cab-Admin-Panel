import MaterialTable from 'material-table';
import { Checkbox, Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

interface TableProps {
	title: string;
	data: Array<any>;
	columns: Array<any>;
	setData?: (data: any) => void;
	externalAddButton?: boolean;
	externalAddHandler?: () => void;
	addText?: string;
	popup?: boolean;
}

function CheckBoxesTable({
	title,
	data,
	columns,
	setData,
	externalAddButton = false,
	externalAddHandler,
	addText
}: TableProps) {
	const handleCheckboxChange = (rowData, attr) => (event) => {
		const isChecked = event.target.checked;
		const newData = data.map((row) => {
			// Update the main row if it matches
			if (row.id === rowData.id) {
				return { ...row, [attr]: isChecked };
			}
			// Check if this row has childRows and update them if applicable

			if (row.id === rowData.id) {
				return {
					...row,
					[attr]: isChecked,
					subModules: row.subModules.map((childRow) => ({
						...childRow,
						[attr]: isChecked
					}))
				};
			}

			if (row.subModules) {
				return {
					...row,
					subModules: row.subModules.map((childRow) => {
						if (childRow.id === rowData.id) {
							return { ...childRow, [attr]: isChecked };
						}

						return childRow;
					})
				};
			}

			return row;
		});

		// Update the data state with the new data
		if (setData) setData(newData);
	};

	const enhancedColumns = columns.map((column) => {
		if (column.field !== 'module') {
			return {
				...column,
				render: (rowData) => (
					<Checkbox
						checked={rowData[column.field]}
						onChange={handleCheckboxChange(rowData, column.field)}
					/>
				)
			};
		}

		return column;
	});

	return (
		<MaterialTable
			title={title}
			data={data}
			columns={enhancedColumns}
			actions={[
				externalAddButton && {
					icon: () => (
						<Button
							className="whitespace-nowrap"
							variant="contained"
							color="primary"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:document-add</FuseSvgIcon>}
						>
							{addText}
						</Button>
					),
					tooltip: addText, // Fix this line
					isFreeAction: true,
					onClick: (event) => externalAddHandler && externalAddHandler() // Ensure handler is called
				}
			].filter(Boolean)}
			options={{
				showTitle: true,
				search: false,
				actionsColumnIndex: -1,
				exportButton: false,
				headerStyle: {
					background: '#4c56a3',
					color: 'white',
					paddingRight: '1rem',
					alignItems: 'center'
				}
			}}
			parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
		/>
	);
}

export default CheckBoxesTable;
