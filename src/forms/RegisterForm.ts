import Utils from '../services/Util';
import {ValidationRule, Validator} from '../services/Validator';

const RegisterForm = {
  firstname: {
    value: '',
    error: '',
    isValid: () => {
      return RegisterForm.firstname.error === '';
    },
  },
  lastname: {
    value: '',
    error: '',
    isValid: () => {
      return RegisterForm.lastname.error === '';
    },
  },
  email: {
    value: '',
    error: '',
    isValid: () => {
      return RegisterForm.email.error === '';
    },
  },
  phone: {
    value: '',
    error: '',
    isValid: () => {
      return RegisterForm.phone.error === '';
    },
  },
  password: {
    value: '',
    error: '',
    isValid: () => {
      return RegisterForm.password.error === '';
    },
  },
  birthDate: {
    value: '',
    error: '',
    isValid: () => {
      return RegisterForm.birthDate.error === '';
    },
  },
  getFirstError: (): any => {
    let error: string = '';

    for (const key of Object.keys(RegisterForm)) {
      const field = RegisterForm[key as keyof typeof RegisterForm];
      if (typeof field === 'object' && field.error !== '') {
        error = field.error;
        break;
      }
    }

    return error != '' ? error : 'Invalid form!';
  },
  getValue: () => {
    return {
      first_name: RegisterForm.firstname.value,
      last_name: RegisterForm.lastname.value,
      email: RegisterForm.email.value,
      contact: RegisterForm.phone.value,
      password: RegisterForm.password.value,
      dob: RegisterForm.birthDate.value,
    }
  },
  isValid: () => {
    return (
      RegisterForm.firstname.error == '' &&
      RegisterForm.lastname.error == '' &&
      RegisterForm.email.error == '' &&
      RegisterForm.phone.error == '' &&
      RegisterForm.password.error == '' &&
      RegisterForm.birthDate.error == ''
    );
  },
  validateAll: () => {
    Object.keys(RegisterForm).every(key => {
      const field = RegisterForm[key as keyof typeof RegisterForm];
      if (typeof field !== 'function') {
        RegisterForm.validate(key, field.value);
      }
    });
  },
  rules: () => ({
    firstname: [Validator.required('firstname')],
    //lastname: [Validator.required('lastname')],
    email: [Validator.required('email'), Validator.email],
    phone: [Validator.required('phone'), Validator.phone],
    password: [Validator.required('password'), Validator.password],
    birthDate: [Validator.required('birthDate')],
  }),
  validate: (field: string, value: any) => {
    const rules =
      RegisterForm.rules()[
        field as keyof ReturnType<typeof RegisterForm.rules>
      ] || [];
    rules.forEach((rule: ValidationRule) => {
      if (!rule.validate(value)) {
        (RegisterForm[field as keyof typeof RegisterForm] as any).error =
          rule.message;
      } else {
        (RegisterForm[field as keyof typeof RegisterForm] as any).error = '';
      }
    });

    (RegisterForm[field as keyof typeof RegisterForm] as any).value = value;

    return RegisterForm[field as keyof typeof RegisterForm];
  },
};

export default RegisterForm;
