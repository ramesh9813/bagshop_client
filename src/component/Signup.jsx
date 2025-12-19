import React from 'react'

const Signup = () => {
  return (
    <>
    <div className="container signup">
        <form>
        {/* <img class="mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57"/> */}
        <h1 class="h3 mb-3 fw-normal">Sign Up</h1>

        <div class="form-floating mb-2">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" />
        <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating mb-2">
        <input type="text" class="form-control" id="floatingInput" placeholder="full name" />
        <label for="floatingInput">Full name</label>
        </div>
        <div class="form-floating mb-2">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" />
        <label for="floatingPassword">Password</label>
        </div>
        <div class="form-floating mb-2" >
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" />
        <label for="floatingPassword"> Conform Password</label>
        </div>

        <div class="form-check text-start my-3">
        <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault"/>
        <label class="form-check-label" for="flexCheckDefault">
            Remember me
        </label>
        </div>
        <button class="btn btn-warning w-100 py-2" type="submit">Sign in</button>
        <p class="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
    </form>
    </div>
    </>
  )
}

export default Signup