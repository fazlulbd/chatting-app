import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, set, push, remove} from "firebase/database";
import { getAuth} from "firebase/auth";
const Friendrequest = () => {
  const auth = getAuth();
  const db = getDatabase();
  const [addfriend, setAddfriend] =useState([])
  useEffect(()=>{
    const userRef = ref(db, 'addfriend/');
    onValue(userRef, (snapshot) => {
      let array = []
      snapshot.forEach((item)=>{
        if (item.val().receiverid === auth.currentUser.uid) {
          array.push({ ...item.val(), id: item.key });
        }
      })
      setAddfriend(array)
    });
  },[])
  const handleAcceptFriendRequest = (item)=>{
    set(push(ref(db, "friends")), {
      id: item.id,
      sendername: item.sendername,
      senderid: item.senderid,
      receiverid: item.receiverid,
      receivername: item.receivername,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
    }).then(() => {
      remove(ref(db, "addfriend/" + item.id));
    });
  }
  return (
    <>
      <div className="shadow-sm shadow-black p-3 rounded mt-8 h-[427px] overflow-x-auto">
        <h3 className='font-numito font-semibold text-xl'>Friend Request</h3>
        {
          addfriend.map(item=>(
            <div className=" flex justify-between items-center border-b border-black pb-2.5 m-5">
                <img src="images/profileimg.png" alt=""  className='w-16 rounded'/>
              <div className="">
                <h3 className='font-numito font-semibold text-lg'>{item.sendername}</h3>
                <p className='font-numito font-semibold text-sm'>Be a MERN Warior</p>
              </div>
              <div className="">
                <button onClick={()=>handleAcceptFriendRequest(item)} className='font-numito font-semibold text-lg bg-primary text-white px-3 rounded'>Confirm</button>
              </div>
            </div>
          ))

        }
        

      </div>
    </>
  )
}

export default Friendrequest
