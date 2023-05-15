import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, set, push, remove} from "firebase/database";
import { getAuth} from "firebase/auth";
const Blockuser = () => {
  const auth = getAuth();
  const db = getDatabase();
  const [blockfriend, setBlockFriend] = useState([])
  useEffect(()=>{
    const userRef = ref(db, 'blockusers/');
    onValue(userRef, (snapshot) => {
      let array = []
      snapshot.forEach((item) => {
        if (item.val().blockbyid === auth.currentUser.uid) {
          array.push({
            id: item.key,
            block: item.val().block,
            blockid: item.val().blockid,
          });
        } else {
          array.push({
            id: item.key,
            block: item.val().blockby,
            blockbyid: item.val().blockbyid,
          });
        }
      });
      setBlockFriend(array)
    })
  },[])
  
  const handleUnblock = (item)=>{
    set(push(ref(db, "friends")), {
      sendername: item.block,
      senderid: item.blockid,
      receiverid: auth.currentUser.uid,
      receivername: auth.currentUser.displayName,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
    }).then(() => {
      remove(ref(db, "blockusers/" + item.id));
    });
  }
  return (
    <>
    <div className="shadow-sm shadow-black p-3 rounded mt-8 h-[427px] overflow-x-auto mr-10">
      <h3 className='font-numito font-semibold text-xl'>Blocked user</h3>
      {
        blockfriend.map(item=>(
          <div className=" flex justify-between items-center border-b border-black pb-2.5 m-5">
              <img src="images/profileimg.png" alt=""  className='w-16 rounded'/>
            <div className="">
              <h3 className='font-numito font-semibold text-lg'>{item.block}</h3>
              <p className='font-numito font-semibold text-sm'>Be a MERN Warior</p>
            </div>
            <div className="">
              {
                !item.blockbyid && ( 
                  <button onClick={()=>handleUnblock(item)} className='font-numito font-semibold text-lg bg-primary text-white px-3 rounded'>UnBlock</button>
                )
              }
             
            </div>
          </div>
        ))
      }
      
    </div>
  </>
  )
}

export default Blockuser
