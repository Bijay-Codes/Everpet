import { useReducer } from "react"
import { END_POINTS } from "../API/api-endpoints";

export default function Register() {
    const [values, dispatch] = useReducer(handleInputDispatch, formValues);
    const inputs = 'bg-slate-300 px-4 py-2 text-black';

    async function handleSubmit(values: FormState) {
        const vals = Object.values(values.inp);
        const errors = Object.values(values.err);
        const hasErrors = errors.some(err => err);
        const hasIncompleteData = vals.some(vals => !vals);
        if (hasErrors || hasIncompleteData) return values.err;


        const res = await fetch(END_POINTS.register, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: values.inp.username,
                email: values.inp.email,
                password: values.inp.password
            })
        }).then(res => res.json());
        console.log(res)
    }
    return (
        <section className="m-auto h-dvh grid grid-cols-2 items-center max-w-300 bg-slate-900">
            <form
                action={() => {
                    handleSubmit(values)
                }
                }
                className="flex flex-col gap-4 text-white">

                <label htmlFor="name">Enter your user name</label>
                <input type="text" id="username" placeholder="user name"
                    className={inputs}
                    onChange={(e) => dispatch({
                        type: 'CHANGE',
                        key: 'username',
                        val: e.target.value
                    })}
                    onBlur={() => dispatch({ type: 'VALIDATE', key: 'username' })}
                    value={values.inp.username}
                />

                <label htmlFor="email">Enter your email</label>
                <input type="text" placeholder="Email"
                    className={inputs}
                    onChange={(e) => dispatch({
                        type: 'CHANGE',
                        key: 'email',
                        val: e.target.value
                    })}
                    onBlur={() => dispatch({ type: 'VALIDATE', key: 'email' })}
                    value={values.inp.email}
                />

                <label htmlFor="password">Enter your Password</label>
                <input type="password" id="password" placeholder="your password"
                    className={inputs}
                    onChange={(e) => dispatch({
                        type: 'CHANGE',
                        key: 'password',
                        val: e.target.value
                    })}
                    onBlur={() => dispatch({ type: 'VALIDATE', key: 'password' })}
                    value={values.inp.password}
                />

                <label htmlFor="re-enter-password">Re-enter your password</label>
                <input type="password" placeholder="re-enter your password to be sure"
                    className={inputs}
                    onChange={(e) => dispatch({
                        type: 'CHANGE',
                        key: 'reEnterPassword',
                        val: e.target.value
                    })}
                    onBlur={() => dispatch({ type: 'VALIDATE', key: 'password' })}
                    value={values.inp.reEnterPassword}
                />

                <div className="flex gap-4">
                    <button
                        className="bg-emerald-300 py-2 px-8 rounded text-emerald-900">
                        Register
                    </button>
                    <button type="button"
                        onClick={() => dispatch({ type: 'CLEAR' })}
                        className="bg-rose-300 py-2 px-8 rounded text-rose-900">
                        Clear
                    </button>
                </div>
            </form>
        </section>
    )
}

const formValues: FormState = {
    inp: {
        username: '',
        email: '',
        password: '',
        reEnterPassword: ''
    },
    err: {
        username: '',
        email: '',
        password: '',
        reEnterPassword: ''
    }
}
function handleInputDispatch(prev: FormState, action: Action) {
    switch (action.type) {
        case ('CHANGE'):
            return {
                ...prev,
                inp: {
                    ...prev.inp,
                    [action.key!]: action.val ?? ''
                }
            }
        case ('VALIDATE'):
            return {
                ...prev,
                err: {
                    ...prev.err,
                    [action.key!]: validator(prev, action)
                }
            }
        case ('CLEAR'):
            return formValues
    }
}

function validator(prev: FormState, action: Action) {
    switch (action.key) {
        case ('email'):
            return validateEmail(prev.inp.email);
    }
}

function validateEmail(val: string | null) {
    if (isFinite(Number(val))) return 'Email must be a string';
    if (!val) return 'Enter an valid email';
    let trimmed: string;
    try {
        trimmed = val.trim().toLowerCase();
        if (!trimmed) return 'Enter an valid email';
        if (trimmed.length > 255) return 'The length of the email cannot be higher than 255';
    } catch {
        if (typeof val !== 'string') return 'The value must be a string'
    }
    return ''
}


type FormInput = {
    username: string | '',
    email: string | '',
    password: string | '',
    reEnterPassword: string | ''
}

type FormState = {
    inp: FormInput,
    err: Record<keyof FormInput, string>
}

type Action = {
    type: 'VALIDATE' | 'CHANGE' | 'CLEAR',
    key?: keyof FormState['err'],
    val?: string
}
