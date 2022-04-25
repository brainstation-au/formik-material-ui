import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  InputLabelProps,
  NativeSelect as MuiNativeSelect,
  NativeSelectProps as MuiNativeSelectProps,
} from '@mui/material';
import { NativeSelectInputProps } from '@mui/material/NativeSelect/NativeSelectInput';
import { useField } from 'formik';
import React, { FunctionComponent } from 'react';

export interface NativeSelectOption {
  label: string;
  value: string;
}

export interface NativeSelectProps {
  name: string;
  label: string;
  options: NativeSelectOption[];
  formControlProps?: Omit<FormControlProps, 'error' | 'children'>;
  inputLabelProps?: Omit<InputLabelProps, 'children' | 'error'>;
  nativeSelectProps?: Omit<
    MuiNativeSelectProps,
    'onBlur' | 'onChange' | 'value' | 'inputProps'
  > & {
    inputProps: Omit<
      NativeSelectInputProps,
      'name' | 'onBlur' | 'onChange' | 'value'
    >;
  };
  helperText?: string;
}

export const NativeSelect: FunctionComponent<NativeSelectProps> = ({
  name: fieldName,
  label,
  options,
  formControlProps,
  inputLabelProps,
  nativeSelectProps,
  helperText,
}) => {
  const [field, meta] = useField<string>(fieldName);
  const { name, ...fieldProps } = field;
  const formError: boolean = meta.touched && !!meta.error;
  const { inputProps, ...nativeSelectPropsRest } = nativeSelectProps || {};
  const { id, ...inputPropsRest } = inputProps || {};
  const elementId = id || `native-select-for-${name}`;

  return (
    <FormControl {...formControlProps} error={formError}>
      <InputLabel {...inputLabelProps} htmlFor={elementId}>
        {label}
      </InputLabel>
      <MuiNativeSelect
        {...nativeSelectPropsRest}
        inputProps={{
          ...inputPropsRest,
          name,
          id: elementId,
        }}
        {...fieldProps}
      >
        <option aria-label="None" value="" />
        {options.map((item) => (
          <React.Fragment key={item.label}>
            <option value={item.value}>{item.label}</option>
          </React.Fragment>
        ))}
      </MuiNativeSelect>
      <FormHelperText>{formError ? meta.error : helperText}</FormHelperText>
    </FormControl>
  );
};
