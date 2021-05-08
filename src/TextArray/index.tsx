import {
  Box,
  FormControl,
  FormControlProps,
  FormHelperText,
  IconButton,
  InputLabel
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { useField } from 'formik';
import React, { FunctionComponent } from 'react';
import { Array, String } from 'runtypes';
import { TextArrayItem, TextInputProps } from './TextArrayItem';

export interface TextArrayProps
  extends Omit<FormControlProps, 'children' | 'error' | 'variant'> {
  helperText?: string;
  id?: string;
  inputProps?: TextInputProps;
  label: string;
  max?: number;
  name: string;
}

export const TextArray: FunctionComponent<TextArrayProps> = ({
  helperText,
  id,
  inputProps,
  label,
  max,
  name,
  ...formControlProps
}) => {
  const [{ value }, meta, helper] = useField<string[]>(name);
  const formError = meta.touched && !!meta.error;
  const errorMessage = Array(String).guard(meta.error)
    ? meta.error.join(', ')
    : meta.error;

  const handleAddItem = () => {
    helper.setValue(value.concat(['']));
  };

  const handleRemoveItem = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    helper.setValue(newValue);
  };

  return (
    <FormControl {...formControlProps} error={formError}>
      <InputLabel shrink={!!value.length}>{label}</InputLabel>
      {value.map((_, index) => (
        <Box display="flex" key={`${name}-${index}`} my={2}>
          <TextArrayItem name={name} index={index} id={id} {...inputProps} />
          <IconButton
            color="secondary"
            size="small"
            aria-label="delete"
            onClick={() => handleRemoveItem(index)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      {(!max || max > value.length) && (
        <Box my={2} textAlign="right">
          <IconButton size="small" aria-label="add" onClick={handleAddItem}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      <FormHelperText>{formError ? errorMessage : helperText}</FormHelperText>
    </FormControl>
  );
};
