import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, set, push} from "firebase/database";
import { getAuth} from "firebase/auth";
const Userlist = () => {
  const auth = getAuth();
  const db = getDatabase();
  const [userlist, setUserlist] = useState([])
  const [friend, setFriend] = useState([])
  const [friendlist, setFriendlist] = useState([])
 
  useEffect(()=>{
    const userRef = ref(db, 'users/');
    onValue(userRef, (snapshot) => {
      let array = []
      snapshot.forEach((item)=>{
        if(item.key !== auth.currentUser.uid){
          array.push({...item.val(), id:item.key})
          // console.log(item.val())
        }
      })
      setUserlist(array)
    });
  },[])
  
  const handleAddfriend = (item)=>{
    set(push(ref(db, "addfriend")), {
      sendername: auth.currentUser.displayName,
      senderid: auth.currentUser.uid,
      receiverid: item.id,
      receivername: item.name,
     
    });
  }
  useEffect(() => {
    const friendRef = ref(db, "addfriend/");
    onValue(friendRef, (snapshot) => {
      let friendArray = [];
      snapshot.forEach((item) => {
        // console.log("asdasd ddfgfgfgf");
        friendArray.push(item.val().receiverid + item.val().senderid);
      });
      setFriend(friendArray);
    });
  }, []);
  useEffect(() => {
    // let friendRequestArr2 = []
    const friendRef = ref(db, "friends");
    onValue(friendRef, (snapshot) => {
      let friendArray = [];
      snapshot.forEach((item) => {
        friendArray.push(item.val().receiverid + item.val().senderid);
      });
      setFriendlist(friendArray);
    });
  }, []);
  
  return (
    <>
    <div className="shadow-sm shadow-black p-3 rounded mt-8 h-[495px] overflow-x-auto mr-10">
      <h3 className='font-numito font-semibold text-xl'>User list</h3>
      {
        userlist.map(item=>(
          <div className=" flex justify-between items-center border-b border-black pb-2.5 m-5">
          <img src={item.photoURL} alt=""  className='w-16 h-16 rounded-full'/>
         <div className="">
          <h3 className='font-numito font-semibold text-lg'>{item.name}</h3>
          <p className='font-numito font-semibold text-sm'>{item.email}</p>
         </div>
         <div className="">
          {
            friendlist.includes(item.id+auth.currentUser.uid) || friendlist.includes(auth.currentUser.uid.id)
            ?
            <button  className='font-numito font-semibold text-lg bg-primary text-white px-2 ml-5 rounded'>Friend</button>
            :
              friend.includes(item.id+auth.currentUser.uid) || friend.includes(auth.currentUser.uid.id)
              ?
              <button  className='font-numito font-semibold text-lg bg-primary text-white px-2 ml-5 rounded'>request pending</button>
              :
              <button onClick={()=>handleAddfriend(item)} className='font-numito font-semibold text-lg bg-primary text-white px-2 ml-5 rounded'>Add Friend</button>
          }
          
          
         </div>
      </div>
        ))
      }
      
    </div>
  </>
  )
}

export default Userlist
