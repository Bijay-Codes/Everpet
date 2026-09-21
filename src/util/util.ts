export function getCookie(name: string) {
    return document.cookie.split('; ').find(cname => cname.startsWith(name + '=')) ?? '';
}

export function getFromLocalStorage(name: string) {
    return localStorage.getItem(name);
}