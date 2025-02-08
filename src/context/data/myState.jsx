import React, { useState,useEffect } from 'react'
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';

function MyState(props) {
    const [mode, setMode] = useState('light'); // Whether dark mode is enabled or not
    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = 'black';
        }
        else {
            setMode('light');
            document.body.style.backgroundColor = 'white';
        }
    }
    const [searchkey, setSearchkey] = useState('')
    const [loading, setloading] = useState(false);
    const [getAllBlog, setGetAllBlog] = useState([]);

    function getAllBlogs() {
        setloading(true);
        try {
            const q = query(
                collection(fireDB, "blogPosts"),
                orderBy('date')
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let blogArray = [];
                QuerySnapshot.forEach((doc) => {
                    console.log("Document Data: ", doc.data());
                    blogArray.push({ ...doc.data(), id: doc.id });
                });
                console.log("Fetched Blogs Array: ", blogArray); 
                setGetAllBlog(blogArray) 
                         setloading(false)
    
            });
            return () => data;
        } catch (error) {
            console.log(error)
            setloading(false)
        }
    }
    useEffect(() => {
        getAllBlogs();
    }, []);

    const deleteBlogs = async (id) => {
        try {
            await deleteDoc(doc(fireDB, "blogPosts", id));
            getAllBlogs()
            toast.success("Blogs deleted successfully")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <MyContext.Provider value={{ 
            mode,
            toggleMode,
            searchkey,
            setSearchkey,
            loading,
            setloading,
            getAllBlog,
            deleteBlogs
}}>
            {props.children}
        </MyContext.Provider>
    )
}

export default MyState