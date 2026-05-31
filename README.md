# ChatApp 💬

A simple chat app I built to learn React Native, Expo, and Appwrite. You can register, chat with other users, and upload a profile picture.

---

## What this app can do

- Register and login with email and password
- See all users and start a chat with anyone
- Send and receive messages
- Upload a profile picture
- See the last message and unread count in chat list
- Profile screen shows your name, phone and photo

---

## Built with

- React Native + Expo Router
- Appwrite (database, auth, storage)
- expo-image-picker

---

## Project structure

```
ChatApp/
├── app/
│   ├── _layout.jsx        
│   ├── index.jsx            
│   ├── (tabs)/
│   │   ├── _layout.jsx      
│   │   ├── chats.jsx        
│   │   └── profile.jsx      
│   └── chat/
│       └── [id].jsx         
├── context/
│   └── UserContext.jsx      
├── lib/
│   ├── appwrite.js          
│   ├── auth.js              
│   ├── messages.js          
│   └── storage.js           
```

---

## Run it yourself

You will need:
- Node.js
- Expo Go app on your phone
- A free Appwrite account at [cloud.appwrite.io](https://cloud.appwrite.io)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/ChatApp.git
cd ChatApp
```

### 2. Install packages

```bash
npm install
```

### 3. Setup Appwrite

Create a free account and then:

1. Create a project called `ChatApp`
2. Create a database called `chatapp-db`
3. Create a table called `users` with these columns:

| Column | Type | Required |
|---|---|---|
| name | Text | yes |
| phone | Text | yes |
| email | Text | yes |
| userId | Text | yes |
| avatarId | Text | no |

4. Create a table called `messages` with these columns:

| Column | Type | Required |
|---|---|---|
| senderId | Text | yes |
| senderName | Text | yes |
| text | Text | yes |
| chatId | Text | yes |
| createdAt | Text | yes |

5. Create a storage bucket called `avatars`
6. Set permissions to **Any** on both tables and the bucket (Create, Read, Update, Delete)
7. Go to Settings and add a platform:
   - Select iOS or Android
   - Bundle ID: `host.exp.exponent` (for Expo Go)

### 4. Add your credentials

Create a `.env` file in the root folder:

```
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_table_id
EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID=your_messages_table_id
EXPO_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
```

Then update `lib/appwrite.js`:

```js
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
  messagesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
};
```

### 5. Start the app

```bash
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

## Notes

- This is my first project after following tutorials so the code is not perfect
- Real-time messaging is not added yet, you need to reopen the chat to see new messages
- Tested on iOS only

---

## Author

Made by **zain**
GitHub: [mzainjamali](https://github.com/mzainjamali)