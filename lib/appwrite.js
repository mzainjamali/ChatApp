import { Client, Account, Databases, ID, Query } from "react-native-appwrite";


export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "69b5b6ad000ead87cfd7",       
  databaseId: "69b5b7ab00119ec596e9",     
  usersCollectionId: "users",    
  messagesCollectionId: "messages", 
  bucketId: "69b7ea6e000c17e102e3",
};


const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query };