import React, { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthResponse, AuthResponseError } from "../types/types";
import "./Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [cedula, setCedula] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [errorResponse, setErrorResponse] = useState("");

  const auth = useAuth();
  const goTo = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(username, cedula, password, name, email, vehiclePlate);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("vehiclePlate", vehiclePlate);
    formData.append("cedula", cedula);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name, email, vehiclePlate }),
      });
      if (response.ok) {
        const json = (await response.json()) as AuthResponse;
        console.log(json);
        setUsername("");
        setPassword("");
        setName("");
        setCedula("");
        setEmail("");
        setVehiclePlate("");
        goTo("/");
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <DefaultLayout>
      <div className="signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h1>Registrarse</h1>
          {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
          <div className="form-row">
            <div className="form-column">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Ingrese su nombre"
              />
              <label htmlFor="cedula">Cedula</label>
              <input
                id="cedula"
                type="text"
                name="cedula"
                onChange={(e) => setCedula(e.target.value)}
                value={cedula}
                placeholder="Ingrese su cedula"
              />
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                placeholder="Ingrese su usuario"
              />
            </div>
            <div className="form-column">
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Ingrese su correo electrónico"
              />
              <label htmlFor="vehiclePlate">Placa Vehiculo</label>
              <input
                id="vehiclePlate"
                type="text"
                name="vehiclePlate"
                onChange={(e) => setVehiclePlate(e.target.value)}
                value={vehiclePlate}
                placeholder="Ingrese la placa de su vehículo"
              />
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Ingrese su contraseña"
              />
              <label htmlFor="photo">Foto de Usuario</label>
              <input
                id="photo"
                type="file"
                name="photo"
                onChange={handlePhotoChange}
              />
            </div>
          </div>
          <button type="submit">Crear Cuenta</button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default Signup;