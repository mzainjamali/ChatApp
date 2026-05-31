import { databases, ID, Query, appwriteConfig } from "./appwrite";

export async function sendMessage(senderId, senderName, text, chatId) {
  try {
    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        senderId,
        senderName,
        text,
        chatId,
        createdAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getMessages(chatId) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [
        Query.equal("chatId", chatId),
        Query.orderAsc("createdAt"),
      ]
    );
    return response.documents;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteMessage(messageId) {
  try {
    return await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId
    );
  } catch (error) {
    throw new Error(error.message);
  }
}