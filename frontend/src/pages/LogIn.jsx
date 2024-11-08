export default function LogIn() {
    return (
        <>
            <div className="container" id="login">
                <div className="row">
                    <div className="col">

                    </div>
                    <div className="col">
                        <form>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="logiEmail" aria-describedby="emailHelp" placeholder="alguien@tumail.com"/>
                                <label htmlFor="logiEmail">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="loginPassword" placeholder="Contraseña"/>
                                <label htmlFor="loginPassword">Contraseña</label>
                            </div>
                            <div className="form-floating mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="loginCheck"/>
                                    <label className="form-check-label" htmlFor="loginCheck">Recordarme</label>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
