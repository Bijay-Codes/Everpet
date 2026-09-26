import { useActionState, useReducer } from "react"
import { END_POINTS } from "../API/api-endpoints"


const initialFormState = {
    inp: {
        username: '',
        email: '',
        password: '',
        reEnterPass: ''
    },
    err: {
        username: '',
        email: '',
        password: '',
        reEnterPass: ''
    }
};

type FormState = {
    inp: Record<keyof typeof initialFormState.inp, string>,
    err: Record<keyof typeof initialFormState.inp, string>
};

type Actions = {
    type: 'Update',
    feild: keyof typeof initialFormState.inp,
    val: string
} | {
    type: 'Validate',
    feild: keyof typeof initialFormState.inp;
} | {
    type: 'Clear';
}


async function register(_prev: FormState, form: FormData) {
    const registerResponse = await fetch(END_POINTS.register, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: form.get('username-inp'),
            email: form.get('email-inp'),
            password: form.get('password-inp')
        })
    })
    const parsed = await registerResponse.json();
    return parsed;
}

function handleDispatch(prev: FormState, action: Actions) {
    switch (action.type) {

        case ('Update'):
            return {
                ...prev,
                inp: { ...prev.inp, [action.feild]: action.val }
            };

        case ('Clear'):
            return initialFormState;

        case ('Validate'):
            return prev;
    };
};



export default function Register() {
    const [response, handleRegister, isPending] = useActionState(register, {});
    const [form, dispatch] = useReducer(handleDispatch, initialFormState)
    console.log(response, isPending, form, dispatch);
    const inputs = 'bg-card-bg text-white p-2';
    return (
        <section className="h-dvh max-w-200 m-auto text-white">
            <form action={handleRegister} className="p-4 flex flex-col h-full justify-center gap-6">
                <label htmlFor="username-inp">Enter your user-name</label>
                <input type="text" name="username-inp" id="username-inp" required
                    className={inputs} placeholder="user-name"
                    onChange={(e) =>
                        dispatch({
                            type: 'Update',
                            feild: 'username',
                            val: e.target.value
                        })} />

                <label htmlFor="email-inp">Enter your Email</label>
                <input type="email" name="email-inp" id="email-inp" required
                    className={inputs} placeholder="E-mail"
                    onChange={(e) =>
                        dispatch({
                            type: 'Update',
                            feild: 'email',
                            val: e.target.value
                        })} />

                <label htmlFor="password-inp">Create your password</label>
                <input type="password" name="password-inp" id="password-inp" required
                    className={inputs} placeholder="Password"
                    onChange={(e) =>
                        dispatch({
                            type: 'Update',
                            feild: 'password',
                            val: e.target.value
                        })} />

                <label htmlFor="password-inp-2">Enter your password again</label>
                <input type="password" name="password-inp-2" id="password-inp-2" required
                    className={inputs} placeholder="Confirm-password"
                    onChange={(e) =>
                        dispatch({
                            type: 'Update',
                            feild: 'reEnterPass',
                            val: e.target.value
                        })} />

                <div className="flex gap-4">
                    <button className="bg-status-danger rounded py-2 px-4" type="reset">Clear</button>
                    <button className="bg-status-success rounded py-2 px-4">{isPending ? 'Processing' : 'Register'}</button>
                </div>
            </form>
        </section>
    )
}