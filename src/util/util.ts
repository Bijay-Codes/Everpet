export function getCookie(name: string) {
    return document.cookie.split('; ').find(cname => cname.startsWith(name + '=')) ?? '';
};

export function getFromLocalStorage(name: string) {
    return localStorage.getItem(name);
};


export function validatePassword(password: string) {
    if (!password)
        return 'Enter an valid password using atleaset 1 upper-case letter, 1 lowercase letter and an special character (-#@!$ etc)';

    const trimmed = password.trim();
    if (!trimmed)
        return 'Enter an valid password using atleaset 1 upper-case letter, 1 lowercase letter and an special character (-#@!$ etc)';

    const lengthRegex = /^.{8,64}/;
    if (!lengthRegex.test(trimmed)) {
        if (trimmed.length < 8) {
            return 'Password must contain atleast 8 characters';
        } else {
            return 'Password must not exeed the character limit (64)';
        };
    };

    const hasUpperCaseRegex = /[A-Z]/;
    if (!hasUpperCaseRegex.test(trimmed))
        return 'Password must contain an upper-case letter';
    const hasLowerCaseRegex = /[a-z]/;
    if (!hasLowerCaseRegex.test(trimmed))
        return 'Password must contain an lower-case letter';
    const hasNumberRegex = /[1-9]/;
    if (!hasNumberRegex.test(trimmed))
        return 'Password must contain a number';
    return null;
};

export function validateUsername(username: string) {
    if (username.length >= 30) {
        return 'Username must be less than 30 characters';
    };
    return null;
};

export function validateEmail(email: string) {
    if (!email)
        return 'Invalid email provided';
    const trimmed = email.trim();
    if (!trimmed)
        return 'Invalid email provided';
    if (trimmed.length >= 255)
        return 'Email must be less than 255 characters';
    const emailRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed))
        return 'Enter an valid email';
    return null;
};

export function checkValidInputData(data: string) {
    if (!data)
        return 'Enter valid data';
    const trimmed = data.trim();
    if (!trimmed)
        return 'Enter valid data';
    return null;
}

export function checkForErrors(errors: Record<string, string | ''>) {
    const errorValueArr = Object.values(errors);
    return errorValueArr.some(vals => vals)
}
