import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from '@/lib/appwrite';

export interface User {
    $id: string;
    accountId: string;
    email: string;
    username: string;
    avatar: string;
    // Thêm các trường khác nếu cần
}

interface GlobalContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser().then((res) => {
            if (res) {
                setIsLoggedIn(true);
                const user: User = {
                    $id: res.$id,
                    accountId: res.accountId,
                    email: res.email,
                    username: res.username,
                    avatar: res.avatar,
                    // Thêm các trường khác nếu cần
                };
                setUser(user);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;