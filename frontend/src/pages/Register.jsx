import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [values, setValues] = useState({
        fullName: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate()


    const handleInput = (e) => {
        setValues(prev => ({...prev, [e.target.name] : e.target.value}))
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8081/register', values)
        .then(res => {  
            if (res.status === 201) {  
                navigate('/home');
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className='auth-form-container'>
            <p className='auth-form-title'>Register</p>
            <form onSubmit={handleSubmit}>
                <input  onChange={handleInput} type="text" placeholder='Full Name' id='fullName' name='fullName'/>

                <input onChange={handleInput} type="email" placeholder='Email' id='email' name='email'/>

                <input onChange={handleInput} type="password" placeholder='Password' id='password' name='password'/>

                <button type='submit' id='register-btn'>Register</button>
            </form>

            <Link to='/' className='changePageBtn'>Already have an account? Login here</Link>
        </div>
    )
}

export default Register