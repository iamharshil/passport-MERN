import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [data, setData] = useState({ username: "test", password: "test" });

    function handleChange(e) {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        await axios
            .post(
                "http://localhost:5000/api/login",
                {
                    // identifier: data.username,
                    username: data.username,
                    password: data.password,
                }
                // { credentials: "include" }
            )
            .then((res) => {
                console.log(res);
                console.log(res.data);
                localStorage.setItem("token", res.data.token);
                return router.push("/");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("http://localhost:5000/api/protected", {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                console.log(res.data);
                return router.push("/");
            })
            .catch((error) => {
                console.log(error);
            });
    }, [router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        name="username"
                        onChange={handleChange}
                        value={data.username}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={data.password}
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
