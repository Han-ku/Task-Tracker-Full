import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    const handleInput = (e) => {
        setValues(prev => ({...prev, [e.target.name] : e.target.value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8081/', values)
        .then(res => {  
            if (res.data.Status === 'Success') {
                // Сохранение токена в localStorage
                localStorage.setItem('token', res.data.token);
                navigate('/home');
            } else {
                alert(res.data.Error);
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className='auth-form-container'>
            <p className='auth-form-title'>Login</p>
            <form onSubmit={handleSubmit}>
                <input onChange={handleInput} type="email" placeholder='Email' id='email' name='email'/>
                <input onChange={handleInput} type="password" placeholder='Password' id='password' name='password'/>
                <button type='submit'>Log In</button>
            </form>
            <Link to='/register' className='changePageBtn'>Don't have an account? Register here</Link>
        </div>
    )
}

export default Login