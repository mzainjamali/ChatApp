import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userAvatarId, setUserAvatarId] = useState(null);
  const [userId, setUserId] = useState(null);           

  return (
    <UserContext.Provider value={{
      userName, setUserName,
      userPhone, setUserPhone,
      userAvatar, setUserAvatar,
      userEmail, setUserEmail,
      userAvatarId, setUserAvatarId,
      userId, setUserId,                                
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}