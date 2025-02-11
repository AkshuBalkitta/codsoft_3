import React, { useState, useContext } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { BsFillArrowLeftCircleFill } from "react-icons/bs"
import myContext from '../../../context/data/myContext';
import { Link } from "react-router-dom";
import { fireDB, auth } from "../../../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import cloudinaryConfig from "../../../cloudinary/CloudinaryConfig";
import toast from "react-hot-toast";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import {
    Button,
    Typography,
} from "@material-tailwind/react";

function CreateBlog() {
    const context = useContext(myContext);
    const { mode } = context;

    const [blogs, setBlogs] = useState({
        title: "",
        category: "",
        content: "",
        time:Timestamp.now(),
});

    const [text, settext] = useState('');
    console.log("Value: ",);
    console.log("text: ", text);
    console.log(blogs);

    const [image, setImage] = useState(""); 
    const [url, setUrl] = useState(""); 
    const navigate = useNavigate();

    const addPost = async () => {
        if (blogs.title === "" || blogs.category === "" || blogs.content === "" || blogs.image === "") {
            toast.error('Please Fill All Fields');
        }
        try {
            const imageUrl = await saveImage(); 
            if (!imageUrl) {
                toast.error("Image upload failed. Please try again.");
                return;
            }
            const blogRef = collection(fireDB, "blogPosts");
            let parsedBlogs = blogs; // Start with the same value as blogs
            if (typeof blogs === "string") {
                try {
                    parsedBlogs = JSON.parse(blogs); // Convert string to object if needed
                } catch (error) {
                    console.error("Error parsing blogs:", error);
                    toast.error("Invalid blog content format!");
                    return; // Exit if parsing fails
                }
            }
            await addDoc(blogRef, {
                //blogs,
                //blogs: typeof blogs === "string" ? blogs : JSON.stringify(blogs),
                blogs:parsedBlogs,
                image: imageUrl,
                date: new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                            }
                )
                    
            });
    
            toast.success("Blog created successfully!");
            navigate("/dashboard"); 
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while creating the blog. Please try again.");
        }
    }

    const saveImage = async () => {
        if (!image) {
          toast.error("Please Upload an Image");
          return null;
        }
    
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", cloudinaryConfig.uploadPreset);
        data.append("cloud_name", cloudinaryConfig.cloudName);
    
        try {
          const res = await fetch(
            'https://api.cloudinary.com/v1_1/blogcloud/image/upload',
            {
              method: "POST",
              body: data,
            }
          );
          if (!res.ok) {
            throw new Error(`Upload failed with status ${res.status}`);
        }
    
          const cloudData = await res.json();
          console.log("Cloudinary Response:", cloudData); 
          setUrl(cloudData.url);
          toast.success("Image Uploaded Successfully");
          return cloudData.url; 
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Image Upload Failed");
          return null;
        }
      };

    function createMarkup(c) {
       return { __html: c };
    }
    return (
        <div className=' container mx-auto max-w-5xl py-6'>
            <div className="p-5" style={{
                background: mode === 'dark'
                    ? '#353b48'
                    : 'rgb(226, 232, 240)',
                borderBottom: mode === 'dark'
                    ? ' 4px solid rgb(226, 232, 240)'
                    : ' 4px solid #641975'
            }}>
                <div className="mb-2 flex justify-between">
                    <div className="flex gap-2 items-center">
                        <Link to={'/dashboard'}>
                            <BsFillArrowLeftCircleFill size={25} />
                        </Link>

                        <Typography
                            variant="h4"
                            style={{
                                color: mode === 'dark'
                                    ? 'white'
                                    : 'black'
                            }}
                        >
                            Create blog
                        </Typography>
                    </div>
                </div>
                <div className="mb-3">
                    {image && <img className=" w-full rounded-md mb-3 "
                        src={image
                            ? URL.createObjectURL(image)
                            : ""}
                        alt="thumbnail"
                    />}

                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-semibold"
                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                        Upload Thumbnail
                    </Typography>

                    <input
                        type="file"
                        label="Upload thumbnail"
                        className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1"
                        style={{
                            background: mode === 'dark'
                                ? '#dcdde1'
                                : 'rgb(226, 232, 240)'
                        }}
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <div className="mb-3">
                    <input
                        label="Enter your Title"
                       className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                 outline-none ${mode === 'dark'
                 ? 'placeholder-black'
                 : 'placeholder-black'}`}
                        placeholder="Enter Your Title"
                        style={{
                            background: mode === 'dark'
                                ? '#dcdde1'
                                : 'rgb(226, 232, 240)'
                        }}
                        name="title"
                        value={blogs.title}
                        onChange={(e)=>setBlogs({...blogs,title: e.target.value})}
                    />
                </div>

                <div className="mb-3">
                    <input
                        label="Enter your Category"
                        className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                 outline-none ${mode === 'dark'
                 ? 'placeholder-black'
                 : 'placeholder-black'}`}
                        placeholder="Enter Your Category"
                        style={{
                            background: mode === 'dark'
                                ? '#dcdde1'
                                : 'rgb(226, 232, 240)'
                        }}
                        name="category"
                        value={blogs.category}
                        onChange={(e)=>setBlogs({...blogs,category: e.target.value})}
                    />
                </div>

                <Editor
                    apiKey='97enqlyy0e4xquz5sqwf535d6mmlj1yixnxcl2i1h4ehibo1'
                    onEditorChange={(newValue, editor) => {
                        setBlogs({ ...blogs, content: newValue });
                        settext(editor.getContent({ format: 'text' }));
                    }}
                    onInit={(evt, editor) => {
                        settext(editor.getContent({ format: 'text' }));
                    }}
                    init={{
                        plugins: 'a11ychecker advcode advlist advtable anchor autocorrect autolink autoresize autosave casechange charmap checklist code codesample directionality editimage emoticons export footnotes formatpainter fullscreen help image importcss inlinecss insertdatetime link linkchecker lists media mediaembed mentions mergetags nonbreaking pagebreak pageembed permanentpen powerpaste preview quickbars save searchreplace table tableofcontents template  tinydrive tinymcespellchecker typography visualblocks visualchars wordcount'
                    }}
                />

                <Button className=" w-full mt-5"
                onClick={addPost}
                    style={{
                        background: mode === 'dark'
                            ? 'rgb(226, 232, 240)'
                            : ' #641975',
                        color: mode === 'dark'
                            ? 'rgb(30, 41, 59)'
                            : 'rgb(226, 232, 240)'
                    }}
                >
                    Send
                </Button>

                <div className="">
                    <h1 className=" text-center mb-3 text-2xl">Preview</h1>
                    <div className="content">
                    <div
                        className={`[&> h1]:text-[32px] [&>h1]:font-bold  [&>h1]:mb-2.5
                        ${mode === 'dark' ? '[&>h1]:text-[#ff4d4d]' : '[&>h1]:text-black'}

                        [&>h2]:text-[24px] [&>h2]:font-bold [&>h2]:mb-2.5
                        ${mode === 'dark' ? '[&>h2]:text-white' : '[&>h2]:text-black'}

                        [&>h3]:text-[18.72] [&>h3]:font-bold [&>h3]:mb-2.5
                        ${mode === 'dark' ? '[&>h3]:text-white' : '[&>h3]:text-black'}

                        [&>h4]:text-[16px] [&>h4]:font-bold [&>h4]:mb-2.5
                        ${mode === 'dark' ? '[&>h4]:text-white' : '[&>h4]:text-black'}

                        [&>h5]:text-[13.28px] [&>h5]:font-bold [&>h5]:mb-2.5
                        ${mode === 'dark' ? '[&>h5]:text-white' : '[&>h5]:text-black'}

                        [&>h6]:text-[10px] [&>h6]:font-bold [&>h6]:mb-2.5
                        ${mode === 'dark' ? '[&>h6]:text-white' : '[&>h6]:text-black'}

                        [&>p]:text-[16px] [&>p]:mb-1.5
                        ${mode === 'dark' ? '[&>p]:text-[#7efff5]' : '[&>p]:text-black'}

                        [&>ul]:list-disc [&>ul]:mb-2
                        ${mode === 'dark' ? '[&>ul]:text-white' : '[&>ul]:text-black'}

                        [&>ol]:list-decimal [&>li]:mb-10
                        ${mode === 'dark' ? '[&>ol]:text-white' : '[&>ol]:text-black'}

                        [&>li]:list-decimal [&>ol]:mb-2
                        ${mode === 'dark' ? '[&>ol]:text-white' : '[&>ol]:text-black'}

                        [&>img]:rounded-lg
                        `}
                         dangerouslySetInnerHTML={createMarkup(blogs.content)}>
                    </div>
            </div>
        </div >
            </div >
        </div >
    )
}

export default CreateBlog