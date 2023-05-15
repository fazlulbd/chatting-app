import React, { useState, useRef  } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { FaRegCommentDots } from 'react-icons/fa'
import {IoMdNotificationsOutline} from 'react-icons/io'
import {ImUpload3} from 'react-icons/im'
import { BsGear } from 'react-icons/bs'
import { MdLogout } from 'react-icons/md'
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { FallingLines } from  'react-loader-spinner'
const Sidebar = ({active}) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const storage = getStorage();
  const [uploadimg, setUploadimg] = useState(false)
  const [loading, setLoading] = useState(false)
  const [img, setImg] = useState("")
  const [pimg, setPimg] = useState("")
  const [imgname, setImgname] = useState("")
  const [cropper, setCropper] = useState('')
  
  const cropperRef = useRef(null);
  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    setPimg(cropper.getCroppedCanvas().toDataURL());
  };

  const haldlelogout = ()=>{
    signOut(auth).then(() => {
      navigate('/login')
    }).catch((error) => {
      console.log(error)
    });
  }
    const handleUploadimg = ()=>{
    setUploadimg(!uploadimg);
    setImg("");
    setPimg("");
  }
  
  const handleSelectimg = (e)=>{
    setImgname(e.target.files[0].name)
    let files;
    if(e.dataTransfer){
      files = e.dataTransfer.files;
    }else if(e.target){
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImg(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

 
  const getCropData = (e) => {
    setLoading(true)
    const storageRef = ref(storage, imgname);
    if (typeof cropper !== "undefined") {
      cropper.getCroppedCanvas().toDataURL();
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          // console.log('File available at', downloadURL);
          updateProfile(auth.currentUser, {
           photoURL: downloadURL,
          }).then(() => {
		         console.log("update ses")
           setLoading(false)
           setUploadimg(false)
          }).catch((error) => {
            console.log(error)
          });
        });
      });
    }
  };
  return (
    <>
        <div className="w-full bg-primary  py-9 px-11 rounded-2xl ml-6">
            <div className="relative w-28 h-28 rounded-full overflow-hidden group ">
               <img src={auth.currentUser.photoURL} alt="profile pocture"  className='w-28 h-28 rounded-full'/>
               <div onClick={handleUploadimg} className='w-14 h-14  bg-primary absolute  bottom-0 right-0 flex justify-center items-center hidden group-hover:flex'>
                  <ImUpload3 className='text-white text-2xl'/>
               </div>
            </div>
            <h4 className='text-white font-nunito text-xl text-center'>{auth.currentUser.displayName}</h4>
            <div className="flex flex-col items-center text-white gap-y-20 mt-20">
               <div className={`${active === "home" && "relative after:absolute after:top-0 after:left-0 after:bg-white after:w-[195%] after:h-full after:content-[''] after:z-[-1] z-10 p-5 after:rounded-2xl before:absolute before:top-0 before:right-[-68px] before:bg-primary before:w-[15px] before:h-full before:content-[''] before:rounded-ss-[10px] before:rounded-es-[10px]" }`}>
                  <Link to='/home'><AiOutlineHome className={`${active === "home" ? 'text-5xl text-primary': 'text-5xl text-white'  }`}/></Link>
               </div>
               <div className={`${active === "message" && "relative after:absolute after:top-0 after:left-0 after:bg-white after:w-[195%] after:h-full after:content-[''] after:z-[-1] z-10 p-5 after:rounded-2xl before:absolute before:top-0 before:right-[-68px] before:bg-primary before:w-[15px] before:h-full before:content-[''] before:rounded-ss-[10px] before:rounded-es-[10px]" }`}>
                  <Link to='/message'> <FaRegCommentDots className={`${active === "message" ? 'text-5xl text-primary': 'text-5xl text-white'  }`} /></Link>
               </div>
                <IoMdNotificationsOutline className='text-5xl'/>
                <BsGear className='text-5xl'/>
                <MdLogout onClick={haldlelogout} className='text-5xl mt-32'/>
            </div>
            {/* upload images modal */}
            {uploadimg &&
              <div className="flex justify-center items-center h-screen w-full bg-primary fixed top-0 left-0 z-[99]">
                <div className=" bg-white p-5 rounded border border-solid border-black">
                    <h1 className='text-5xl text-primary font-bold '>Upload Image</h1>
                    {
                      pimg ?
                      <div className="mt-3">
                      <img src={pimg} alt="" className='w-28 h-28 rounded-full'/>
                    </div>
                    :  <img src={auth.currentUser.photoURL} alt="" className='w-28 h-28 rounded-full'/>
                    }
                    
                    <div className="relative">
                        <input type="file" onChange={handleSelectimg} className='border border-solid border-black w-full rounded-[10px] px-7 py-6 mt-9 '/>                     
                    </div>
                    <Cropper
                        src={img}
                        style={{ height: 300, width: 400}}
                        // Cropper.js options
                        initialAspectRatio={16 / 9}
                        guides={false}
                        crop={onCrop}
                        ref={cropperRef}
                        onInitialized={(instance)=>{
                          setCropper(instance)
                        }}
                    />
                    {
                      loading?
                      <FallingLines
                      color= "#5f35f5"
                      width="100"
                      visible={true}
                      ariaLabel='falling-lines-loading'
                    />
                    :
                      <>
                      <button onClick={getCropData}  className=' text-center bg-primary rounded py-2 px-5  font-numito font-semibold text-sm text-white mt-5'>Upload</button>
                      <button  onClick={handleUploadimg}  className=' text-center bg-[#ea6c00] rounded py-2 px-5 ml-5  font-numito font-semibold text-sm text-white mt-5'>Cancel</button>
                      </>
                    }
                   
                </div>
              </div> 
            }
            {/* upload images modal */}
        </div>
    </>
  )
}

export default Sidebar
