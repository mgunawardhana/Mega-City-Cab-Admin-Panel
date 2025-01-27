import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The AllLotteriesHeader component.
 */

function AllCustomersHeader() {
	return (
		<div className="flex w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex flex-col flex-auto">
					<Typography className="text-3xl font-semibold tracking-tight leading-8">
						All Registered Customers
					</Typography>
				</div>
				<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="inherit"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
					>
						Export
					</Button>
					<Button
						className="whitespace-nowrap"
						variant="outlined"
						color="inherit"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
					>
						SMS
					</Button>
				</div>
			</div>
		</div>
	);
}

export default AllCustomersHeader;
