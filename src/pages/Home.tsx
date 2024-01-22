import "../App.css";
import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react';

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
    }, [])

    return (
        <div>
            <h1>Home: Welcome {email}</h1>
            <Link to="/login">Login</Link>
            <Link to="/profile">Profile</Link>
        </div>
    )
}

export default Home