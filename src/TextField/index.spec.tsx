import {
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { TextField } from '.';

describe('<TextField />', () => {
  const promise = Promise.resolve();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitMock = jest.fn((_) => promise);
  const user = userEvent.setup();

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

      render(formik);
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('text field renders input with type text', () => {
      const textField = screen.getByLabelText('Full Name');
      expect(textField.getAttribute('type')).toBe('text');
      expect(textField).toHaveValue('');
    });

    test('text field renders helper text', () => {
      expect(screen.getByText('I am here to help')).toBeTruthy();
    });

    test('takes input and Fomik picks it up', async () => {
      await user.type(screen.getByLabelText(/full name/i), 'Wasim Akram');
      await user.click(screen.getByRole('button', {name: /submit/i}));
      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({ name: 'Wasim Akram' });
      });
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
              <TextField name="name" label="Full Name" id="full-name" required />
              <button type="button" onClick={submitForm}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      );

      render(<div>
        <div className="foo">bar</div>
        {formik}
      </div>);
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('formik prevents submission on validation error', async () => {
      await user.click(screen.getByRole('button', {name: /submit/i}));
      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(0);
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
    });

    test('formik updates field states on validation', async () => {
      await user.click(screen.getByLabelText(/full name/i));
      await user.click(screen.getByText(/bar/i));
      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
    });
  });
});
