import { useActionState, useContext, useEffect, useReducer } from "react";
import { AuthContext, type AuthContextType } from "../context/auth-context";
import { useNavigate, NavLink } from "react-router-dom";
import Toast from "../components/toasts";
import login from "../API/fetch-login";
import usePasswordToggle from "../hooks/usePasswordToggle";
import Input from "../components/Input";
import { checkValidInputData, validatePassword, checkForErrors } from "../util/util";
/*

What it should do,
it should handle calling POST request to the backend server
the request it sends should have an valid csrf token attached to its header 
in authorization feild with the bearer carrying the csrf token value
currently it is being stored in localstorage which we need to get and attach

use an action state hook to track the isPending status / Not because it is the only way or it is the clean way
To learn it 


handle error states of input data being entered -
 can show error as they type or just show error when the input element leaves focus 
 /
 can track that using onBlur / onMouse leave for showing a more accurate ui state

 the login button should be disabled if an request is pending to avoid refetching same data

 the server being down / sleeping should be explicitly stated to make user know how much time the process can take

*/



function handleDispatch(prev: FormState, actions: Actions) {
    switch (actions.type) {
        case ('Update'):
            return {
                ...prev,
                inp: {
                    ...prev.inp,
                    [actions.feild]: actions.val ?? ''
                }
            };
        case ('Clear'):
            return initialFormState;
        case ('Validate'):
            switch (actions.feild) {
                case ('password'):
                    return {
                        ...prev,
                        err: { ...prev.err, password: validatePassword(prev.inp.password) ?? '' }
                    };

                case ('indentifier'):
                    return { ...prev, err: { ...prev.err, identifier: checkValidInputData(prev.inp.identifier) ?? '' } };
            };
    };
};

type Actions = {
    type: 'Update';
    feild: 'identifier' | 'password';
    val: string;
} | {
    type: 'Validate',
    feild: 'indentifier' | 'password'
} | {
    type: 'Clear'
};

interface FormState {
    inp: {
        identifier: string;
        password: string;
    },
    err: {
        identifier: string;
        password: string;
    }
};

const initialFormState = {
    inp: {
        identifier: '',
        password: ''
    },
    err: {
        identifier: '',
        password: ''
    }
};


export default function Login() {
    const [response, handleLogin, isPending] = useActionState(login, { isSuccess: null, data: {}, err: {} });
    const [form, dispatch] = useReducer(handleDispatch, initialFormState);

    const { toggle, type } = usePasswordToggle();

    const navTo = useNavigate();
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('Login must be used within an AuthContext provider');
    };
    const { setUser }: AuthContextType = authContext;
    useEffect(() => {
        if (response.isSuccess) {
            setUser(response.res.data);
            navTo('/dashboard');
        };
    }, [response, setUser, navTo]);

    return (
        <section className="relative">
            <span>{!isPending && !response.isSuccess && < Toast message={response.message} details={response.details ?? ''} status={response.code ?? ''} />}</span>
            <form action={handleLogin} className="flex flex-col gap-6 justify-center m-auto h-dvh
            p-4 text-white max-w-200">

                <Input
                    type='text'
                    name="Idnetifier"
                    label="Enter your email or user-name"
                    id="identifier-inp"
                    val={form.inp.identifier}
                    validationError={form.err.identifier}
                    onChange={(e) => dispatch({ type: 'Update', feild: 'identifier', val: e.target.value })}
                    onBlur={() => dispatch({ type: 'Validate', feild: 'indentifier' })}
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

                <div className="flex flex-col gap-4">
                    <div className="flex gap-6">
                        <button
                            type="reset" onClick={() => dispatch({ type: 'Clear' })} className="bg-status-danger py-2 px-6 rounded">
                            Clear
                        </button>
                        <button disabled={isPending || checkForErrors(form.err)}
                            className="bg-status-success py-2 px-6 rounded disabled:bg-gray-400 disabled:text-black">
                            {isPending ? 'Processing' : 'Login'}
                        </button>
                    </div>

                    <span>Dont have an account? <NavLink to='/register' className='text-highlight hover:bg-highlight hover:text-black py-1 px-2 rounded'>Register now!</NavLink></span>
                </div>
            </form>
        </section>
    );
};