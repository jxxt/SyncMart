import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../firebaseConfig";

const Header = ({ showCartButton = true, cartCount = 0 }) => {
    const [currentServer, setCurrentServer] = useState("GLOBAL");
    const [isOnline, setIsOnline] = useState(false);
    const [sanitizedCountry, setSanitizedCountry] = useState("");

    const formatServerName = (server) => {
        if (!server) return "GLOBAL";

        const upperServer = server.toUpperCase();
        switch (upperServer) {
            case "NORTHKOREA":
                return "NORTH KOREA";
            case "UNITEDKINGDOM":
                return "UNITED KINGDOM";
            default:
                return upperServer;
        }
    };

    useEffect(() => {
        const localStorageServer = localStorage.getItem("country");
        const normalizedServer = localStorageServer
            ? localStorageServer.toLowerCase().replace(/\s+/g, "")
            : null;

        setSanitizedCountry(normalizedServer || "global");

        if (!normalizedServer) {
            setCurrentServer("GLOBAL");
            setIsOnline(false);
            return;
        }

        const serverStatusRef = ref(db, "serverStatus");
        const unsubscribe = onValue(serverStatusRef, (snapshot) => {
            const serverStatus = snapshot.val();
            const onlineStatus = Object.entries(serverStatus).find(
                ([key]) =>
                    key.toLowerCase().replace(/\s+/g, "") === normalizedServer
            )?.[1];

            if (onlineStatus === "online") {
                setCurrentServer(normalizedServer);
                setIsOnline(true);
                return;
            }

            const serversRef = ref(db, `servers/${normalizedServer}`);
            onValue(serversRef, (serverSnapshot) => {
                const priorityServers = serverSnapshot.val();
                for (let i = 1; i <= 4; i++) {
                    const priorityServer = priorityServers[i.toString()];
                    if (serverStatus[priorityServer] === "online") {
                        setCurrentServer(priorityServer);
                        setIsOnline(true);
                        return;
                    }
                }
                setCurrentServer("global");
                setIsOnline(false);
            });
        });

        return () => unsubscribe();
    }, []);

    return (
        <header className="bg-black text-white sticky top-0 z-50 border-b border-gray-800 py-4 px-6">
            <div className="container mx-auto flex justify-between items-center">
                <Link
                    to={`/${sanitizedCountry}`}
                    className="text-2xl font-bold tracking-tight hover:text-gray-300 transition-colors duration-300"
                >
                    Sync<span className="text-gray-300">Mart</span>
                </Link>

                <div className="flex items-center gap-2">
                    <span
                        className={`h-2 w-2 rounded-full ${
                            isOnline ? "bg-green-500" : "bg-red-500"
                        }`}
                    ></span>
                    <span>SERVER: {formatServerName(currentServer)}</span>
                </div>

                {showCartButton && (
                    <div className="flex items-center gap-6">
                        <Link
                            to={`/${sanitizedCountry}/cart`}
                            className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-300 relative group cursor-pointer"
                            aria-label="Shopping cart"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 group-hover:scale-110 transition-transform duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
