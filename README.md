# formik-material-ui

This project extends [Material-UI](https://material-ui.com/) form field components and integrates [formik](https://formik.org/) with each of them.

Each of the components in this package uses [useField hook from formik](https://formik.org/docs/api/useField), so they must be used within a [formik context](https://formik.org/docs/api/formik).

## Dependencies

```json
{
  "@material-ui/core": ">= 4",
  "formik": ">= 2",
  "react": ">= 16.8",
  "react-dom": ">= 16.8"
}
```

## TextField

**Base API:** [TextField](https://material-ui.com/api/text-field/)

**Props:** All props from [TextField](https://material-ui.com/api/text-field/#props)

**Excluded props:** `error`, `onChange`, `onBlur`, `value`
*(formik populates these props in actual Material-UI TextField component. Even if you provide any, they will get overriden by the formik ones.)*

**Required props:** `name` *(to bind with formik context)*

**Example:**

```js
import { Form, Formik } from 'formik';
import { TextField } from '@brainstationau/formik-material-ui';
...
<Formik
  initialValues={{ name: '' }}
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
...
```
