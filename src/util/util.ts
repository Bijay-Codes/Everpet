export function getCookie(name: string) {
    return document.cookie.split('; ').find(cname => cname.startsWith(name + '=')) ?? '';
}

export function getFromLocalStorage(name: string) {
    return localStorage.getItem(name);
}


export function validatePassword(password: string, confirmPassword?: string) {
    if (password.length < 8) return 'Password must be atleast 7 characters long';

}    