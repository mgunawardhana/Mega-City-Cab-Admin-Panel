import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { FieldProps } from 'formik';

interface ResponsiveTimePickersProps extends FieldProps {
	defaultValue?: Dayjs;
	disabled?: boolean;
}

const ResponsiveTimePickers: React.FC<ResponsiveTimePickersProps> = ({
	field,
	form,
	defaultValue = dayjs(),
	disabled = false
}) => {
	const [selectedTime, setSelectedTime] = React.useState<Dayjs | null>(defaultValue);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DesktopTimePicker
				value={selectedTime}
				onChange={(newValue) => {
					setSelectedTime(newValue);
					form.setFieldValue(field.name, newValue ? newValue.format('HH:mm') : '');
				}}
				disabled={disabled}
			/>
		</LocalizationProvider>
	);
};

export default ResponsiveTimePickers;
