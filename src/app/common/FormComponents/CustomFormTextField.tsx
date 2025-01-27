/* eslint-disable */
import { ErrorMessage, Field } from 'formik';
import React from 'react';
import TextField from '@mui/material/TextField';

const CustomFormTextField = ({
  name,
  id,
  placeholder,
  type = 'text',
  disabled = false,
  changeInput = null,
  disablePastDate = false,
  style = {},
}) => {
  // const today = new Date().toISOString().split('T')[0];
  // @ts-ignore
  const { minHeight } = style;

  return (
    <Field name={name}>
      {({ field, form }) =>
        changeInput ? (
          <div className='flex-1'>
            <TextField
              {...field}
              type={type}
              placeholder={placeholder}
              id={id}
              // className='form-control'
              disabled={disabled}
              size='small'
              style={{ minHeight, minWidth: '100%' }}
              invalid={form.errors[name] && form.touched[name]}
              onChange={(e) => {
                const selectedValue = e.target.value;
                changeInput(selectedValue, form);
              }}
            />
            <ErrorMessage
              className='custom-combo-error'
              name={name}
              component='span'
            />
          </div>
        ) : (
          <div className='flex-1'>
            <TextField
              {...field}
              type={type}
              placeholder={placeholder}
              id={id}
             // className='form-control'
              size='small'
              disabled={disabled}
              invalid={form.errors[name] && form.touched[name]}
              style={{ minHeight, minWidth: '100%' }}
            />
            <ErrorMessage
              className='custom-combo-error'
              name={name}
              component='span'
            />
          </div>
        )
      }
    </Field>
  );
};

export default CustomFormTextField;
