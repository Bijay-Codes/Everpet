export function getCookie(name: string) {
    return document.cookie.split('; ').find(cname => cname.startsWith(name + '=')) ?? '';
}

export function getFromLocalStorage(name: string) {
    const rawData = localStorage.getItem(name);
    if (!rawData) return '';
    try {
        return JSON.parse(rawData);
    } catch {
        return '';
    }
}