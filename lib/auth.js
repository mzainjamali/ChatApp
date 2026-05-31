import { account, databases, ID, Query, appwriteConfig } from "./appwrite";


export async function registerUser(name, phone, email, password) {
  try {
    try {
      await account.deleteSession("current");
    } catch (e) {}

    const newAccount = await account.create(ID.unique(), email, password, name);

    
    await account.createEmailPasswordSession(email, password);

    const authUser = await account.get();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        name: name,
        phone: phone,
        email: email,
        userId: authUser.$id,        
      }
    );

    return authUser;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function loginUser(email, password) {
  try {
    
    try {
      await account.deleteSession("current");
    } catch (e) {
     
    }

    await account.createEmailPasswordSession(email, password);

    const user = await account.get();

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("email", email)]
    );

    const dbUser = response.documents[0];
    return {
      ...user,
      phone: dbUser?.phone || "",
      avatarId: dbUser?.avatarId || null,   
    };
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function logoutUser() {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    throw new Error(error.message);
  }
}


export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function getAllUsers() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId
    );
    return response.documents;
  } catch (error) {
    throw new Error(error.message);
  }
}