import MaterialTableWrapper from './tableComponents/MaterialTableWrapper';

function OrdersLogTable({ tableData }) {
	const returnDateandTime = (isoTimestamp) => {
		const date = new Date(isoTimestamp);

		// Format the date and time
		const formattedDate = date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
		const formattedTime = date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
			//   timeZoneName: "short",
		});

		return `Date :${formattedDate} Time :${formattedTime}`;
	};

	const tableColumns = [
		{
			title: 'Created Date & Time',
			field: 'created_at',
			render: (rowData) => returnDateandTime(rowData.created_at)
		},
		{
			title: 'Action Taken',
			field: 'action'
		},
		{ title: 'Details', field: 'details' },
		{
			title: 'Remarks',
			field: 'remark'
		}
	];

	return (
		<MaterialTableWrapper
			title=""
			filterChanged={null}
			handleColumnFilter={null}
			tableColumns={tableColumns}
			handleCommonSearchBar={null}
			disableColumnFiltering
			searchByText=""
			exportToExcel={null}
			handleRowDeleteAction={null}
			externalAdd={null}
			externalEdit={null}
			externalView={null}
			selection={false}
			selectionExport={null}
			disablePagination
			disableSearch
			isColumnChoser
			records={tableData}
		/>
	);
}

export default OrdersLogTable;
