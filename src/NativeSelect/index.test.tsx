import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { NativeSelect, NativeSelectOption } from '.';

describe('<NativeSelect />', () => {
  const promise = Promise.resolve();
  const onSubmitMock = jest.fn((_) => promise);
  let element: RenderResult;
  let selectInput: HTMLElement;
  let button: HTMLElement;
  type FormValues = { fruit: string };
  const initialValue: FormValues = { fruit: 'apple' };
  const options: NativeSelectOption[] = [
    {
      label: 'Apple',
      value: 'apple',
    },
    {
      label: 'Orange',
      value: 'orange',
    },
    {
      label: 'Pear',
      value: 'pear',
    },
  ];

  describe('basic usage', () => {
    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={initialValue}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <NativeSelect
                name="fruit"
                label="Favourite Fruit"
                options={options}
              />
              <button type="button" onClick={submitForm}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      );

      act(() => {
        element = render(formik);
      });

      selectInput = element.getByLabelText('Favourite Fruit');
      button = element.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('form submission with initial state', async () => {
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(initialValue);
    });

    test('change selection and submit the form', async () => {
      act(() => {
        fireEvent.change(selectInput, { target: { value: 'pear' } });
      });
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({ fruit: 'pear' });
    });

    test('check the box twice and submit the form', async () => {
      act(() => {
        fireEvent.change(selectInput, { target: { value: 'pear' } });
      });
      act(() => {
        fireEvent.change(selectInput, { target: { value: 'orange' } });
      });
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(selectInput).not.toBeChecked();
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({ fruit: 'orange' });
    });
  });

  describe('with validation', () => {
    let helperText: Element | null;
    const errorMessage = 'Must be selected.';
    const defaultHelpMessage = 'I am here to help';

    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={{ fruit: '' }}
          validationSchema={yup.object({
            fruit: yup.string().required(errorMessage),
          })}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <NativeSelect
                name="fruit"
                label="Favourite Fruit"
                options={options}
                helperText={defaultHelpMessage}
              />
              <button type="button" onClick={submitForm}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      );

      act(() => {
        element = render(formik);
      });

      selectInput = element.getByLabelText('Favourite Fruit');
      helperText = element.getByText(defaultHelpMessage);
      button = element.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('No error state initially', () => {
      expect(helperText?.className).not.toContain('error');
    });

    test('submit form without checking the box', async () => {
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(0);
      expect(helperText).toContainHTML(errorMessage);
      expect(helperText?.className).toContain('error');
    });
  });

  describe('with disabled true for formControlProps', () => {
    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={initialValue}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <NativeSelect
                name="fruit"
                label="Favourite Fruit"
                options={options}
                formControlProps={{ disabled: true }}
              />
              <button type="button" onClick={submitForm}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      );

      act(() => {
        element = render(formik);
      });

      selectInput = element.getByLabelText('Favourite Fruit');
      button = element.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('FormControl is disabled', async () => {
      expect(selectInput).toBeDisabled();
      act(() => {
        fireEvent.click(button);
      });
      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledWith(initialValue);
    });
  });
});
