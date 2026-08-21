import { useReducer } from "react";


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
    if (info.form.email.length > 255) {
        return {
            ...info,
            error: { ...info.error, email: 'The email must be within 255 characters' }
        };
    } else {
        return { ...info, error: { ...info.error, email: undefined } };
    }
}

function validatePassword(info: InitialState) {
    const regex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;
    if (info.form.password.length < 3) {
        return {
            ...info,
            error: { ...info.error, password: 'The password must be atleast 4 letters' }
        };
    } else if (info.form.password.length > 10) {
        return {
            ...info,
            error: { ...info.error, password: 'The password must be atleast 4 letters' }
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
    const errMsgStyles = 'text-xs text-rose-400';
    const post = () => {
        console.log(info)
        alert('We got your request, sit back and wait')
    }

    const handleReset = () => {
        reduce({ type: 'RESET' });
    }

    return (
        <section>
            <h1>Lets get you Started</h1>
            <h2>Register now</h2>

            <main>
                <form action={post} className="flex flex-col gap-4 p-4 max-w-1/2">
                    <label htmlFor="usr-name-input">Enter your name</label>
                    <input type="text" name="usr-name-input" id="usr-name-input"
                        placeholder="Username" value={info.form.username}
                        onChange={(e) => reduce({
                            type: 'CHANGE',
                            key: 'username',
                            value: e.target.value.trim()
                        })}
                        onBlur={() => reduce({ type: 'VALIDATE', key: 'username' })}
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
                        required />
                    {info.error.reEnterPassword && <span className={errMsgStyles}>{info.error.reEnterPassword}</span>}
                    <button type="submit">Register</button>
                    <button type="button" onClick={handleReset}>Clear</button>
                </form>
            </main>
        </section >
    )
}