import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  NativeSelect,
  NativeSelectProps,
} from '@mui/material';
import { NativeSelectInputProps } from '@mui/material/NativeSelect/NativeSelectInput';
import { useField } from 'formik';
import React, { FunctionComponent } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SingleSelectProps
  extends Omit<FormControlProps, 'children' | 'error'> {
  helperText?: string;
  id?: string;
  label: string;
  name: string;
  options: SelectOption[];
  selectProps?: Omit<
    NativeSelectProps,
    'children' | 'inputProps' | 'onChange' | 'value' | 'variant'
  > & {
    inputProps?: Omit<NativeSelectInputProps, 'name' | 'id'>;
  };
}

export const SingleSelect: FunctionComponent<SingleSelectProps> = ({
  helperText,
  id,
  label,
  name,
  options,
  selectProps,
  ...formControlProps
}) => {
  const [field, meta] = useField<string>(name);
  const formError = meta.touched && !!meta.error;
  const elementId = id || `single-select-${Math.ceil(Math.random() * 1000)}`;
  const { inputProps, ...nativeSelectProps } = selectProps || {};

  return (
    <FormControl {...formControlProps} error={formError}>
      <InputLabel htmlFor={elementId}>{label}</InputLabel>
      <NativeSelect
        {...nativeSelectProps}
        value={field.value}
        onChange={field.onChange}
        inputProps={{
          ...inputProps,
          id: elementId,
          name,
        }}
      >
        <option aria-label="None" value="" />
        {options.map((o) => (
          <option key={o.label} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
      <FormHelperText>{formError ? meta.error : helperText}</FormHelperText>
    </FormControl>
  );
};
