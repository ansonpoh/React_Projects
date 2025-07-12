import Navbar from "./Navbar"
import { useRef,  } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    
    const {user, setUser, logout} = useUser()

    const user_id = user.user_id;
    const currentUsername = user.username
    const usernameRef = useRef();
    const currentPasswordRef = useRef();
    const newPasswordRef = useRef();
    const newPasswordRef2 = useRef();
    const navigate = useNavigate();


    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/change_username"
            , {user_id:user_id, username: usernameRef.current.value}
        ).then((res) => {
            if(res.data.status === true) {
                setUser(prev => ({...prev, username:usernameRef.current.value}))
                alert("Username changed successfully")
            } else {
                alert("Failed")
            }
            currentPasswordRef.current.value = ""
            newPasswordRef.current.value = ""
            newPasswordRef2.current.value = ""
            window.location.reload()
        }).catch(err => console.error(err))
    }

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if(newPasswordRef.current.value !== newPasswordRef2.current.value) {
            alert("New passwords do not match")
        } else {
            axios.post("http://localhost:3001/change_password"
                , {user_id: user_id, currentPassword: currentPasswordRef.current.value, newPassword: newPasswordRef2.current.value}
            ).then((res) => {
                if(res.data.status === false) {
                    alert("Current Password is incorrect");
                } else {
                    alert("Password changed successfully")
                }
            }).catch(err => console.error(err)) 
        }
        currentPasswordRef.current.value = ""
        newPasswordRef.current.value = ""
        newPasswordRef2.current.value = ""
        window.location.reload()
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    return (
        <>
            <Navbar />
            <div style={{padding: "2vh"}}>
                <form onSubmit={handleUsernameSubmit}>
                    <label>Change Username </label> <br/>
                    <input ref={usernameRef} type="text" placeholder={currentUsername}/>
                    <button type="submit" style={{marginLeft:'1vh'}}>Change</button>
                </form> 
            </div>

            <div style={{padding: "2vh"}}>
                <form onSubmit={handlePasswordSubmit}>
                    <label>Change Password</label> <br/>
                    <input ref={currentPasswordRef} type="password" placeholder="Enter Current Password"/> <br/>
                    <input ref={newPasswordRef} type="password" placeholder="Enter New Password" /> <br/>
                    <input ref={newPasswordRef2} type="password" placeholder="Enter New Password Again" />
                    <button type="submit" style={{marginLeft:"1vh"}}>Change</button>
                </form>
            </div>

            <div style={{padding: "2vh"}}>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </>
    )
    
}