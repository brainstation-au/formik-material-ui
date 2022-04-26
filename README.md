# formik-material-ui

This project extends [Material-UI](https://material-ui.com/) form field components and integrates [formik](https://formik.org/) with each of them.

Each of the components in this package uses [useField hook from formik](https://formik.org/docs/api/useField), so they must be used within a [formik context](https://formik.org/docs/api/formik).

## Dependencies

```json
{
  "@mui/icons-material": ">= 5",
  "@mui/material": ">= 5",
  "formik": ">= 2",
  "react": ">= 17",
  "react-dom": ">= 17"
}
```

Note: At the point I'm writing this, [Formik has a type deprecated by React 18](https://github.com/jaredpalmer/formik/issues/3546).

## Version-1 Changelog

- The `DatePicker` component has been taken off, as there are lot of breaking changes going on from Material UI side.
- No breaking change in any other component.

## Demo

Please find demos [here](https://formik-material-ui.brainstation.com.au/).

## TextField

**Base API:** [TextField](https://material-ui.com/api/text-field/)

**Props:** All props from [TextField](https://material-ui.com/api/text-field/#props)

**Excluded props:** `error`, `onChange`, `onBlur`, `value`
_(formik populates these props in actual Material-UI TextField component. Even if you provide any, they will get overriden by the formik ones.)_

**Required props:** `name` _(to bind with formik context)_

**Example:**

```typescript
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
