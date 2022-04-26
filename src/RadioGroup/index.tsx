import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  FormLabel,
  FormLabelProps,
  Radio,
  RadioGroup as MuiRadioGroup,
  RadioProps,
} from '@mui/material';
import { useField } from 'formik';
import React, { FunctionComponent } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  formControlLabelProps?: Omit<
    FormControlLabelProps,
    'checked' | 'label' | 'onChange' | 'onBlur' | 'value'
  >;
  radioProps?: Omit<
    RadioProps,
    'checked' | 'name' | 'onChange' | 'onBlur' | 'value'
  >;
}

export interface RadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  row?: boolean;
  formControlProps?: Omit<FormControlProps, 'error' | 'children'>;
  formLabelProps?: Omit<FormLabelProps, 'error' | 'children'>;
  formHelperTextProps?: Omit<FormHelperTextProps, 'error' | 'children'>;
  helperText?: string;
}

export const RadioGroup: FunctionComponent<RadioGroupProps> = ({
  label,
  name,
  options,
  row,
  formControlProps,
  formLabelProps,
  formHelperTextProps,
  helperText,
}) => {
  const [field, meta] = useField<string>(name);
  const formError: boolean = meta.touched && !!meta.error;

  return (
    <FormControl {...formControlProps} error={formError}>
      {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
      <MuiRadioGroup aria-label={label} row={row} {...field}>
        {options.map((option) => (
          <React.Fragment key={option.value}>
            <FormControlLabel
              {...option.formControlLabelProps}
              value={option.value}
              control={<Radio {...option.radioProps} />}
              label={option.label}
            />
          </React.Fragment>
        ))}
      </MuiRadioGroup>
      <FormHelperText {...formHelperTextProps}>
        {formError ? meta.error : helperText}
      </FormHelperText>
    </FormControl>
  );
};
