import { useState } from "react";

export default function usePasswordToggle() {
    const [type, setType] = useState<'text' | 'password'>('password');

    return {
        toggle() {
            setType(prev => prev === 'text' ? 'password' : 'text');
        },
        type: type
    }
}