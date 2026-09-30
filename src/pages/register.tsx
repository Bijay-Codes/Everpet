import { useActionState, useContext, useEffect, useReducer, type SetStateAction } from "react"
import type { ServerResponse } from "../types/auth-responses";
import { useNavigate, NavLink, type NavigateFunction } from "react-router-dom";
import { AuthContext, type UserData } from "../context/auth-context";
import Toast from "../components/toasts";
import register from "../API/fetch-register";
import usePasswordToggle from "../hooks/usePasswordToggle";
import { checkForErrors, validateEmail, validatePassword, validateUsername } from "../util/util";
import Input from "../components/input";

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
};



function handleResponse(response: ServerResponse, setUser: React.Dispatch<SetStateAction<UserData>>, navTo: NavigateFunction) {
    if (response.isSuccess) {
        setUser(response.data);
        navTo('/dashboard');
    };
};

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
            switch (action.feild) {
                case ('password'):
                    return {
                        ...prev, err:
                        {
                            ...prev.err,
                            password: validatePassword(prev.inp.password) ?? ''
                        }
                    };
                case ('username'):
                    return {
                        ...prev, err: { ...prev.err, username: validateUsername(prev.inp.username) ?? '' }
                    }
                case ('email'):
                    return {
                        ...prev, err: { ...prev.err, email: validateEmail(prev.inp.email) ?? '' }
                    }
                case ('reEnterPass'): {
                    const isSame = prev.inp.password === prev.inp.reEnterPass;
                    return { ...prev, err: { ...prev.err, reEnterPass: isSame ? '' : 'The passwords should match' } }
                }
            }
    }
    // return prev;
};
export default function Register() {
    const [response, handleRegister, isPending] = useActionState(register, { isSuccess: null });
    const [form, dispatch] = useReducer(handleDispatch, initialFormState);

    const { toggle, type } = usePasswordToggle();

    const user = useContext(AuthContext);
    if (!user) throw new Error('Auth context not setup / provided properly');
    const { setUser } = user;

    const navTo = useNavigate();

    useEffect(() => {
        handleResponse(response, setUser, navTo);
    }, [response, setUser, navTo]);

    // const inputs = 'bg-card-bg text-white p-4 rounded';

    return (
        <section className="h-dvh w-full m-auto text-white relative">
            <span>{!isPending && !response.isSuccess && < Toast message={response.message} details={response.details ?? ''} status={response.code ?? ''} />}</span>
            <form action={handleRegister} className="p-4 flex flex-col h-full justify-center gap-4 max-w-200 m-auto">
                <Input
                    type="text"
                    name="username"
                    label="Enter your username"
                    id="username-inp"
                    val={form.inp.username}
                    validationError={form.err.username}
                    onChange={(e) => dispatch({ type: 'Update', feild: 'username', val: e.target.value })}
                    onBlur={() => dispatch({ type: 'Validate', feild: 'username' })}
                />
                <Input
                    type="email"
                    name="email"
                    label="Enter your E-mail"
                    id="email-inp"
                    val={form.inp.email}
                    validationError={form.err.email}
                    onChange={(e) => dispatch({ type: 'Update', feild: 'email', val: e.target.value })}
                    onBlur={() => dispatch({ type: 'Validate', feild: 'email' })}
                />
                <Input
                    type={type}
                    name="password"
                    label="Enter your Password"
                    id="password-inp"
                    val={form.inp.password}
                    hasToggle
                    onToggle={toggle}
                    validationError={form.err.password}
                    onChange={(e) => dispatch({ type: 'Update', feild: 'password', val: e.target.value })}
                    onBlur={() => dispatch({ type: 'Validate', feild: 'password' })}
                />

                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex gap-6">
                        <button className="bg-status-danger rounded py-2 px-6" type="button"
                            onClick={() => dispatch({ type: 'Clear' })}>
                            Clear
                        </button>
                        <button className="bg-status-success rounded py-2 px-6 disabled:bg-gray-400 disabled:text-black"
                            disabled={isPending || checkForErrors(form.err)}>
                            {isPending ? 'Processing' : 'Register'}
                        </button>
                    </div>

                    <span>Already have an account?
                        <NavLink to='/login' className='text-highlight hover:bg-highlight hover:text-black py-1 px-2 rounded'>
                            Login instead
                        </NavLink>
                    </span>
                </div>
            </form>
        </section>
    );
};