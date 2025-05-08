import { ValidationRule, Validator } from '../services/Validator';

// Define a type for each form field
export interface FormField {
  value: string;
  error: string;
  isValid: () => boolean;
}

// Define a type for all form fields
export type FormFields = {
  firstname: FormField;
  lastname: FormField;
  email: FormField;
  phone: FormField;
  password: FormField;
  birthDate: FormField;
};

// Function to create a new form field
const createField = (): FormField => ({
  value: '',
  error: '',
  isValid() {
    return this.error === '';
  },
});

// Create form fields separately
const formFields: FormFields = {
  firstname: createField(),
  lastname: createField(),
  email: createField(),
  phone: createField(),
  password: createField(),
  birthDate: createField(),
};

// Define validation rules separately
const rules: Record<keyof FormFields, ValidationRule[]> = {
  firstname: [Validator.required('firstname')],
  lastname: [Validator.required('lastname')],
  email: [Validator.required('email'), Validator.email],
  phone: [Validator.required('phone'), Validator.phone],
  password: [Validator.required('password'), Validator.password],
  birthDate: [Validator.required('birthDate')],
};

// Define utility methods separately
const RegisterForm = {
  fields: formFields, // Store fields separately to avoid type conflicts

  getFirstError(): string {
    for (const key in this.fields) {
      if (this.fields[key as keyof FormFields].error) {
        return this.fields[key as keyof FormFields].error;
      }
    }
    return 'Invalid form!';
  },

  getValue() {
    return {
      first_name: this.fields.firstname.value,
      last_name: this.fields.lastname.value,
      email: this.fields.email.value,
      contact: this.fields.phone.value,
      password: this.fields.password.value,
      dob: this.fields.birthDate.value,
    };
  },

  isValid(): boolean {
    return Object.values(this.fields).every(field => field.isValid());
  },

  validateAll() {
    Object.keys(this.fields).forEach(field => {
      this.validate(field as keyof FormFields, this.fields[field as keyof FormFields].value);
    });
  },

  validate(field: keyof FormFields, value: string) {
    const fieldObj = this.fields[field];
    if (!fieldObj) return;

    fieldObj.error = '';
    rules[field]?.forEach(rule => {
      if (!rule.validate(value)) {
        fieldObj.error = rule.message;
      }
    });

    fieldObj.value = value;
  },
};

export default RegisterForm;