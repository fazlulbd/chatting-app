import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {FallingLines } from 'react-loader-spinner'
import { getDatabase, ref, set } from "firebase/database";
const Registration = () => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [fullnameerror, setFullnameerror] = useState('')
  const [emailerror, setEmailerror] = useState('')
  const [passworderror, setPassworderror] = useState('')
  const [showpassword, setShowpassword] = useState(false)
  const [firebaseerror, setFirebaseerror] = useState('')
  const [success, setSuccess]= useState("")
  const [loading, setLoading] = useState(false)
  let emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  const handelFullname =(e)=>{
    setFullname(e.target.value)
    setFullnameerror('')
  }
  const handelEmail =(e)=>{
    setEmail(e.target.value)
    setEmailerror('')
    setFirebaseerror('')
  }
  const handelPassword =(e)=>{
    setPassword(e.target.value)
    setPassworderror('')
  }
  const handelSubmit = ()=>{
      if(!fullname){
        setFullnameerror("! Enter your names")
      }
      if(!email){
        setEmailerror("! Enter your email")
      }else{
        if(!emailValidation){
        setEmailerror("Enter your valide email")
        }
      }
      if(!password){
        setPassworderror("! Enter a password")
      }
      if( fullname && email && password && emailValidation){
        setLoading(true)
        createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          updateProfile(auth.currentUser, {
            displayName:fullname,
            photoURL: "images/profile.jpg"
          }).then(() => {
            sendEmailVerification(auth.currentUser)
            .then(() => {
              setLoading(false)
              setSuccess("plese  verify your email")
            }).then(()=>{
              set(ref(db, 'users/' + user.user.uid),{
                name: user.user.displayName,
                photoURL: user.user.photoURL,
                email: user.user.email,
              }).then(()=>{
                setTimeout(()=>{
                  // console.log('ami email verify')
                  navigate("/login");
                },3000)
              }).catch((error)=>{
                console.log(error);
              })
            })

          }).catch((error) => {
            console.log(error)
          });
          // console.log('ami registration')
          // console.log(user.user)
         
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if(errorCode.includes("auth/email-already-in-use")){
            setFirebaseerror("Email already in use")
            setLoading(false)
          }
        });

      }

  }
  const handelpasswordshow = ()=>{
    setShowpassword(!showpassword)
  }
  return (
    <>
      <div className="flex">
        <div className="w-1/2 flex flex-col items-end mr-[69px] justify-center">
            <div className="w-[520px]">
             <h2 className='font-nunito font-bold text-4xl'>Get started with easily register</h2>
             <p className='font-nunito font-bold text-xl text-emerald-800 mt-4'>Free register and you can enjoy it</p>
             {
                  success &&
                  <p className='font-numito font-semibold font-sm text-white bg-green-500  py-2 px-4 rounded'>{success}</p>
             }
             <div className="relative">
                <p className='font-numito font-semibold font-sm absolute top-[22px] left-8 bg-white px-2.5' >Full Name</p>
                <input type="text" onChange={handelFullname} className='border border-solid border-black w-full rounded-[10px] px-7 py-6 mt-9 '/>
                {
                  fullnameerror &&
                  <p className='font-numito font-semibold font-sm text-red-600'>{fullnameerror}</p>
                }
             </div>
             <div className="relative">
                <p className='font-numito font-semibold font-sm absolute top-[22px] left-8 bg-white px-2.5' >Email Addres</p>
                <input type="email" onChange={handelEmail} className='border border-solid border-black w-full rounded-[10px] px-7 py-6 mt-9 '/>
                {/* <p className='font-numito font-semibold font-sm text-red-600'>{emailerror}</p> */}
                {
                  emailerror &&
                  <p className='font-numito font-semibold font-sm text-red-600'>{emailerror}</p>
                }

             </div>
             <div className="relative">
                {
                  showpassword? <p className='absolute top-16 right-4 text-xl'><AiFillEye onClick={handelpasswordshow}/></p>
                  : <p className='absolute top-16 right-4 text-xl'><AiFillEyeInvisible onClick={handelpasswordshow}/></p>
                }
                
                <p className='font-numito font-semibold font-sm absolute top-[22px] left-8 bg-white px-2.5' >Password</p>
                <input type={showpassword? "text" : 'password'} onChange={handelPassword} className='border border-solid border-black w-full rounded-[10px] px-7 py-6 mt-9'/>
                {
                  passworderror &&
                  <p className='font-numito font-semibold font-sm text-red-600'>{passworderror}</p>
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
                : <button onClick={handelSubmit} className='w-full text-center bg-primary rounded-[86px] py-5  font-numito font-semibold text-xl text-white mt-12'>Sign up </button>
              }
              
              {
                firebaseerror &&
                <p className='font-numito font-semibold font-sm text-red-600'>{firebaseerror}</p>
              }
             <p className='font-nunito font-regular text-xs mt-9 w-full text-center'>Already have an account ? <Link to='/login' className='font-bold text-[#ea6c00]'>Sign In</Link></p>         
            </div>
        </div>
        <div className="w-1/2">
            <picture>
             <img className='h-screen w-full object-cover' src="images/registrationimg.webp" alt="" loading='lazy'/>
            </picture>
        </div>
      </div>
    </>
  )
}

export default Registration
