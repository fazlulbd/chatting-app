import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, set, push, remove} from "firebase/database";
import { getAuth} from "firebase/auth";
import { RiMessage2Fill } from 'react-icons/ri';
import { useDispatch } from "react-redux";
import {activeChat} from "../slices/activeChat"
const Friendlist = (props) => {
  const auth = getAuth();
  const db = getDatabase();
  const dispatch = useDispatch();
  const [friend, setFriend] = useState([])

  useEffect(()=>{
   
    const userRef = ref(db, 'friends/');
    onValue(userRef, (snapshot) => {
      let array = []
      snapshot.forEach((item)=>{
        if (
          auth.currentUser.uid === item.val().receiverid ||
          auth.currentUser.uid === item.val().senderid
        ) {
          array.push({ ...item.val(), key: item.key });
        }
      })
      let userinfo = {};
      if (array[0].receiverid === auth.currentUser.uid) {
        userinfo.status = "single";
        userinfo.id = array[0].senderid;
        userinfo.name = array[0].sendername;
      } else {
        userinfo.status = "single";
        userinfo.id = array[0].receiverid;
        userinfo.name = array[0].receivername;
      }
      dispatch(activeChat(userinfo));
      console.log(array)
      setFriend(array)
    })
  },[])

  const handleBlock = (item)=>{
    // console.log(item)
    auth.currentUser.uid === item.senderid
      ? set(push(ref(db, "blockusers")), {
          block: item.receivername,
          blockid: item.receiverid,
          blockby: item.sendername,
          blockbyid: item.senderid,
        }).then(() => {
          remove(ref(db, "friends/" + item.key));
        })
      : set(push(ref(db, "blockusers")), {
          block: item.sendername,
          blockid: item.senderid,
          blockby: item.receivername,
          blockbyid: item.receiverid,
        }).then(() => {
          remove(ref(db, "friends/" + item.key));
        });
  }
  const handleActiveChat = (item)=>{
    let userinfo = {};
    if (item.receiverid === auth.currentUser.uid) {
      userinfo.status = "single";
      userinfo.id = item.senderid;
      userinfo.name = item.sendername;
    } else {
      userinfo.status = "single";
      userinfo.id = item.receiverid;
      userinfo.name = item.receivername;
    }
    dispatch(activeChat(userinfo));
  }
  return (

    <>
      <div className="shadow-sm shadow-black p-5 h-[427px] overflow-y-scroll rounded-3xl mt-5">
      <h3 className="font-nunito font-semibold text-xl">Friends</h3>
      {friend.map((item) => (
        <div onClick={() => handleActiveChat(item)} className="flex justify-between items-center border-b border-solid border-black pb-2.5 m-5" >
          <img src="images/profileimg.png" alt="" className="w-[70px] h-[70px] rounded" />
          <div>
            <h3 className="font-nunito font-semibold text-lg">  
			      {auth.currentUser.uid === item.senderid ? (
                <h1>{item.receivername} </h1>
              ) : (
                <h1>{item.sendername} </h1>
              )}
            </h3>
            <p className="font-nunito font-semibold text-sm"> Be a MERN Warior </p>
          </div>
          <div>
            {props.block ? 
              (
                <button onClick={() => handleBlock(item)} className="font-nunito font-bold text-lg text-white bg-primary p-1.5 rounded"> Block </button>
              ) 
              : 
              (
              <button className="font-nunito font-bold text-lg text-white bg-primary p-1.5 rounded"> <RiMessage2Fill /> </button>
              )
            }
          </div>
        </div>
      ))}
    </div>
    </>
  )
}

export default Friendlist
