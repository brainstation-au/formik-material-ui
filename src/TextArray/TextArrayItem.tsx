import {
  FormControl,
  Input,
  InputProps,
} from '@mui/material';
import { useField } from 'formik';
import React, { FunctionComponent } from 'react';

export type TextInputProps = Omit<
    InputProps,
    | 'autoComplete'
    | 'autoFocus'
    | 'defaultValue'
    | 'endAdornment'
    | 'error'
    | 'fullWidth'
    | 'inputComponent'
    | 'inputRef'
    | 'onChange'
    | 'startAdornment'
    | 'value'
  >

export interface TextArrayItemProps extends TextInputProps {
  id?: string;
  index: number;
  name: string;
}

export const TextArrayItem: FunctionComponent<TextArrayItemProps> = ({
  id,
  index,
  name,
  ...inputProps
}) => {
  const [field, meta] = useField(`${name}[${index}]`);
  const inputId = `${id || name}-${index}`;
  const formError = meta.touched && !!meta.error;

  return (
    <FormControl error={formError} sx={{ flex: 1 }}>
      <Input id={inputId} {...inputProps} {...field} />
    </FormControl>
  );
};
