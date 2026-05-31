import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ActivityIndicator, Alert
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import { logoutUser } from "../../lib/auth";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { uploadAvatar, getAvatarUrl, saveAvatarToDb } from "../../lib/storage"; 


export default function ProfileScreen() {
  const router = useRouter();
const { userName, setUserName, userPhone, setUserPhone, userAvatar, setUserAvatar, userEmail, setUserAvatarId } = useUser(); // ← add userEmail, setUserAvatarId
  const [uploading, setUploading] = useState(false);

  
  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Please allow access to your photos");
        return;
      }

      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],       
        quality: 0.7,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        await handleUpload(image);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  
  const handleUpload = async (image) => {
  setUploading(true);
  try {
    const fileName = image.uri.split("/").pop();
    const mimeType = image.mimeType || "image/jpeg";

    // 1. Upload file to storage
    const fileId = await uploadAvatar(image.uri, fileName, mimeType);

    // 2. Save avatarId to database
    await saveAvatarToDb(userEmail, fileId);             

    // 3. Update context
    setUserAvatarId(fileId);
    const avatarUrl = getAvatarUrl(fileId);
    setUserAvatar(avatarUrl);

    Alert.alert("Success", "Profile picture updated! ✅");
  } catch (error) {
    Alert.alert("Upload Failed", error.message);
  } finally {
    setUploading(false);
  }
};
  
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      
    }
    setUserName("");
    setUserPhone("");
    setUserAvatar(null);
    router.replace("/");
  };

  return (
    <View style={styles.container}>

      
      <TouchableOpacity style={styles.avatarBox} onPress={handlePickImage}>
        {uploading ? (
          <ActivityIndicator size="large" color="#075E54" />
        ) : userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarEmoji}>🧑</Text>
        )}

        
        <View style={styles.cameraIcon}>
          <Ionicons name="camera" size={16} color="#fff" />
        </View>
      </TouchableOpacity>

      <Text style={styles.tapText}>Tap to change photo</Text>
      <Text style={styles.name}>{userName || "Your Name"}</Text>
      <Text style={styles.status}>Hey there! I'm using ChatApp 👋</Text>

      
      <View style={styles.card}>
        <Text style={styles.cardLabel}>👤  Name</Text>
        <Text style={styles.cardValue}>{userName || "Not set"}</Text>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.cardLabel}>📱  Phone</Text>
        <Text style={styles.cardValue}>{userPhone || "Not set"}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "#fff",
    padding: 24,
  },
  avatarBox: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  avatarEmoji: { fontSize: 52 },
  cameraIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#075E54",
    borderRadius: 12,
    padding: 4,
  },
  tapText: { color: "#aaa", fontSize: 12, marginBottom: 12 },
  name: { fontSize: 24, fontWeight: "bold", color: "#111" },
  status: { color: "#888", marginTop: 6, fontSize: 14, marginBottom: 32 },
  card: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardLabel: { color: "#888", fontSize: 13, marginBottom: 4 },
  cardValue: { fontSize: 16, color: "#111", fontWeight: "500" },
  logoutBtn: {
    marginTop: 24,
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});