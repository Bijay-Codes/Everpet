import { useState, useEffect } from "react";
import type { ErrorResponse } from "../types/auth-responses";

export default function Toast({ type, seconds = 4, errorResponse }: {
    type: 'success' | 'warn' | 'err' | 'info',
    seconds: number,
    errorResponse: ErrorResponse
}) {
    const [isVisible, setVisible] = useState(true);
    const { message, code, details } = errorResponse;
    useEffect(() => {
        setTimeout(() => {
            setVisible(false);
        }, (seconds * 1000));
    }, [seconds]);
    const styles = {
        err: 'bg-danger-color text-danger-fg',
        info: 'bg-blue-400 text-white',
        success: 'bg-success-color text-success-fg',
        warn: 'bg-warning-color text-warning-fg'
    };
    return (
        <section>
            {message && isVisible && <div className={`absolute top-0 right-0 min-h-20 min-w-40 p-2
                ${styles[type]}`}>
                <div className="flex gap-1 items-center">
                    <span className="text-2xl">
                        {type == 'err' ? 'Error'
                            : type == 'success' ? 'Success'
                                : type == 'info' ? 'Notice'
                                    : 'Warning'}</span>

                    {code && <span className="text-4xl font-extrabold">{code}</span>}
                </div>
                <h1>{message}</h1>
                {details && <h2>{details}</h2>}
            </div>
            }
        </section>
    );
};