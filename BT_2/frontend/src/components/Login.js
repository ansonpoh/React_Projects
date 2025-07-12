import axios from "axios"
import {useRef, } from 'react';
import {useNavigate, } from "react-router-dom"
import { useUser } from "../context/UserContext";

export default function Login() {
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const nav = useNavigate();
    const {setUser} = useUser();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {username: usernameRef.current.value, password: passwordRef.current.value}
        axios.post("http://localhost:3001/login", formData)
            .then((res) => {
                const errors = res.data.errors
                const success = res.data.success
                const user_id = res.data.user_id
                if(success) {
                    setUser({username: usernameRef.current.value, user_id: user_id})
                    const date = new Date();
                    const month = date.getMonth();
                    localStorage.setItem("selectedMonth", month)
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
            <h2>Login</h2>
        </div>

        <div style={{paddingLeft: 10}}>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input ref={usernameRef} autoComplete="off"/>
                </div>

                <div>
                    <label style={{paddingLeft: 5}}>Password: </label>
                    <input type="password" ref={passwordRef} autoComplete="off"/>
                </div>

                <button type="submit" style={{marginRight: 10}}>
                    Submit
                </button>

                <a href="http://localhost:3000">Register</a>
            </form>
        </div>
        </>
    )

}