// validationSchema.js
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required('username is required'),
  password: yup
    .string()
    .min(1, 'Password must be at least 8 characters long')
    .required('Password is required'),
});

export default validationSchema;
