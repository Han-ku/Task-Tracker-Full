import React from 'react'
import {Link} from 'react-router-dom'
const Page404 = () => {
  return (
    <div className='page404'>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        
        <Link to='/' className='changePageBtn'>Return to login page</Link>
    </div>
  )
}

export default Page404