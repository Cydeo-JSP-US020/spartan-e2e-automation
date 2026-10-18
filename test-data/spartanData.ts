export type SpartanGender = 'Male' | 'Female';

export interface SpartanModel {
  id?: number;
  name: string;
  gender: SpartanGender;
  phone: string;
}

export type SpartanPartialUpdateDTO = Partial<Omit<SpartanModel, 'id'>>;

export interface SpartanSearchParams {
  nameContains?: string;
  gender?: SpartanGender | string;
}

/**
 * Standard backend response envelope returned by all Spartan JSON endpoints.
 */
export interface ResponseWrapper<T> {
  message: string;
  totalElement?: number;
  data: T;
}

/**
 * Validation exception details for individual field failures.
 */
export interface ValidationExceptionWrapper {
  errorField: string;
  rejectedValue?: unknown;
  reason: string;
}

/**
 * Error envelope returned for 400 Bad Request, 404 Not Found, and 500 Internal Server Error.
 */
export interface ExceptionWrapper {
  message: string;
  httpStatus: string;
  localDateTime: string;
  errorCount?: number;
  validationExceptions?: ValidationExceptionWrapper[];
}

export const ValidationMessages = {
  NAME_REQUIRED: 'The name is required.',
  GENDER_REQUIRED: "The gender is required, and can only have 'Male' or 'Female' values.",
  PHONE_REQUIRED: 'The phone number is required.',
  PHONE_FORMAT: 'The phone number should be 10 to 13 characters long, and can only include digits.',
} as const;

export const ApiMessages = {
  HELLO_WORLD: 'Hello World!',
  RETRIEVED_ALL: 'Successfully retrieved all the Spartans.',
  RETRIEVED_SINGLE: 'Successfully retrieved the Spartan.',
  CREATED: 'Successfully created the Spartan.',
  UPDATED: 'Successfully updated the Spartan.',
  DELETED: 'Successfully deleted the Spartan.',
  QUERIED_ALL: 'Successfully queried all the Spartans.',
  NOT_FOUND: 'Spartan with the given ID number could not be found.',
  INVALID_INPUT: 'Invalid Input(s)',
} as const;

export const DefaultSpartanData = {
  validSpartanMale: {
    name: 'Leonidas',
    gender: 'Male' as SpartanGender,
    phone: '1234567890',
  },
  validSpartanFemale: {
    name: 'Gorgo',
    gender: 'Female' as SpartanGender,
    phone: '9876543210',
  },
};

