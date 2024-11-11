// utils/validaciones.js

// Validar email
export const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  
  // Validar contraseña
  export const isValidPassword = (password) => {
    return password.length >= 8 && /\d/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password);
  };
  
  // Validar nombre (solo letras)
  export const isValidName = (name) => {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(name); // Acepta letras y acentos
  };
  
  // Validar apellido (solo letras)
  export const isValidSurname = (surname) => {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(surname); // Acepta letras y acentos
  };
  