/* eslint-disable */
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { CircularProgress, Grid, TablePagination } from "@mui/material";
import MaterialTable, { MTableBody, MTableToolbar } from "material-table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaidIcon from "@mui/icons-material/Paid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableContainer: {
      paddingTop: "20px",
      transition: "padding-top 0.3s ease", // Smooth transition for padding changes
    },
    reducedTopSpace: {
      paddingTop: "0px", // Reducing the top padding when search is disabled
    },
    loading: {
      paddingTop: "250px",
    },

    toolbarSection: {
      display: "flex",
      flexWrap: "nowrap",

      "@media (min-width: 320px) and (max-width: 767px)": {
        justifyContent: "flex-start",
        flexWrap: "wrap",
      },
    },

    datatableToolBar: {
      width: "100%",

      "@media (min-width: 320px) and (max-width: 767px)": {
        width: "100% !important",
      },

      "& div.MuiToolbar-root": {
        "@media (min-width: 320px) and (max-width: 767px)": {
          // display: "grid !important",
          flexWrap: "wrap",
        },
      },

      "& .MuiFormControl-root": {
        "@media (min-width: 320px) and (max-width: 767px)": {
          width: "calc(100% - 40px)",
          paddingLeft: "0",
        },
      },
    },

    toolbarMenuIcon: {
      height: "fit-content",
      alignSelf: "center",
    },

    tableHeader: {
      whiteSpace: "nowrap", // Prevents header wrapping
      textAlign: "center",
      padding: "8px 16px",
      fontWeight: "bold",
    },
  })
);

