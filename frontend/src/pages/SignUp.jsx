// frontend/src/pages/SignUp.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        id_rol: 1, // Por ejemplo, rol 1 para un usuario estándar
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || 'Error al registrar usuario');
            } else {
                alert('¡Usuario registrado con éxito!');
                navigate('/login'); // Redirigir al login
            }
        } catch (error) {
            setErrorMessage('Error al conectar con el servidor');
        }
    };

    return (
        <div className="container" id="signup">
            <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" required />
                <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Apellido" required />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required />
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Contraseña" required />
                <button type="submit">Registrar</button>
            </form>
            {errorMessage && <div>{errorMessage}</div>}
        </div>
    );
}
