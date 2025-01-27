/* eslint-disable */
import { ErrorMessage, Field } from 'formik';
import React, { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';

function CustomTextFormDateField({
  name,
  id,
  placeholder,
  disabled = false,
  changeInput = null,
  min,
  max,
  disabledDays = [],
  disabledDates = [],
}) {
  const shouldDisableDate = (date) => {
    const localDate = dayjs(date).format('YYYY-MM-DD');
    const day = date.getDay();

    if (disabledDays.includes(day)) {
      return true;
    }

    if (disabledDates.includes(localDate)) {
      console.log('CustomTextFormDateField rendered', localDate);
      return true;
    }

    return false;
  };

  useEffect(() => {
    // Initialization if necessary
  }, []);

  return (
    <Field name={name} size='small'>
      {({ field, form }) => (
        <div className='flex-1'>
          <DatePicker
            {...field}
            label={placeholder}
            id={id}
            style={{ minWidth: '100%' }}
            className='max-h-[40px] min-w-full'
            size='small'
            disabled={disabled}
            inputFormat='yyyy-MM-dd'
            onChange={(newValue) => {
              form.setFieldValue(name, newValue);
              changeInput && changeInput(newValue, form);
            }}
            renderInput={(params) => (
                <TextField
                    size="small"
                    {...params}
                    fullWidth
                    error={Boolean(form.errors[name] && form.touched[name])} // Only show error when there is an actual validation error
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: form.errors[name] && form.touched[name] ? 'initial' : 'initial', // Reset border color when error is true
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'initial', // Border color when focused
                        },
                        '&.Mui-error fieldset': {
                          borderColor: 'initial', // Override the default red color for error state
                        },
                      },
                    }}
                />


            )}
            shouldDisableDate={shouldDisableDate}
            minDate={min ? dayjs(min).toDate() : undefined}
            maxDate={max ? dayjs(max).toDate() : undefined}
          />

          <ErrorMessage
            className='custom-combo-error'
            name={name}
            component='span'
          />
        </div>
      )}
    </Field>
  );
}

export default CustomTextFormDateField;