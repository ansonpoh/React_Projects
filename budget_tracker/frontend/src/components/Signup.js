import axios from "axios"
import {useRef } from 'react';
import {useNavigate, } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Signup() {
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const emailRef = useRef(null);
    const nav = useNavigate()
    const {setUser} = useUser()

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {username: usernameRef.current.value, email: emailRef.current.value, password: passwordRef.current.value}
        axios.post("http://localhost:3001/signup", formData)
            .then((res) => {
                const errors = res.data.errors
                const success = res.data.success
                const id = res.data.id;
                if(success) {
                    setUser({username: usernameRef.current.value, user_id:id})
                    nav("/home");
                } else {
                    alert(errors)
                    window.location.reload()
                }
            })
            .catch(err => console.log(err));
        
    }

    return (
        <>
        <div style={{paddingLeft: 30}}>
            <h2>Register</h2>
        </div>

        <div style={{paddingLeft: 10}}>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input ref={usernameRef} autoComplete="off" required/>
                </div>

                <div>
                    <label style={{paddingLeft: 5}}>Password: </label>
                    <input type="password" ref={passwordRef} autoComplete="off" required/>
                </div>

                <div>
                    <label style={{paddingLeft: 33}}>Email: </label>
                    <input type="email" ref={emailRef} autoComplete="off" required/>
                </div>

                <button type="submit" style={{marginRight: 10}}>
                    Submit
                </button>

                <a href="http://localhost:3000/login">Login</a>
            </form>
        </div>
        </>

    )

}