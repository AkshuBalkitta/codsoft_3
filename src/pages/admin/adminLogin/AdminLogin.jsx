import React, { useContext, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import myContext from "../../../context/data/myContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/FirebaseConfig";

export default function AdminLogin() {
    const context = useContext(myContext);
    const { mode } = context;

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        if(!email || !password) {
            return toast.error("Fill all required fields")
        }
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            toast.success('Login Success')
            localStorage.setItem('admin', JSON.stringify(result));
            navigate('/dashboard');
        } catch (error) {
            toast.error('Login Failed')
            console.log(error)
        }
    }

    return (
    <div className="relative h-screen">
        <Link to="/">
        <img className="absolute top-10 left-10 rounded-full w-10 h-10" src="https://thumbs.dreamstime.com/b/back-arrow-icon-special-purple-round-button-back-arrow-icon-isolated-special-purple-round-button-abstract-illustration-104715195.jpg" alt="back"/>
        </Link>
        <div className="flex justify-center items-center h-full">
            <Card
                className="w-full max-w-[24rem]"
                style={{
                    background: mode === 'dark'
                        ? '#641975'
                        : 'rgb(226, 232, 240)'
                }}
            >
                <CardHeader
                    color="blue"
                    floated={false}
                    shadow={false}
                    className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center"
                    style={{
                        background: mode === 'dark'
                            ? 'rgb(226, 232, 240)'
                            : '#641975'
                    }}
                >
                    <div className="mb-4 rounded-full border border-white/10 bg-white/10 p-2 text-white">
                        <div className=" flex justify-center">
                            
                            <img src="https://cdn-icons-png.flaticon.com/128/727/727399.png" className="h-20 w-20"
                            />
                        </div>
                    </div>

                    <Typography variant="h4" style={{
                        color: mode === 'dark'
                            ? 'rgb(30, 41, 59)'
                            : 'rgb(226, 232, 240)'
                    }}>
                        Admin Login
                    </Typography>
                </CardHeader>

                <CardBody>
                    <form className=" flex flex-col gap-4">
                        <div>
                            <Input
                                type="email"
                                label="Email"
                                name="email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Input
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                        </div>
                        <Button
                        onClick={login}
                            style={{
                                background: mode === 'dark'
                                    ? 'rgb(226, 232, 240)'
                                    : '#641975',
                                color: mode === 'dark'
                                    ? 'rgb(30, 41, 59)'
                                    : 'rgb(226, 232, 240)'
                            }}>
                            Login
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
        </div>


    );
} 