export const MaterialTableWrapper = (props: any) => {
  const {
    disablePagination, // New prop to disable pagination
    disableSearch = false,
    filterChanged,
    handleColumnFilter,
    tableColumns,
    exportToExcel,
    handleRowDeleteAction,
    updateAction,
    addAction,
    handlePageChange,
    handlePageSizeChange,
    pageSize,
    pageIndex,
    title,
    externalEdit,
    externalView,
    disableColumnFiltering,
    handleCommonSearchBar,
    searchByText,
    loading,
    count,
    parentChildData,
    selection,
    selectionExport,
    records,
  } = props;

  const defaultEditOptions = {
    onRowUpdate: (newData: any, oldData: any) =>
      new Promise((resolve) => {
        updateAction(newData, oldData, resolve);
      }),
    onRowAdd: (newData: any) =>
      new Promise((resolve, reject) => {
        addAction(newData, resolve, reject);
      }),
    onRowDelete: (oldData: any) =>
      new Promise((resolve, reject) => {
        handleRowDeleteAction(oldData, resolve, reject);
      }),
  };

  const [editableOptions, setEditableOptions] =
    useState<any>(defaultEditOptions);

  const [columnOptions, setColumnOptions] = useState<any>([]);
  const [pageNo, setPageNo] = useState<number>(0);

  const materialListRef = React.useRef();

  useEffect(() => {
    handleEditOptions();
  }, [selection]);

  const handleEditOptions = () => {
    let optionsVar: any[] = [];
    let columnOptions: any[] = [];

    if (handleRowDeleteAction && !selection) {
      optionsVar.push({
        onRowDelete: (oldData: any) =>
          new Promise((resolve) => {
            handleRowDeleteAction(oldData, resolve);
          }),
      });
    }
    if (updateAction && !selection) {
      optionsVar.push({
        onRowUpdate: (newData: any, oldData: any) =>
          new Promise((resolve) => {
            updateAction(newData, oldData, resolve);
          }),
      });
    }
    if (addAction && !selection) {
      optionsVar.push({
        onRowAdd: (newData: any) =>
          new Promise((resolve, reject) => {
            addAction(newData, resolve, reject);
          }),
      });
    }
    if (externalView && !selection) {
      columnOptions.push({
        icon: "visibility",
        tooltip: "View",
        onClick: (event: any, selectedRow: any) => {
          externalView(selectedRow);
          // open dialog and fill your data to update
        },
      });
    }
    if (externalEdit && !selection) {
      columnOptions.push({
        icon: "edit",
        tooltip: "Edit",
        onClick: (event: any, selectedRow: any) => {
          externalEdit(selectedRow);
          // open dialog and fill your data to update
        },
      });
    }
    if (selection) {
      columnOptions.push({
        icon: "checkbox",
        onClick: (event: any, selectedRow: any) => {
          selectionExport(selectedRow);
        },
      });
    }

    const allActions = Object.assign({}, ...optionsVar);
    setEditableOptions(allActions);
    setColumnOptions(columnOptions);
  };

  const CustomPaginationComponent = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
  }) => (
    <CustomPaginationComponent
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );

  return (
    <Grid container>
      <Grid
        id="m-table"
        item
        xs={12}
        sm={12}
        md={12}
        className={`custom-table lightTable table-shadow-0 blueUnderLineIndicator redTableStrip overflow-hidden shadow-0`}
      >
        <MaterialTable
          tableRef={materialListRef}
          columns={tableColumns}
          isLoading={loading}
          data={records}
          title={title}
          onSelectionChange={(rows) => {
            if (props.onSelectionChange) {
              props.onSelectionChange(rows);
            }
          }}
          onSearchChange={(e: any) => {
            if (handleCommonSearchBar) {
              handleCommonSearchBar(e);
            }
          }}
          onFilterChange={(e: any) => {
            handleColumnFilter(e);
          }}
          editable={editableOptions}
          components={{
            //Toolbar: (props) => <div style={{ height: '0px' }} /> , // Set height to zero
            Toolbar: (props) =>
              disableSearch ? (
                <div style={{ minHeight: "0px", height: "0px" }}>
                  {" "}
                  {/* Hide or reduce toolbar when search is disabled */}
                </div>
              ) : (
                <MTableToolbar {...props} />
              ), // Use default toolbar when search is enabled
            Body: (bodyProps) => (
              <MTableBody
                {...bodyProps}
                onFilterChanged={(columnId: number, value: string) => {
                  filterChanged(columnId, value);
                  bodyProps.onFilterChanged(columnId, value);
                }}
              />
            ),
            OverlayLoading: (props) => (
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <CircularProgress style={{ color: "#032370" }} size={42} />
              </div>
            ),
            Pagination: (props2) =>
              !disablePagination && (
                <TablePagination
                  SelectProps={props2.SelectProps}
                  colSpan={props2.colSpan}
                  count={count}
                  labelDisplayedRows={props2.labelDisplayedRows}
                  labelRowsPerPage={""}
                  style={props2.style}
                  // rowsPerPageOptions={[5, 10, 20]}
                  rowsPerPage={pageSize}
                  page={pageIndex}
                  onPageChange={(event, page) => {
                    props2.onPageChange(event, page);
                    setPageNo(page);
                    handlePageChange(page);
                  }}
                  onRowsPerPageChange={(event) => {
                    const newPageSize = parseInt(event.target.value, 10);
                    props2.onRowsPerPageChange(event, newPageSize);
                    handlePageChange(0);
                    handlePageSizeChange(newPageSize);
                  }}
                />
              ),
          }}
          actions={[
            props.tableRowPrintHandler && {
              icon: () => <PrintIcon style={{ color: "orange" }} />,
              tooltip: "Print",
              disabled: false,
              onClick: (event, selectedRow) => {
                props.tableRowPrintHandler(selectedRow);
              },
              position: "row",
            },
            props.tableRowViewHandler && {
              icon: () => (
                <VisibilityIcon
                  style={{ fontSize: "23px", color: "#3558AE" }}
                />
              ),
              tooltip: "View",
              disabled: false,
              onClick: (event, selectedRow) => {
                props.tableRowViewHandler(selectedRow);
              },
              position: "row",
            },
            props.isTransActionPayeeVisible && {
              icon: () => <VisibilityIcon style={{ color: "#757575FF" }} />,
              tooltip: "History",
              disabled: false,
              onClick: (event, selectedRow) => {
                props.clickHistoryButtion(selectedRow);
              },
            },

            props.tableRowEditHandler && {
              icon: () => <EditIcon style={{ color: "green" }} />,
              tooltip: "Edit",
              disabled: false,
              onClick: (event, selectedRow) => {
                props.tableRowEditHandler(selectedRow);
              },
            },

            props.isPayVisible && {
              icon: () => <PaidIcon style={{ color: "#3558AE" }} />,
              tooltip: "Pay",
              disabled: false,
              onClick: (event, selectedRow) => {
                props.clickPayButton(selectedRow);
              },
            },
            props.tableRowDeleteHandler && {
              icon: () => <DeleteIcon style={{ color: "red" }} />,
              tooltip: "Delete",
              disabled: false,
              onClick: (event, selectedRow) => {
                props.tableRowDeleteHandler(selectedRow);
              },
            },
          ]}
          options={{
            filtering: disableColumnFiltering ? !disableColumnFiltering : true,
            pageSizeOptions: [5, 10, 25, 50, 75, 100], // Optional: set options for page sizes
            search: !disableSearch,
            addRowPosition: "first",
            debounceInterval: 1000,
            filterCellStyle: {
              padding: "0px",
              height: "0.2em",
            },
            // pageSize: pageSize,
            // pageSize: disablePagination ? records.length : 5,
            headerStyle: {
              backgroundColor: "#93A1D6BA",
              color: "black",
              height: "50px",
              fontWeight: 400,
              whiteSpace: "nowrap",
              padding: "0px 8px",
            },
            exportButton:
              exportToExcel && !selection ? { csv: true, pdf: false } : false,
            exportAllData: true,

            rowStyle: {
              fontWeight: "400",
              fontSize: "14px", // This will reduce the font size of the table body
              whiteSpace: "nowrap", // This will prevent the table body from wrapping to the next line
            },

            exportCsv: (columns, data) => {
              exportToExcel(columns, data);
            },
            actionsColumnIndex: -1,
            selection: selection ? selection : false,
            pageSize: 100, // Set default page size
            emptyRowsWhenPaging: false, // Optional: show empty rows when paging
          }}
          localization={{
            toolbar: {
              addRemoveColumns: "Add or remove columns",
              nRowsSelected: "{0} row(s) selected",
              showColumnsTitle: "Show Columns",
              showColumnsAriaLabel: "Show Columns",
              exportTitle: "Export",
              exportAriaLabel: "Export",
              exportCSVName: "Export as Excel",
              exportPDFName: "Export as PDF",
              searchTooltip: "Search",
              searchPlaceholder: !searchByText ? "Search" : searchByText,
              searchAriaLabel: "Search",
              clearSearchAriaLabel: "Clear Search",
            },
            body: { emptyDataSourceMessage: "" },
          }}
          parentChildData={parentChildData}
        />
      </Grid>
    </Grid>
  );
};
export default MaterialTableWrapper;
