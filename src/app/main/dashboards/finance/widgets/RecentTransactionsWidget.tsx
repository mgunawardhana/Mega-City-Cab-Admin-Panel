import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import format from 'date-fns/format';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import FuseLoading from '@fuse/core/FuseLoading';
import {
	handleFilterForRecentCompletedBookings
} from '../../../../axios/services/mega-city-services/bookings/BookingService';
import stripeVerifiedPartner from './../../../../assets/Stripe-Verified-Partner-Synthesis.webp';

function RecentTransactionsWidget() {
	const [isLoading, setIsLoading] = useState(true);
	const [rows, setRows] = useState([]);

	const columns = ['Booking', 'Date', 'From', 'To', 'Price', 'Status'];

	useEffect(() => {
		handleAdvancedFiltration();
	}, []);

	const handleAdvancedFiltration = async () => {
		try {
			const response = await handleFilterForRecentCompletedBookings(0, 6, 'COMPLETED');
			if (response && Array.isArray(response.result)) {
				const transformedData = response.result.map((booking) => ({
					id: booking.bookingNumber,
					date: booking.bookingDate,
					from: booking.pickupLocation,
					to: booking.dropOffLocation,
					tot: booking.totalAmount,
					status: 'completed'
				}));
				setRows(transformedData);
			} else {
				console.error('Unexpected data format:', response);
			}
			setIsLoading(false);
		} catch (error) {
			console.error('Error fetching data:', error);
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden relative">
			<div className="flex justify-between items-center">
				<div>
					<Typography className="mr-16 text-lg font-medium tracking-tight leading-6 truncate">
						Recent Bookings
					</Typography>
					<Typography className="font-medium" color="text.secondary">
						{rows.length} completed bookings
					</Typography>
				</div>
				<img src={stripeVerifiedPartner} alt="Stripe Verified Partner" className="max-h-144 w-auto" />
			</div>

			<div className="table-responsive mt-24">
				<Table className="simple w-full min-w-full">
					<TableHead>
						<TableRow>
							{columns.map((column, index) => (
								<TableCell key={index}>
									<Typography
										color="text.secondary"
										className="font-semibold text-12 whitespace-nowrap"
									>
										{column}
									</Typography>
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{rows.map((row, index) => (
							<TableRow key={index}>
								<TableCell component="th" scope="row">
									<Typography color="text.secondary">#{row.id}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>{format(new Date(row.date), 'MMM dd, y')}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>{row.from}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>{row.to}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>Rs {row.tot}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography
										className={clsx(
											'inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase',
											row.status === 'completed' &&
											'bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50'
										)}
									>
										{row.status}
									</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className="pt-24">
					<Button variant="outlined">See all bookings</Button>
				</div>
			</div>
		</Paper>
	);
}

export default memo(RecentTransactionsWidget);
