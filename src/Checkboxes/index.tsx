import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlProps,
  FormGroup,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  FormGroupProps,
  FormControlLabelProps,
} from '@material-ui/core';
import { useField } from 'formik';
import React, { FunctionComponent } from 'react';

export interface CheckboxOption {
  value: string;
  label: string;
  formControlLabelProps?: Omit<
    FormControlLabelProps,
    'checked' | 'control' | 'label' | 'onBlur' | 'onChange' | 'value'
  >;
  checkboxProps?: Omit<
    CheckboxProps,
    'checked' | 'disabled' | 'onChange' | 'onBlur' | 'value' | 'name'
  >;
}

export type CheckboxesProps = {
  name: string;
  label?: string;
  options: CheckboxOption[];
  helperText?: string;
  formControlProps?: Omit<FormControlProps, 'error' | 'children'>;
  formLabelProps?: Omit<FormLabelProps, 'error' | 'children'>;
  formGroupProps?: Omit<FormGroupProps, 'children'>;
};

export const Checkboxes: FunctionComponent<CheckboxesProps> = ({
  name,
  label,
  options,
  helperText,
  formControlProps,
  formLabelProps,
  formGroupProps,
}) => {
  const [field, meta] = useField<string[]>(name);
  const { value, ...fieldProps } = field;
  const formError: boolean = meta.touched && !!meta.error;

  return (
    <FormControl {...formControlProps} error={formError}>
      {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
      <FormGroup {...formGroupProps}>
        {options.map((option) => (
          <React.Fragment key={option.value}>
            <FormControlLabel
              {...option.formControlLabelProps}
              {...fieldProps}
              checked={value.includes(option.value)}
              control={<Checkbox {...option.checkboxProps} />}
              label={option.label}
              value={option.value}
            />
          </React.Fragment>
        ))}
      </FormGroup>
      <FormHelperText>{formError ? meta.error : helperText}</FormHelperText>
    </FormControl>
  );
};
