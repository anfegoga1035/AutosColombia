import { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { AuthResponse, AuthResponseError } from "../types/types";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");

  const auth = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const json = (await response.json()) as AuthResponse;
        console.log(json);

        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json);
        }
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <DefaultLayout>
      <div className="login-page">
        <div className="login-container">
          <div className="login-left">
            <div className="welcome-card">
              <h2>¡Bienvenido a Autos Colombia! 🚗</h2>
              <h3>Tu solución inteligente de estacionamiento</h3>
              <h4>Descubre la comodidad y seguridad que te ofrecemos:</h4>
              <ul>
                <li>✨ <b>Reservas en línea fáciles y rápidas</b> Olvídate de las largas esperas y garantiza tu espacio en segundos.</li>
                <li>🔄 <b>Sistemas de guía de estacionamiento</b> Encuentra tu lugar ideal con nuestra tecnología avanzada que te guía en tiempo real.</li>
                <li>💳 <b>Opciones de pago sin contacto</b> Paga de manera segura y sin complicaciones con nuestras opciones de pago modernas</li>
                <li>🛡️ <b>Seguridad 24/7</b> Tu vehículo siempre estará seguro con nuestra vigilancia continua y monitoreo de última generación.</li>
              </ul>
            </div>
          </div>
          <div className="login-right">
            <form onSubmit={handleSubmit} className="login-form">
              <h1>Ingresar</h1>
              {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                onChange={handleChange}
                value={username}
                placeholder="Ingrese su usuario"
              />
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                onChange={handleChange}
                value={password}
                placeholder="Ingrese su contraseña"
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
        <div className="pricing-plans">
          <h2>Precios y Planes</h2>
          <div className="pricing-cards">
            <div className="pricing-card">
              <h3>Plan Básico</h3>
              <p>$60.0000/mes</p>
              <ul>
                <li>5 horas de estacionamiento gratis al mes</li>
                <li>Acceso a zonas de estacionamiento generales</li>
                <li>Notificaciones por SMS sobre espacio disponible</li>
                <li>Asistencia básica 24/7</li>
              </ul>

            </div>
            <div className="pricing-card">
              <h3>Plan Premium</h3>
              <p>$100.0000/mes</p>
              <ul>
                <li>10 horas de estacionamiento gratis al mes</li>
                <li>Acceso a zonas de estacionamiento preferenciales</li>
                <li>Notificaciones por SMS y correo electrónico</li>
                <li>Asistencia prioritaria 24/7</li>
                <li>Descuento del 10% en tarifas adicionales</li>
                <li>Reservas anticipadas disponibles</li>
              </ul>
            </div>
            <div className="pricing-card">
              <h3>Plan VIP</h3>
              <p>$150.0000/mes</p>
              <ul>
                <li>Acceso a zonas de estacionamiento exclusivas</li>
                <li>Notificaciones personalizadas y en tiempo real</li>
                <li>Asistencia personalizada 24/7</li>
                <li>Descuento del 20% en tarifas adicionales</li>
                <li>Reservas anticipadas garantizadas</li>
                <li>Servicio de valet parking</li>
                <li>Lavado de autos mensual gratuito</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}