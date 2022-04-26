import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { NativeSelect, NativeSelectOption } from '.';

describe('<NativeSelect />', () => {
  const promise = Promise.resolve();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitMock = jest.fn((_) => promise);
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
  const user = userEvent.setup();

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

      render(formik);

      selectInput = screen.getByLabelText('Favourite Fruit');
      button = screen.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('form submission with initial state', async () => {
      await user.click(button);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith(initialValue);
      });
    });

    test('change selection and submit the form', async () => {
      fireEvent.change(selectInput, { target: { value: 'pear' } });
      await user.click(button);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({ fruit: 'pear' });
      });
    });

    test('check the box twice and submit the form', async () => {
      fireEvent.change(selectInput, { target: { value: 'pear' } });
      fireEvent.change(selectInput, { target: { value: 'orange' } });
      await user.click(button);

      await waitFor(() => {
        expect(selectInput).not.toBeChecked();
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({ fruit: 'orange' });
      });
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

      render(formik);

      selectInput = screen.getByLabelText('Favourite Fruit');
      helperText = screen.getByText(defaultHelpMessage);
      button = screen.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('No error state initially', () => {
      expect(helperText?.className).not.toContain('error');
    });

    test('submit form without checking the box', async () => {
      await user.click(button);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(0);
        expect(helperText).toContainHTML(errorMessage);
        expect(helperText?.className).toContain('error');
      });
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

      render(formik);

      selectInput = screen.getByLabelText('Favourite Fruit');
      button = screen.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('FormControl is disabled', async () => {
      expect(selectInput).toBeDisabled();
      await user.click(button);
      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith(initialValue);
      });
    });
  });
});
