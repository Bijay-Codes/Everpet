import { END_POINTS } from "../API/api-endpoints";
import { useActionState, useContext, useEffect, useReducer, useState } from "react";
import { AuthContext, type AuthContextType } from "../context/auth-context";

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


async function login(_prev: FormState, formInfo: FormData) {
    try {
        const loginResponse = await fetch(END_POINTS.login, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier: formInfo.get('identifier-inp'),
                password: formInfo.get('password-inp')
            })
        });
        if (loginResponse.ok) {
            return await loginResponse.json();
        } else {
            try {
                const parsed = await loginResponse.json();
                return parsed.resObj.err;
            } catch {
                return { isSuccess: false, err: { message: 'Something went wrong. Try again.' } };
            }
        };
    } catch {
        return { isSuccess: false, err: { message: 'Something went wrong, try again.' } };
    };
};

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

        default: return prev;
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
}

interface FormState {
    inp: {
        identifier: string;
        password: string;
    },
    err: {
        identifier: string;
        password: string;
    }
}

const initialFormState = {
    inp: {
        identifier: '',
        password: ''
    },
    err: {
        identifier: '',
        password: ''
    }
}

export default function Login() {
    const [response, handleLogin, isPending] = useActionState(login, { isSuccess: null, data: {}, err: {} });
    const [form, dispatch] = useReducer(handleDispatch, initialFormState);

    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('Login must be used within an AuthContext provider');
    }
    const { setUser }: AuthContextType = authContext;
    useEffect(() => {
        if (response.isSuccess) {
            setUser(response.res.data);
        };
    }, [response, setUser]);
    return (
        <section className="relative">
            <span>{!isPending && !response.isSuccess && < Toast message={response.message} details={response.details ?? ''} status={response.code ?? ''} />}</span>
            <form action={handleLogin} className="flex flex-col gap-6 justify-center m-auto
            h-dvh
            p-4 text-white max-w-200">
                <div className="flex flex-col gap-2">
                    <label htmlFor="identifier-login">Identifier - enter your email or username</label>
                    <input type="text" name="identifier-inp" placeholder="username / email"
                        className="p-2 rounded bg-card-bg"
                        value={form.inp.identifier}
                        onChange={(e) =>
                            dispatch({
                                type: 'Update',
                                feild: 'identifier',
                                val: e.target.value
                            })} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="identifier-login">Enter your Password</label>
                    <input type="password" placeholder="password" name='password-inp'
                        className="p-2 rounded bg-card-bg" value={form.inp.password}
                        onChange={(e) => dispatch({
                            type: 'Update',
                            feild: 'password',
                            val: e.target.value
                        })} />
                </div>

                <div className="flex gap-6">
                    <button
                        type="reset" onClick={() => dispatch({ type: 'Clear' })} className="bg-status-danger py-2 px-6 rounded">
                        Clear
                    </button>
                    <button disabled={isPending}
                        className="bg-status-success py-2 px-6 rounded">
                        {isPending ? 'Processing' : 'Login'}
                    </button>
                </div>
            </form>
        </section>
    );
};


function Toast({ message, details, status }: { message: string, details?: string, status?: number | '' }) {
    const [isVisible, setVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setVisible(false);
        }, 3000);
    }, []);

    return (
        <section>
            {message && isVisible && <div className="absolute top-0 right-0 bg-status-danger min-h-20 min-w-40 p-2">
                <span>Error</span>
                {status && <span>{status}</span>}
                <h1>{message}</h1>
                {details && <h2>{details}</h2>}
            </div>
            }
        </section>
    );
};