import React from 'react'
import Sidebar from '../component/Sidebar'
import Friendlist from '../component/Friendlist'
import Chat from '../component/Chat'
const Message = () => {
  return (
    <>
     <div className="flex">
        <div className="max-w-[200]">
            <Sidebar active="message"/>
        </div>
        <div className="w-[450px] ml-10">
          <Friendlist></Friendlist>
        </div>
        <div className="w-[1000px] ml-10">
         <Chat></Chat>
        </div>
      </div>
    </>
  )
}

export default Message
