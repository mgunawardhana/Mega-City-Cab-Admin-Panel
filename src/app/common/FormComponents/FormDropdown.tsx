/* eslint-disable */
import React from 'react';
import { useField } from 'formik';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
interface Props {
	name?:string,
	id?:string,
	placeholder?:string,
	optionsValues?:any,
	changeDropdown?:any,
	disabled?:boolean,
	onChange?:any,
	value?:any,
}
function FormDropdown({
						  name,
						  id,
						  placeholder,
						  optionsValues = [],
						  changeDropdown = null,
						  disabled = false,
						  onChange,
					  }:Props) {
	const [field, meta, helpers] = useField(name);
	const { value } = field;
	const { setValue } = helpers;

	return (
		<FormControl
			size="small"
			fullWidth
			error={meta.touched && Boolean(meta.error)}
			disabled={disabled}
		>
			<InputLabel
				sx={{ fontWeight: 350 }}
				id={`${id}-label`}
			>
				{placeholder}
			</InputLabel>
			<Select
				labelId={`${id}-label`}
				id={id}
				label={placeholder}
				value={value || ''} // Use value directly from Formik's field
				onChange={(e) => {
					const selectedValue = e.target.value;
					setValue(selectedValue); // Update Formik's value

					if (onChange) {
						onChange(e);
					}

					if (changeDropdown) {
						changeDropdown(selectedValue);
					}
				}}
			>
				{optionsValues.map((option, index) => (
					<MenuItem
						key={index}
						value={option.value}
					>
						{option.label}
					</MenuItem>
				))}
			</Select>
			{meta.touched && meta.error ? (
				<FormHelperText className="custom-combo-error">{meta.error}</FormHelperText>
			) : null}
		</FormControl>
	);
}

export default FormDropdown;
