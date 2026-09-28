import { useActionState, useContext, useEffect, useReducer, type SetStateAction } from "react"
import type { ServerResponse } from "../types/auth-responses";
import { useNavigate, NavLink, type NavigateFunction } from "react-router-dom";
import { AuthContext, type UserData } from "../context/auth-context";
import Toast from "../components/toasts";
import register from "../API/fetch-register";
import usePasswordToggle from "../hooks/usePasswordToggle";

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
            return prev;
    };
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

    const inputs = 'bg-card-bg text-white p-4 rounded';

    return (
        <section className="h-dvh w-full m-auto text-white relative">
            <span>{!isPending && !response.isSuccess && < Toast message={response.message} details={response.details ?? ''} status={response.code ?? ''} />}</span>
            <form action={handleRegister} className="p-4 flex flex-col h-full justify-center gap-4 max-w-200 m-auto">
                <label htmlFor="username-inp">Enter your user-name</label>
                <input type="text" name="username-inp" id="username-inp" required
                    className={inputs} placeholder="user-name" value={form.inp.username}
                    onChange={(e) =>
                        dispatch({
                            type: 'Update',
                            feild: 'username',
                            val: e.target.value
                        })} />

                <label htmlFor="email-inp">Enter your Email</label>
                <input type="email" name="email-inp" id="email-inp" required
                    className={inputs} placeholder="E-mail" value={form.inp.email}
                    onChange={(e) =>
                        dispatch({
                            type: 'Update',
                            feild: 'email',
                            val: e.target.value
                        })} />
                <label htmlFor="password-inp">Enter your password</label>
                <input type='password' name="password-inp" id="password-inp" required
                    className={inputs} placeholder="Password" value={form.inp.password}
                    onChange={(e) =>
                        dispatch({
                            type: 'Update',
                            feild: 'password',
                            val: e.target.value
                        })} />
                <label htmlFor="password-inp-2">Enter your password again</label>
                <input type={type} name="password-inp-2" id="password-inp-2" required
                    className={inputs} placeholder="Confirm-password" value={form.inp.reEnterPass}
                    onChange={(e) =>
                        dispatch({
                            type: 'Update',
                            feild: 'reEnterPass',
                            val: e.target.value
                        })} />
                <span onClick={toggle}>{type === 'text' ? 'hide' : 'show'}</span>
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex gap-6">
                        <button className="bg-status-danger rounded py-2 px-6" type="button"
                            onClick={() => dispatch({ type: 'Clear' })}>
                                Clear
                        </button>
                        <button className="bg-status-success rounded py-2 px-6">
                            {isPending ? 'Processing' : 'Register'}
                        </button>
                    </div>
                    <span>Already have an account? <NavLink to='/login' className='text-highlight hover:bg-highlight hover:text-black py-1 px-2 rounded'>Login instead</NavLink></span>
                </div>
            </form>
        </section>
    );
};