import "../App.css";
import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";

const Home: React.FC = () => {

    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetch(
            "http://localhost:3001/", {
            method: "get",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.authorized)
                if (data.authorized) {
                    setEmail(data.email);
                } else {
                    navigate('/login')
                }
            }).catch(err => console.log(err))
    }, [navigate])

    const handleLogout = async () => {
        await fetch(
            'http://localhost:3001/logout', {
            method: "post",
            credentials: 'include',
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            console.log("Logging Out")
            navigate('/login')
        }).catch(err => console.log(err))
    }

    return (
        <React.Fragment>
            <Navbar />
            <h1>Home: Welcome {email}</h1>
            <Link to="#" onClick={handleLogout}>Logout</Link>
        </React.Fragment>
    )
}

export default Home