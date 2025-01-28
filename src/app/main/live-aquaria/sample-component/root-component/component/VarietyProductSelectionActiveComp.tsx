import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ReportIcon from '@mui/icons-material/Report';
import DialogContent from '@mui/material/DialogContent';
import { DialogContentText, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { GeneralAdvItemSelection } from '../types/general-advertisement-types';

interface Props {
	clickedRowData: GeneralAdvItemSelection;
	toggleModal: () => void;
	isOpen: boolean;
	handleAlertForm: () => void;
}

function VarietyProductSelectionActiveComp({ clickedRowData, toggleModal, isOpen, handleAlertForm }: Props) {
	return (
		<Dialog
			open={isOpen}
			onClose={toggleModal}
		>
			<DialogTitle className="flex items-center gap-[5px] text-[16px] font-bold">
				<ReportIcon className="text-red text-[20px]" />
				Confirmation
			</DialogTitle>
			<DialogContent>
				<DialogContentText className="text-[10px] sm:text-[12px] lg:text-[14px]">
					Are you sure you want to{' '}
					<span className="font-bold">{clickedRowData.is_active === 1 ? 'Inactive' : 'Active'}</span> this
					Selection?
				</DialogContentText>
				<Grid
					container
					spacing={2}
					className="pt-[15px]"
				>
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
						className="flex justify-end items-center gap-[10px] pt-[15px!important]"
					>
						<Button
							className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							type="button"
							variant="contained"
							size="medium"
							disabled={false}
							onClick={handleAlertForm}
						>
							Confirm
						</Button>

						<Button
							className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
							type="button"
							variant="contained"
							size="medium"
							disabled={false}
							onClick={toggleModal}
						>
							Cancel
						</Button>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default VarietyProductSelectionActiveComp;
