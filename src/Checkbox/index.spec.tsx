import { Formik } from 'formik';
import React from 'react';
import renderer from 'react-test-renderer';
import { Checkbox } from '.';

it('renders correctly', () => {
  type FormValues = { employed: boolean };
  const initialValue: FormValues = { employed: false };
  const promise = Promise.resolve();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitMock = jest.fn((_) => promise);
  const formik = (
    <Formik
      initialValues={initialValue}
      onSubmit={(values) => onSubmitMock(values)}
    >
      <form>
        <Checkbox name="employed" label="Employment Status" />
      </form>
    </Formik>
  );
  const tree = renderer.create(formik).toJSON();
  expect(tree).toMatchSnapshot();
});
