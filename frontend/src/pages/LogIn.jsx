import { useState } from "react"

export default function LogIn() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = async(e) =>{
        e.preventDefault();
    }

    return (
        <>
            <div className="container" id="login">
                <div className="row">
                    <div className="col">
                        <img src="login-icon.png" alt="Library" />

                    </div>
                    <div className="col">
                        <form>
                            <h3 style={{color:'#fff'}}>Ingresar con tu cuenta:</h3>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="logiEmail" aria-describedby="emailHelp" placeholder="alguien@tumail.com"/>
                                <label htmlFor="logiEmail">E-mail</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="loginPassword" placeholder="Contraseña"/>
                                <label htmlFor="loginPassword">Contraseña</label>
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="loginCheck"/>
                                    <label className="form-check-label" htmlFor="loginCheck">Recordarme</label>
                            </div>
                            <button type="submit" className="btn btn-success m-1">Registrarse</button>
                            <button type="submit" className="btn btn-primary">Ingresar</button>
                            
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
