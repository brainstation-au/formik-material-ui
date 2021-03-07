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
import { TextField } from '.';

describe('<TextField />', () => {
  const promise = Promise.resolve();
  const onSubmitMock = jest.fn((_) => promise);
  let element: RenderResult;
  let textField: HTMLElement;
  let button: HTMLElement;

  describe('basic usage', () => {
    type FormValues = { name: string };
    const initialValue: FormValues = { name: '' };

    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={initialValue}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <TextField
                name="name"
                label="Full Name"
                id="full-name"
                helperText="I am here to help"
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

      textField = element.getByLabelText('Full Name');
      button = element.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('text field renders input with type text', () => {
      expect(textField.getAttribute('type')).toBe('text');
      expect(textField.getAttribute('value')).toEqual('');
    });

    test('text field renders helper text', () => {
      expect(element.getByText('I am here to help')).toBeTruthy();
    });

    test('takes input and Fomik picks it up', async () => {
      act(() => {
        fireEvent.change(textField, { target: { value: 'Wasim Akram' } });
      });
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({ name: 'Wasim Akram' });
    });
  });

  describe('field validation', () => {
    type FormValues = { name: string };
    const initialValue: FormValues = { name: '' };

    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={initialValue}
          validationSchema={yup.object({
            name: yup.string().required('Required'),
          })}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <TextField name="name" label="Full Name" id="full-name" />
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

      textField = element.getByLabelText('Full Name');
      button = element.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('formik is controlling validation state', async () => {
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(0);
      expect(element.getByText('Required')).toBeTruthy();
    });
  });
});
