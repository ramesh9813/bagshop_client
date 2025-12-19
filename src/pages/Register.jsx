import React from 'react'
import { Formik, Form, Field,ErrorMessage } from 'formik'
import * as Yup from 'yup'
const Register = () => {
  return (
    <Formik 
    initialValues={{
        fname:'',
        lname:'',
        email:'',
        password:'',
        cpassword:''
    }}
    validationSchema={Yup.object({
        fname:Yup.string()
        .required('First name is mandatory')
        .max(15,'First name must be less than 15 characters')
        .min(3,'at least 3 character'),
        
        lname:Yup.string()
        .required('Last name is mandatory')
        .max(15,'Last name must be less than 15 characters')
        .min(3,'at least 3 character'),

        email:Yup.string()
        .email('Invalid email address')
        .required('Email adress is required'),

        password:Yup.string()
        .required('Password is required')
        .matches(/^ (?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#?&!]).{8,40}$/,'password must have lowercase, uppercase,number, charcter and at least 8 charcter'),
        
        cpassword:Yup.string()
        .required('Password conformation is mandatory')
        .oneOf([Yup.ref('password')],'pasword must match with the one')
    })}
    >
        <div className="container">
            <div className="row d-flex justify-content-center mt-3">
                <div className="col-md-5">
                    <Form>
                        <div className="mb-3">
                            <label htmlFor="fname"> First Name</label>
                            <Field type="text" name="fname" id='fname' className="form-control"></Field>
                            <ErrorMessage name="fname">
                                    {msg=><div style={{color:'red'}}>{msg}</div>}
                            </ErrorMessage>
                           <div/>
                           
                           <div className="mb-3">
                            <label htmlFor="lname"> Last Name</label>
                            <Field type="text" name="lname" id='lname' className="form-control"></Field>
                            <ErrorMessage name="lname">
                                    {msg=><div style={{color:'red'}}>{msg}</div>}
                            </ErrorMessage>
                           </div>
                        
                        <div className="mb-3">
                            <label htmlFor="email"> Email</label>
                            <Field type="text" name="email" id='email' className="form-control"></Field>
                            <ErrorMessage name="email">
                                    {msg=><div style={{color:'red'}}>{msg}</div>}
                            </ErrorMessage>
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password"> Password</label>
                            <Field type="password" name="password" id="password" className="form-control"></Field>
                            <ErrorMessage name="password">
                                    {msg=><div style={{color:'red'}}>{msg}</div>}
                            </ErrorMessage>
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="cpassword">Conform Password</label>
                            <Field type="cpassword" name="cpassword" id="cpassword" className="form-control"></Field>
                            <ErrorMessage name="cpassword">
                                    {msg=><div style={{color:'red'}}>{msg}</div>}
                            </ErrorMessage>
                        </div>
                        <div className="mb-3">
                            <button className='btn btn-warning'>Register </button>
                        </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    
    </Formik>
  )
}

export default Register