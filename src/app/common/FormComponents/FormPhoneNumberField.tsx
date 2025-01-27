/* eslint-disable */
import React from 'react';
import { useField } from 'formik';
import MuiPhoneNumber from 'material-ui-phone-number';

function FormPhoneNumberField({ name, id, onChange,...props }) {
	const [field, meta, helpers] = useField(name);

	const handleOnChange = (value) => {
		helpers.setValue(value);

		if (onChange) {
			onChange(value);
		}
	};

	return (
		<div className="">
			<MuiPhoneNumber
				{...field}
				{...props}
				defaultCountry="us"
				onChange={handleOnChange}
				className="max-h-[40px!important]"
				fullWidth
				sx={{
					border: '1px solid #ccc',
					borderRadius: '2px',
					padding: '2px',
					'& .MuiInputBase-root.MuiInput-root.MuiInput-underline': {
						width: 'calc(100% - 20px)',
						minHeight: '34px',
						maxHeight: '34px',
						margin: '0 auto',
						'&::before': {
							content: 'none'
						},
						'&::after': {
							content: 'none'
						}
					}
				}}
			/>
			{meta.touched && meta.error && (
				<div style={{ color: 'red', marginTop: '2px', fontSize: '10px' }}>{meta.error}</div>
			)}
		</div>
	);
}

export default FormPhoneNumberField;
