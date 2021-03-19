import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { Formik, Form } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { Checkbox } from './Checkbox';

describe('<Checkbox />', () => {
  const promise = Promise.resolve();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitMock = jest.fn((_) => promise);
  let element: RenderResult;
  let checkbox: HTMLElement;
  let button: HTMLElement;

  describe('basic usage', () => {
    type FormValues = { employed: boolean };
    const initialValue: FormValues = { employed: false };

    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={initialValue}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <Checkbox name="employed" label="Employment Status" />
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

      checkbox = element.getByLabelText('Employment Status');
      button = element.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('it is unchecked visually', () => {
      expect(checkbox).not.toBeChecked();
    });

    test('form submission with initial state', async () => {
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(initialValue);
    });

    test('check the box and submit the form', async () => {
      act(() => {
        fireEvent.click(checkbox);
      });
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(checkbox).toBeChecked();
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({ employed: true });
    });

    test('check the box twice and submit the form', async () => {
      act(() => {
        fireEvent.click(checkbox);
      });
      act(() => {
        fireEvent.click(checkbox);
      });
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(checkbox).not.toBeChecked();
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(initialValue);
    });
  });

  describe('with validation', () => {
    let helperText: Element | null;
    const errorMessage = 'Must be selected.';
    const defaultHelpMessage = 'I am here to help';

    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={{ employed: false }}
          validationSchema={yup.object({
            employed: yup.boolean().oneOf([true], errorMessage),
          })}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <Checkbox
                name="employed"
                label="Employment Status"
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

      checkbox = element.getByLabelText('Employment Status');
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
          initialValues={{ employed: false }}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <Checkbox
                name="employed"
                label="Employment Status"
                formControlLabelProps={{ disabled: true }}
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

      checkbox = element.getByLabelText('Employment Status');
      button = element.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('FormControl is disabled', async () => {
      expect(checkbox).toBeDisabled();
      act(() => {
        fireEvent.click(button);
      });
      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledWith({ employed: false });
    });
  });
});
