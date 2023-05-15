import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import moment from "moment/moment";
const Chat = () => {
    const auth = getAuth();
    const db = getDatabase();
    const  [message, setMessage] = useState('')
    const  [showmessage, setShowmessage] = useState([])
    let data = useSelector((state) => state.activeChat.value);
    // console.log(data)
    // const datas = data.activeChat.value;
    const handleMsg = (e)=>{
        setMessage(e.target.value)
    }
    const handleMsgSend = ()=>{
        if(data.status === "single"){
            // console.log("ami single thake ");
            set(push(ref(db, 'singlemsg')), {
                whosendid: auth.currentUser.uid,
                whosendname: auth.currentUser.displayName,
                whoreceivename: data.name,
                whoreceiveid: data.id,
                message: message,
                date: `${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
              });
        }
        
    }

    useEffect(()=>{
        const singlemsgrafRef = ref(db, 'singlemsg/');
        onValue(singlemsgrafRef, (snapshot) => {
           const array = []
            snapshot.forEach(item=>{
                // console.log(item.val())
                if (
                    (item.val().whosendid === auth.currentUser.uid && item.val().whoreceiveid === data.id) ||
                    (item.val().whosendid === data.id && item.val().whoreceiveid === auth.currentUser.uid)
                  ){
                    array.push(item.val())
                  }  
            })
            setShowmessage(array)
          });
    },[data.id])

  return (
    <>
    
      <div className="border-l-2  p-3 rounded mt-8 h-[100vh]">
            <div className=" flex  items-center border-b border-black pb-2.5 m-5">
                <img src="images/profileimg.png" alt=""  className='w-16 rounded'/>
                <div className="ml-8">
                    <h3 className='font-numito font-bold text-lg'>{data ? data.name : "Select your friend"}</h3>
                    <p className='font-numito font-semibold text-sm'>online</p>
                </div>
            </div>
            <div className="shadow-sm shadow-black h-[75vh] ml-5 overflow-auto">
                {
                    showmessage.map(item=>(
                        item.whosendid === auth.currentUser.uid ? 
                        (
                            <div className="mt-5 mr-5 flex justify-end">
                              <div>
                                <p className="font-nunito font-medium text-xl bg-primary text-white inline-block px-4 py-1.5 ml-3 rounded">{item.message}</p>
                                <p className="font-nunito font-sm text-sm ml-5 text-slate-400">{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                              </div>
                            </div>
                        )
                        :
                        (
                            <div className="mt-5 ml-5">
                              <p className="font-nunito font-medium text-xl bg-[#F1F1F1] inline-block p-3.5 rounded-xl">{item.message}</p>
                              <p className="font-nunito font-sm text-sm ml-5 text-slate-400">{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                            </div>
                          )                      
                    ))
                }
            </div>
            <div className="mt-5 ml-5">
                <input type="text" onChange={handleMsg} className='shadow-sm shadow-gray-500 p-2 w-[75%] rounded' placeholder='Message'/>
                <button onClick={handleMsgSend} className='font-nunito font-bold text-white bg-primary px-4 py-2 rounded ml-3.5'>Send</button>
                <button className='font-nunito font-bold text-white bg-primary px-4 py-2 rounded ml-3.5'>Attachment</button>
            </div> 
      </div>
     
    </>
  )
}

export default Chat
