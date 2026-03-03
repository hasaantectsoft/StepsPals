import * as Yup from 'yup';
const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'yahoo.co.in',
  'yahoo.co.uk',
  'outlook.com',
  "yopmail.com",
  'hotmail.com',
  'live.com',
  'icloud.com',
  'me.com',
  '724.one',
  'aol.com',
  'protonmail.com',
  'mail.com',
  'zoho.com',
  'yandex.com',
  'gmx.com',
  'inbox.com',
  'tutanota.com',
  "steppals.com"
];

export const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name should only contain alphabetic characters and spaces')
    .test('no-only-spaces', 'Full name cannot contain only spaces', function (value) {
      return value ? value.trim().length > 0 : false;
    }),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .test('email-domain', 'Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)', function (value) {
      if (!value) return false;
      const domain = value.split('@')[1]?.toLowerCase();
      return ALLOWED_EMAIL_DOMAINS.includes(domain);
    }),

  location: Yup.string()
    .nullable()
    .notRequired(),

  gender: Yup.string()
    .nullable()
    .notRequired()
    .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least 1 number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  termsAccepted: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});


export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});


export const EditProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters')
    .trim()
    .matches(/^[a-zA-Z\s]+$/, 'Full name should only contain letters and spaces')
    .test('no-only-spaces', 'Full name cannot contain only spaces', function (value) {
      return value ? value.trim().length > 0 : false;
    })
    .required('Full name is required'),
  phone: Yup.string()
    .matches(/^[+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .required('Phone number is required')
});


export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required')
    .test('email-domain', 'Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)', function (value) {
      if (!value) return false;
      const domain = value.split('@')[1]?.toLowerCase();
      return ALLOWED_EMAIL_DOMAINS.includes(domain);
    }),
});

export const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least 1 number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match')
});