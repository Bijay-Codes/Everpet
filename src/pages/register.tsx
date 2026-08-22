import { useReducer, useState } from "react";
import { END_POINTS } from "../paths/api-endpoints";

const initialState: InitialState = {
    form: { username: '', email: '', password: '', reEnterPassword: '' },
    error: {}
};

type InitialState = {
    form: FormState;
    error: ErrorState;
}
type FormState = {
    username: string;
    email: string;
    password: string;
    reEnterPassword: string;
}
type ErrorState = {
    username?: string;
    email?: string;
    password?: string;
    reEnterPassword?: string;
}
type Actions =
    | { type: 'CHANGE', key: keyof InitialState['form'], value: string }
    | { type: 'VALIDATE', key: keyof InitialState['form'] }
    | { type: 'RESET' }


function reducer(info: InitialState, action: Actions): InitialState {
    switch (action.type) {
        case 'CHANGE':
            return { ...info, form: { ...info.form, [action.key]: action.value } };
        case 'VALIDATE':
            if (!info.form[action.key]) {
                return { ...info, error: { ...info.error, [action.key]: 'This feild cannot be left empty' } }
            }
            switch (action.key) {
                case 'username':
                    return validateUsername(info);
                case 'email':
                    return validateEmail(info);
                case 'password':
                    return validatePassword(info);
                case 'reEnterPassword':
                    return validateReEnterPassword(info);
                default:
                    return info;
            }

        case 'RESET':
            return { ...initialState };
        default:
            return info;
    }
}


function validateUsername(info: InitialState) {
    if (info.form.username.length < 3) {
        return {
            ...info,
            error: { ...info.error, username: 'The username be atleast 4 character long' }
        };
    } else if (info.form.username.length > 30) {
        return {
            ...info,
            error: { ...info.error, username: 'The username cannot be greater than 30 characters' }
        };
    } else {
        return { ...info, error: { ...info.error, username: undefined } };
    }
}

function validateEmail(info: InitialState) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (info.form.email.length > 255) {
        return {
            ...info,
            error: { ...info.error, email: 'The email must be within 255 characters' }
        };
    }
    else if ((!regexEmail.test(info.form.email)) || info.form.email.length < 5) {
        return {
            ...info,
            error: { ...info.error, email: 'Please enter a valid Email' }
        };
    }
    else {
        return { ...info, error: { ...info.error, email: undefined } };
    };
}

function validatePassword(info: InitialState) {
    const regex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;
    if (info.form.password.length < 3) {
        return {
            ...info,
            error: { ...info.error, password: 'The password must have atleast 4 characters' }
        };
    } else if (info.form.password.length > 20) {
        return {
            ...info,
            error: { ...info.error, password: 'The password must less than 20 characters' }
        };
    } else if (!regex.test(info.form.password)) {
        return {
            ...info,
            error: { ...info.error, password: 'The password must contain atleast 1 symbol' }
        };
    } else {
        return { ...info, error: { ...info.error, password: undefined } };
    }
}

function validateReEnterPassword(info: InitialState) {
    if (info.form.password !== info.form.reEnterPassword) {
        return {
            ...info,
            error: { ...info.error, reEnterPassword: 'The password in both fields must be same' }
        };
    } else {
        return { ...info, error: { ...info.error, reEnterPassword: undefined } };
    }
}
export default function Register() {
    const [info, reduce] = useReducer(reducer, initialState);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(Boolean);
    // ss = Shared styles- im too lazy to write same classes for things
    const ssInputs = 'p-2 focus:outline-none bg-slate-300 max-w-100';
    const ssButtons = 'w-fit px-2 py-1'
    const errMsgStyles = 'text-xs text-rose-400';
    const post = async () => {
        const hasError = Object.values(info.error).some(data => data !== undefined);
        console.log(hasError);
        if (hasError) {
            setError(true);
            return null;
        }
        try {
            const data = await fetch(END_POINTS.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: info.form.username,
                    email: info.form.email,
                    password: info.form.password
                })
            })
            if (data.ok) {
                const parsed = await data.json();
                setUserInfo(parsed);
                setError(false);
                console.log(parsed);
                localStorage.setItem('userinfo', JSON.stringify(parsed));
                alert('Done');
            }
        } catch (err) {
            alert('Failed noob')
            console.log(err)
            setError(true);
            return err;
        }
    }

    const handleReset = () => {
        reduce({ type: 'RESET' });
    }

    return (
        <section>
            <h1>Lets get you Started</h1>
            <h2>Register now</h2>
            <main>
                <form className="flex flex-col gap-4 p-4 max-w-200 m-auto" onSubmit={(e) => {
                    e.preventDefault()
                    post();
                }}>
                    {userInfo && <span>Welcome abroad new account created</span>}
                    {error && <span>Invalid data</span>}
                    <label htmlFor="usr-name-input">Enter your name</label>
                    <input type="text" name="usr-name-input" id="usr-name-input"
                        placeholder="Username" value={info.form.username}
                        onChange={(e) => reduce({
                            type: 'CHANGE',
                            key: 'username',
                            value: e.target.value.trim()
                        })}
                        onBlur={() => reduce({ type: 'VALIDATE', key: 'username' })}
                        className={ssInputs}
                        required />
                    {info.error.username && <span className={errMsgStyles}>{info.error.username}</span>}
                    <label htmlFor="email-input">Enter your email</label>
                    <input type='email' name="email-input" id="email-input"
                        onChange={(e) => reduce({
                            type: 'CHANGE',
                            key: 'email',
                            value: e.target.value.trim()
                        })}
                        placeholder="email" value={info.form.email}
                        onBlur={() => reduce({ type: 'VALIDATE', key: 'email' })}
                        className={ssInputs}
                        required />
                    {info.error.email && <span className={errMsgStyles}>{info.error.email}</span>}
                    <label htmlFor="password-input">Enter your password</label>
                    <input type="password" name="password-input" id="password-input"
                        onChange={(e) => reduce({
                            type: 'CHANGE',
                            key: 'password',
                            value: e.target.value.trim()
                        })}
                        placeholder="enter your password" value={info.form.password}
                        onBlur={() => reduce({ type: 'VALIDATE', key: 'password' })}
                        className={ssInputs}
                        required />
                    {info.error.password && <span className={errMsgStyles}>{info.error.password}</span>}
                    <label htmlFor="re-enter-password">Confirm password</label>
                    <input type="password" name="re-enter-password" id="re-enter-password"
                        onChange={(e) => reduce({
                            type: 'CHANGE',
                            key: 'reEnterPassword',
                            value: e.target.value.trim()
                        })}
                        placeholder="confirm your password" value={info.form.reEnterPassword}
                        onBlur={() => reduce({ type: 'VALIDATE', key: 'reEnterPassword' })}
                        className={ssInputs}
                        required />
                    {info.error.reEnterPassword && <span className={errMsgStyles}>{info.error.reEnterPassword}</span>}
                    <div className="flex gap-4">
                        <button type="button" onClick={handleReset} className={ssButtons}>Clear</button>
                        <button type="submit" className={ssButtons}>Register</button>
                    </div>
                </form>
            </main>
        </section >
    )
}