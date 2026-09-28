export function getCookie(name: string) {
    return document.cookie.split('; ').find(cname => cname.startsWith(name + '=')) ?? '';
}

export function getFromLocalStorage(name: string) {
    return localStorage.getItem(name);
}


export function validatePassword(password: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    return passwordRegex.test(password);
}    