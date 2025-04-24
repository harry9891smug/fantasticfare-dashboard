'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from "../context/AuthContext";
import CssLoader from "../dashboard/components/cssloader";
import JsLoader from "../dashboard/components/jsloader";
import { useState } from "react";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
      
        try {
          const res = await fetch("https://backend.fantasticfare.com/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
      
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Login failed");
      
          // Pass both token and user data to the login function
          login(data.token, data.user);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

  return (
    <html lang="en">
    <head>
      <CssLoader />
    </head>
    <body>
    <div className="container-fluid p-0">
      <div className="row m-0">
        <div className="col-12 p-0">
          <div className="login-card">
            <div>
              <div>
                <Link className="logo" href="/">
                  <Image 
                    className="img-fluid for-light"
                    src="/assets/images/logo/logo.png" 
                    alt="loginpage"
                    width={100}
                    height={50}
                  />
                  <Image
                    className="img-fluid for-dark"
                    src="/assets/images/logo/logo-white.png"
                    alt="loginpage"
                    width={100}
                    height={50}
                  />
                </Link>
              </div>
              <div className="login-main">
                <form className="theme-form" onSubmit={handleLogin}>
                  <h4>Sign in to account</h4>
                  <p>Enter your email & password to login</p>
                  
                  <div className="form-group">
                    <label className="col-form-label form-label-title">Email Address</label>
                    <input 
                      className="form-control" 
                      type="email" 
                      name="email"
                      value={email} onChange={(e) => setEmail(e.target.value)} required
                      placeholder="Test@gmail.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="col-form-label form-label-title">Password</label>
                    <div className="form-input position-relative">
                      <input 
                        className="form-control" 
                        type="password" 
                        name="password" 
                        value={password} onChange={(e) => setPassword(e.target.value)} 
                        placeholder="*********"
                      />
                      <div className="show-hide"><span className="show"></span></div>
                    </div>
                  </div>
                  
                  <div className="form-group mb-0">
                    <div className="checkbox p-0">
                      <input id="checkbox1" type="checkbox" />
                      <label className="text-muted" htmlFor="checkbox1">Remember password</label>
                    </div>
                    <Link className="link" href="/forgot-password">Forgot password?</Link>
                    <div className="text-end mt-3">
                      <button className="btn btn-primary btn-block w-100" type="submit">
                        Sign in
                      </button>
                    </div>
                  </div>
                  
                  {/* <h6 className="text-muted mt-4 or">Or Sign in with</h6>
                  <div className="social mt-4">
                    <div className="btn-showcase">
                      <button 
                        type="button" 
                        className="btn btn-light"
                        onClick={() => signIn('linkedin')}
                      >
                        <i className="txt-linkedin" data-feather="linkedin"></i> LinkedIn
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-light"
                        onClick={() => signIn('twitter')}
                      >
                        <i className="txt-twitter" data-feather="twitter"></i> Twitter
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-light"
                        onClick={() => signIn('facebook')}
                      >
                        <i className="txt-fb" data-feather="facebook"></i> Facebook
                      </button>
                    </div>
                  </div> */}
                  
                  {/* <p className="mt-4 mb-0 text-center">
                    Don't have account?
                    <Link className="ms-2" href="/sign-up">
                      Create Account
                    </Link>
                  </p> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <JsLoader />
    </body>
  </html>
  );
}