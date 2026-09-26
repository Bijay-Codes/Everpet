import { useState, useEffect } from "react";
export default function Toast({ message, details, status }: { message: string, details?: string, status?: number | '' }) {
    const [isVisible, setVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setVisible(false);
        }, 3000);
    }, []);

    return (
        <section>
            {message && isVisible && <div className="absolute top-0 right-0 bg-status-danger min-h-20 min-w-40 p-2">
                <div className="flex gap-1 items-center">
                    <span className="text-2xl font-extrabold">Error</span>
                    {status && <span className="text-4xl text-highlight">{status}</span>}
                </div>
                <h1>{message}</h1>
                {details && <h2>{details}</h2>}
            </div>
            }
        </section>
    );
};