import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';

// Define prop types
interface DynamicDeleteAlertFormProps {
	isOpen: boolean;
	toggleModal: () => void;
	confirmDelete: () => void;
	deleteProductId?: string;
}

// eslint-disable-next-line react/function-component-definition
const DynamicDeleteAlertForm: React.FC<DynamicDeleteAlertFormProps> = ({
	isOpen,
	toggleModal,
	confirmDelete,
	deleteProductId
}) => {
	return (
		<Dialog
			open={isOpen}
			onClose={toggleModal}
		>
			<DialogTitle className="flex items-center gap-[5px] text-[16px] font-bold">
				<ReportIcon
					color="error"
					className="text-[20px]"
				/>{' '}
				Confirmation
			</DialogTitle>
			<DialogContent>
				<DialogContentText className="text-[10px] sm:text-[12px] lg:text-[14px]">
					Are you sure you want to delete <span className="font-bold">{deleteProductId || ''}</span> this
					Product?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={toggleModal}
					className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80 bokShadow"
					variant="contained"
					size="medium"
				>
					Cancel
				</Button>
				<Button
					onClick={confirmDelete}
					className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow"
					autoFocus
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DynamicDeleteAlertForm;
