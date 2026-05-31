import { Storage, ID, Client } from "react-native-appwrite";
import { appwriteConfig, databases, Query } from "./appwrite";

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const storage = new Storage(client);


export async function uploadAvatar(fileUri, fileName, mimeType) {
  try {
    const file = {
      name: fileName,
      type: mimeType,
      size: 1,
      uri: fileUri,
    };

    const response = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file
    );

    return response.$id;
  } catch (error) {
    throw new Error(error.message);
  }
}

export function getAvatarUrl(fileId) {
  return `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
}

export async function saveAvatarToDb(email, fileId) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("email", email)]
    );

    const userDoc = response.documents[0];
    if (!userDoc) throw new Error("User not found");

    
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userDoc.$id,
      { avatarId: fileId }
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteAvatar(fileId) {
  try {
    await storage.deleteFile(appwriteConfig.bucketId, fileId);
  } catch (error) {
    throw new Error(error.message);
  }
}