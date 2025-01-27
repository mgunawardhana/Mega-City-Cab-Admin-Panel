/* eslint-disable */
import React from 'react';
import { FieldProps, getIn } from 'formik';
import TextField from '@mui/material/TextField';

const TextFormField: React.FC<FieldProps> = ({ field, form, ...props }) => {
  const errorText =
    getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <TextField
      className={'inputLight'}
      size='small'
      helperText={errorText}
      error={!!errorText}
      inputProps={{
        style: {
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: 1.1,
        },
        min: '2024-05-01',
        max: '2024-05-15',
      }}
      FormHelperTextProps={{
        style: {
          fontSize: '10px',
          fontWeight: 500,
          marginLeft: 0,
          marginRight: 0,
        },
      }}
      {...field}
      {...props}
    />
  );
};

export default TextFormField;
