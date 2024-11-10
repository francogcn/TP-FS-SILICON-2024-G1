import { useState } from "react"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function LogIn() {
    //onSubmit --> atrapa los datos del formulario
    //onChange --> attrapa los datos del elemento donde lo tengo declarado
    //e --> objeto que nos devuelve el evento onChange
    //e.target.value --> valor del elemento que esta disparando el evento

    const confToast = {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
    }

    const navigate = useNavigate();

    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const isValidPassword = (password) => {
        return password.length >= 8 && /\d/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password);
    };

    const submitHandler = async (e) => {
        e.preventDefault();


        if (!isValidEmail(mail)) {
            toast.error('Por favor, ingresa un correo electrónico válido.', confToast);
            return;
        }

        if (!isValidPassword(pass)) {
            toast.error('La contraseña debe tener al menos 8 caracteres, al menos 1 dígito y al menos una mayúscula', confToast);
            return;
        }

        const usuario = {
            mail: mail,
            pass: pass
        };

        const parametros = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': sessionStorage.getItem('token')
            },
            body: JSON.stringify(usuario)
        }

        const url = "http://localhost:8080/api/security/login";

        try {
            const res = await fetch(url, parametros);
            const body = await res.json();

            if (res.ok) {
                sessionStorage.setItem('token', body.token);
                toast.success(`Bienvenido ${body.datos.nombre}`, confToast);
                console.log(body.datos);
                navigate("/");
            } else {
                toast.error(body.message, confToast);
            }
        } catch (error) {
            toast.error(error.message, confToast);

        }

    }


    return (
        <>
            <div className="container" id="login">
                <div className="row">
                    <div className="col-sm-6">
                        <img src="login-icon.png" alt="Library" className="img-fluid" />

                    </div>
                    <div className="col-sm-6">
                        <form onSubmit={submitHandler}>
                            <h3 style={{ color: '#fff' }}>Ingresar con tu cuenta:</h3>
                            <div className="form-floating mb-3">
                                <input type="email" 
                                className="form-control" 
                                id="logiEmail" 
                                aria-describedby="email" 
                                placeholder="alguien@tumail.com" 
                                autoComplete="username"
                                onChange={(e) => setMail(e.target.value)}
                                />
                                <label htmlFor="logiEmail">E-mail</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="loginPassword" 
                                    placeholder="Contraseña" 
                                    autoComplete='current-password'
                                    onChange={(e) => setPass(e.target.value)}
                                />
                                <label htmlFor="loginPassword">Contraseña</label>
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="loginCheck" />
                                <label className="form-check-label" htmlFor="loginCheck">Recordarme</label>
                            </div>
                            <button type="submit" className="btn btn-primary">Ingresar</button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
