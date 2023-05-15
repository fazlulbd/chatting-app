import React, { useEffect, useState } from 'react'
import Sidebar from '../component/Sidebar'
import Search from '../component/Search'
import Group from '../component/Group'
import Friendrequest from '../component/Friendrequest'
import Friendlist from '../component/Friendlist'
import Mygroup from '../component/Mygroup'
import Userlist from '../component/Userlist'
import Blockuser from '../component/Blockuser'
import { getAuth} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [verify, setVerify] = useState(false)
  useEffect(()=>{
    if(!auth.currentUser){
      navigate('/login')
    }else{
      // console.log(auth.currentUser.emailVerified)
      if(auth.currentUser.emailVerified){
        setVerify(true)
      }
    }
  },[])
 
  return (
    <>  
      {
        verify? 
        <div className="flex">
          <div className="max-w-[200]">
              <Sidebar active="home"/>
          </div>
          <div className="max-w-[550px] ml-10">
            <Search></Search>
            <Friendlist block='true'></Friendlist>
            <Friendrequest></Friendrequest>
          </div>
          <div className="max-w-[450] ml-10">
          <Userlist></Userlist>
          <Blockuser></Blockuser>
          </div>
        </div>
        :<h3 className='bg-primary rounded p-5 text-5xl font-nunito font-bold text-white text-center'> Please Varify Your Email</h3>

      }
      
    </>
  )
}

export default Home
