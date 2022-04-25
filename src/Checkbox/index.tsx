import React, { FunctionComponent } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormControlProps,
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
  FormControlLabelProps,
} from '@mui/material';
import { useField } from 'formik';

export interface CheckboxProps {
  name: string;
  label: string;
  helperText?: string;
  formControlProps?: Omit<FormControlProps, 'error' | 'children'>;
  formControlLabelProps?: Omit<
    FormControlLabelProps,
    'checked' | 'control' | 'label' | 'onBlur' | 'onChange' | 'value'
  >;
  checkboxProps?: Omit<
    MuiCheckboxProps,
    'checked' | 'disabled' | 'onChange' | 'onBlur' | 'value' | 'name'
  >;
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({
  name,
  label,
  helperText,
  formControlProps,
  formControlLabelProps,
  checkboxProps,
}) => {
  const [field, meta] = useField<boolean>(name);
  const { value, ...fieldProps } = field;
  const formError = meta.touched && !!meta.error;

  return (
    <FormControl {...formControlProps} error={formError}>
      <FormControlLabel
        {...formControlLabelProps}
        {...fieldProps}
        control={<MuiCheckbox {...checkboxProps} />}
        label={label}
        value={true}
        checked={value}
      />
      <FormHelperText>{formError ? meta.error : helperText}</FormHelperText>
    </FormControl>
  );
};
