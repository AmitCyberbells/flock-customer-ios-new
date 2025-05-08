import Utils from "./Utils";

export interface ValidationRule {
    validate: (value: any) => boolean;
    message: string;
}

const Validator = {
    required: (field: string): ValidationRule => ({
        validate: (value: any) => value !== null && value !== undefined && value !== '',
        message: `This ${field} is required.`
    }),
    email: {
        validate: (value: any) => Utils.isEmail(value),
        message: 'Please enter a valid email address.'
    },
    minLength: (min: number, field: string): ValidationRule => ({
        validate: (value: any) => value.length >= min,
        message: `This ${field} must be at least ${min} characters long.`
    }),
    maxLength: (max: number, field: string): ValidationRule => ({
        validate: (value: any) => value.length <= max,
        message: `This ${field} must be no more than ${max} characters long.`
    }),
    password: {
        validate: (value: any) => Utils.isPassword(value),
        message: 'Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.'
    },
    phone: {
        validate: (value: any) => Utils.isPhone(value),
        message: 'Please enter a 10 digit phone number.'
    },
};

export { Validator };
