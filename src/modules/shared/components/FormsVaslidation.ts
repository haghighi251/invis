const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(?:\.[a-zA-Z0-9-]{2,})+$/;

const hasNumbersRegexp = /^.*\d+.*$/;

const withIsString = (fn: (password: string) => boolean) => (password?: string) => {
    if (typeof password === 'string') {
        return fn(password);
    }

    return false;
};

export const hasMinLengthOf3 = withIsString((value: string) => value.length >= 3);

export const hasMaxLengthOf13 = withIsString((value: string) => value.length >= 8 && value.length <= 13);

export const hasMinLengthOf14 = withIsString((value: string) => value.length >= 14);

export const hasNumbers = withIsString(hasNumbersRegexp.test.bind(hasNumbersRegexp));

const hasSpecialCharsRegexp = /^.*[^A-Za-z0-9\söüäÖÜÄßẞ]+.*$/;

export const hasSpecialChars = withIsString(hasSpecialCharsRegexp.test.bind(hasSpecialCharsRegexp));

const hasLowerAndUppercaseLettersRegexp = /^(?=.*[a-zöüäß])(?=.*[A-ZÖÜÄẞ]).*$/;

export const hasLowerAndUppercaseLetters = withIsString(hasLowerAndUppercaseLettersRegexp.test.bind(hasLowerAndUppercaseLettersRegexp));

export const isNotEmpty = (value?: string) => {
    if (typeof value !== 'string') return false;

    return value.trim().length > 0;
};

export const isInputValid = (validationRegex: RegExp, value?: string) => {
    if (typeof value !== 'string') return false;

    return validationRegex.test(value);
};

export const isValidEmailAddress = (value?: string) => {
    if (typeof value !== 'string') return false;

    return EMAIL_REGEX.test(value);
};