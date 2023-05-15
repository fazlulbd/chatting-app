import React from 'react'

const Forgetpassword = () => {
  return (
    <>
      <div className="flex justify-center items-center h-screen w-full bg-primary">
        <div className=" bg-white p-5 rounded border border-solid border-black">
            <h1 className='text-5xl text-primary font-bold '>Forgot Password</h1>
            <div className="relative">
                <p className='font-numito font-semibold font-sm absolute top-[22px] left-8 bg-white px-2.5' >Email Addres</p>
                <input type="email"  className='border border-solid border-black w-full rounded-[10px] px-7 py-6 mt-9 '/>
                {/* <p className='font-numito font-semibold font-sm text-red-600'>{emailerror}</p> */}

             </div>
            <button  className='w-full text-center bg-primary rounded-[86px] py-5  font-numito font-semibold text-xl text-white mt-5'>Sign up </button>
        </div>
      </div>
    </>
  )
}

export default Forgetpassword
