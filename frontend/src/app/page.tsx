'use client';

import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {doLogin} from "../Web3Services";


function Login() {
  
  const router = useRouter();
  useEffect(() => {
    const account = localStorage.getItem("account");
    const isAdmin = localStorage.getItem("isAdmin");

    if (account && isAdmin !== null) {
   
        if (isAdmin === "true") {
            router.push("/admin");
        } else {
            router.push("/game");
        }
    }
}, [router]);
  const [message, setMessage] = useState("");


  function onBtnClick() {
    setMessage("Logging in... wait... ");
    doLogin()
        .then(result => {
            alert(JSON.stringify(result));

            if (localStorage.getItem("isAdmin") === "true") {
                router.push("/admin");
            } else {
                router.push("/game");
            }
        })
        .catch(err => setMessage(err.message));
}
  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      {/* Menu no topo */}
      <header className="p-3 bg-dark">
        <div className="container d-flex justify-content-between align-items-center">
          <h3 className="mb-0">JO-KEN-PO! dApp</h3>
          <nav className="nav nav-masthead">
            <a
              className="nav-link fw-bold px-2 text-white active"
              aria-current="page"
              href="#"
            >
              Home
            </a>
            <a className="nav-link fw-bold px-2 text-white" href="#">
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Main centralizado verticalmente */}
      <main className="d-flex flex-grow-1 align-items-center justify-content-center text-center">
        <div>
          <h1>Login and Play with us!</h1>
          <p className="lead">
            Play Rock-Paper-Scissors and earn Prizes.
          </p>
          <p className="lead">
            <a
              href="#"
              onClick={() => onBtnClick()}
              className="btn btn-lg btn-light fw-bold border-white bg-white"
            >
              <img
                src="/assets/MetaMask_Fox.svg.png" // Corrigido o caminho da imagem
                alt="MetaMask Logo"
                width={48}
              />
              Login with MetaMask
            </a>
          </p>
          {message}
        </div>
      </main>

      {/* Rodapé no final */}
      <footer className="text-white-50 text-center p-3">
        <p>
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/victor-silva-073b60267/"
            className="text-white"
          >
            Victor Silva
          </a>
          , available at{" "}
          <a href="https://github.com/victoradauto1" className="text-white">
            @victoradauto1
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default Login;
