/* eslint-disable */
import { Field, ErrorMessage } from 'formik';
import React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';

interface Props {
	name?:string;
	id?:string;
	placeholder?:string;
	type?:string;
	disabled?:boolean;
	changeInput?:any;
	disablePastDate?:boolean;
	min?:any;
	max?:any;
}

function TextFormDateField({
	name,
	id,
	placeholder,
	type = 'text',
	disabled = false,
	changeInput = null,
	disablePastDate = false,
	min,
	max
}:Props) {
	// Get today's date in YYYY-MM-DD format
	const today = new Date().toISOString().split('T')[0];

	return (
		<Field name={name}>
			{({ field, form }) =>
				changeInput ? (
					<div className="flex-1">
						<OutlinedInput
							{...field}
							type={type}
							placeholder={placeholder}
							id={id}
							style={{ minWidth: '100%' }}
							// className="form-control"
							disabled={disabled}
							size="small"
							invalid={form.errors[name] && form.touched[name]}
							onChange={(e) => {
								const selectedValue = e.target.value;
								// changeInput(selectedValue, form);
								changeInput && changeInput(selectedValue, form);
							}}
							inputProps={{
								min,
								max: disablePastDate ? today : ''
							}}
						/>
						<ErrorMessage
							className="custom-combo-error"
							name={name}
							component="span"
						/>
					</div>
				) : (
					<div className="flex-1">
						<OutlinedInput
							{...field}
							type={type}
							style={{ minWidth: '100%' }}
							placeholder={placeholder}
							id={id}
							// className="form-control"
							size="small"
							disabled={disabled}
							invalid={form.errors[name] && form.touched[name]}
							inputProps={
								{
									// min: minDate,
								}
							}
						/>
						<ErrorMessage
							className="custom-combo-error"
							name={name}
							component="span"
						/>
					</div>
				)
			}
		</Field>
	);
}

export default TextFormDateField;
