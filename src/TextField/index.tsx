import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core';
import { useField } from 'formik';
import React, { FunctionComponent } from 'react';

export interface TextFieldProps
  extends Omit<MuiTextFieldProps, 'error' | 'onChange' | 'onBlur' | 'value'> {
  name: string;
}

export const TextField: FunctionComponent<TextFieldProps> = ({
  name,
  helperText,
  ...fieldProps
}) => {
  const [field, meta] = useField(name);
  const formError = meta.touched && !!meta.error;

  return (
    <MuiTextField
      {...fieldProps}
      {...field}
      error={formError}
      helperText={formError ? meta.error : helperText}
    />
  );
};
