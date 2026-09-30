import { useEffect, useState } from "react";

export default function useOnline() {
    const [network, setNetwork] = useState<'online' | 'offline' | null>(window.navigator.onLine ? 'online' : 'offline');
    useEffect(() => {
        const handleOffline = () => {
            setNetwork('offline');
        };
        const handleOnline = () => {
            setNetwork('online');
        };
        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);
        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        }
    }, [])
    return network;
};