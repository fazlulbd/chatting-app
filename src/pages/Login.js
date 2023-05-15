import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FallingLines } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailerror, setEmailerror] = useState('')
  const [passworderror, setPassworderror] = useState('')
  const [showpassword, setShowpassword] = useState(false)
  const [emailpasswordError, setEmailpasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const [modal, setModal]= useState(false)
  const [passwordchange, setPasswordchange]= useState('')

  const handleEmail = (e)=>{
    setEmail(e.target.value)
    setEmailerror('')
    setEmailpasswordError('')
  }
  const handlePassword = (e)=>{
    setPassword(e.target.value)
    setPassworderror('')
    setEmailpasswordError('')
  }
  const handlePasswordChange = (e)=>{
    setPasswordchange(e.target.value)
  }

  const handleSubmit = ()=>{
    if(!email){
      setEmailerror("! Enter your email")
    }
    if(!password){
      setPassworderror("! Enter a password")
    }else{
      setLoading(true)
      signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        toast("login Successfull wait for redirect ");
        setLoading(false)
        // console.log(user)
        setTimeout(()=>{
          navigate("/");
        },3000)
      })
      .catch((error) => {
        setLoading(false)
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        if(errorCode.includes('auth/user-not-found')){
          setEmailpasswordError("plese currect your email")
        }
        if(errorCode.includes('auth/wrong-password')){
          setEmailpasswordError("plese currect your password")
        }
      });
    }
  }
  const handelforgotpassword = ()=>{
    sendPasswordResetEmail(auth, passwordchange)
      .then(() => {
        toast('please Check your Email')
        setTimeout(()=>{
          // console.log('tamk kjdkjf dfkdf')
          setModal(false)
        },3000)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
      });
  }

  const handelpasswordshow = ()=>{
    setShowpassword(!showpassword)
  }

  return (
    <>
        <div className="flex">
        <ToastContainer />
            <div className="w-1/2 flex flex-col items-end mr-[69px] justify-center">
                <div className="w-[520px]">
                <h2 className='font-nunito font-bold text-4xl'>Login to your account</h2>
                <p className='font-nunito font-bold text-xl text-emerald-800 mt-4'>Free register and you can enjoy it</p>
                <div className="relative">
                    <p className='font-numito font-semibold font-sm absolute top-[22px]  bg-white px-2.5' >Email Addres</p>
                    <input type="email" onChange={handleEmail} className='border-b border-solid border-black w-full px-3  py-6 mt-9 outline-0'/>
                    {
                    emailerror &&
                    <p className='font-numito font-semibold font-sm text-red-600'>{emailerror}</p>
                   }
                </div>
                <div className="relative">
                  { 
                    showpassword ?
                     <p className='absolute top-16 right-4 text-xl'>< AiFillEye onClick={handelpasswordshow}/></p>
                    : <p className='absolute top-16 right-4 text-xl'><AiFillEyeInvisible onClick={handelpasswordshow}/></p>
                  }
                     
                    <p className='font-numito font-semibold font-sm absolute top-[22px]  bg-white px-2.5' >Password</p>
                    <input type={showpassword?'text' :"password"} onChange={handlePassword} className='border-b border-solid border-black w-full px-3  py-6 mt-9 outline-0'/>
                   {
                    passworderror &&
                    <p className='font-numito font-semibold font-sm text-red-600'>{passworderror}</p>
                   }
                   {
                    emailpasswordError &&
                    <p className='font-numito font-semibold font-sm text-red-600'>{emailpasswordError}</p>
                   }
                </div>
                {
                loading?
                <div className="flex justify-center">
                <FallingLines
                  color="#5f35f5"
                  width="250"
                  visible={true}
                  ariaLabel='falling-lines-loading'
                />
                </div>
                : <button onClick={handleSubmit} className='w-full text-center bg-primary rounded-lg py-5  font-numito font-semibold text-xl text-white mt-12'>Login to Continue</button>
              }
                
                <p className='font-nunito font-regular text-xs mt-9 w-full text-center'>Don't have an account ? <Link to='/registration' className='font-bold text-[#ea6c00]'>Sign Up</Link></p> 
                <p className='font-nunito font-regular text-xs mt-9 w-full text-center'><button onClick={()=>setModal(!modal)} to='/forgetpassword' className='font-bold text-primary'>Forget password? </button></p>         
                </div>
            </div>
            <div className="w-1/2">
                <picture>
                <img className='h-screen w-full object-cover' src="images/registrationimg.webp" alt="" loading='lazy'/>
                </picture>
            </div>
            {/* forgetpassword */}
            {
              modal &&
              <div className="flex justify-center items-center h-screen w-full bg-primary fixed">
                <div className=" bg-white p-5 rounded border border-solid border-black">
                    <h1 className='text-5xl text-primary font-bold '>Forgot Password</h1>
                    <div className="relative">
                        <p className='font-numito font-semibold font-sm absolute top-[22px] left-8 bg-white px-2.5' >Email Addres</p>
                        <input  type="email"  onChange={handlePasswordChange} className='border border-solid border-black w-full rounded-[10px] px-7 py-6 mt-9 '/>                     
                    </div>
                    <button onClick={handelforgotpassword}  className=' text-center bg-primary rounded py-2 px-5  font-numito font-semibold text-sm text-white mt-5'>Change Password </button>
                    <button onClick={()=>setModal(!modal)}   className=' text-center bg-[#ea6c00] rounded py-2 px-5 ml-32  font-numito font-semibold text-sm text-white mt-5'>Cancel</button>
                </div>
              </div> 
             }
           {/* forgetpassword */}
      </div>
    </>
  )
}

export default Login
