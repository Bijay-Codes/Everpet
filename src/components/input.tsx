type InputProps = {
    type: 'password' | 'text' | 'email';
    name: string;          // goes on the <input> so FormData picks it up
    label: string;
    id: string;
    val: string;
    validationError?: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    hasToggle?: boolean;
    onToggle?: () => void;
};

export default function Input({
    type, name, label, id, val, validationError,
    onChange, onBlur, hasToggle = false, onToggle,
}: InputProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id}>{label}</label>
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    id={id}
                    value={val}
                    onChange={onChange}
                    onBlur={onBlur}
                    required
                    placeholder={name}
                    className="bg-card-bg text-white px-4 py-2 rounded w-full"
                />
                {hasToggle && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {type === 'text' ? 'hide' : 'show'}
                    </button>
                )}
            </div>
            <span className="text-sm text-status-danger">{validationError}</span>
        </div>
    );
}