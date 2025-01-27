/* eslint-disable */
import * as React from 'react';
import { FieldProps } from 'formik';
import MultipleSelectChip from './MultipleSelectChip';
import { toast } from 'react-toastify';

const FormikMultipleSelectChip: React.FC<FieldProps> = ({ field, form, ...props }) => {
  const { name, value } = field;
  const { setFieldValue } = form;

  const handleAdd = (chip: string) => {
    if (!value.includes(chip)) {
      const updatedValue = [...value, chip];
      setFieldValue(name, updatedValue);
    } else {
      toast.warning(`Duplicate keyword not added : ${chip}`);
    }
  };

  const handleDelete = (chipToDelete: string) => {
    const updatedValue = value.filter((chip: string) => chip !== chipToDelete);
    setFieldValue(name, updatedValue);
  };

  return (
      <MultipleSelectChip
          chips={value || []}
          onAdd={handleAdd}
          onDelete={handleDelete}
          {...props}
      />
  );
};

export default FormikMultipleSelectChip;