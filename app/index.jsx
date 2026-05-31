import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { registerUser, loginUser } from "../lib/auth";
import { getAvatarUrl } from "../lib/storage";
 

export default function LoginScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");  

  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const {
  setUserName,
  setUserPhone,
  setUserAvatar,
  setUserEmail,
  setUserAvatarId,
  setUserId,                                            
} = useUser();
  // Handle Register 
  const handleRegister = async () => {
  if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
    Alert.alert("Error", "Please fill in all fields");
    return;
  }
  setLoading(true);
  try {
    const user = await registerUser(name.trim(), phone.trim(), email.trim(), password);
    setUserName(name.trim());
    setUserPhone(phone.trim());
    setUserEmail(email.trim());
    setUserId(user.$id);                                
    router.replace("/(tabs)/chats");
  } catch (error) {
    Alert.alert("Register Failed", error.message);
  } finally {
    setLoading(false);
  }
};

  // Handle Login
 const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    Alert.alert("Error", "Please enter email and password");
    return;
  }
  setLoading(true);
  try {
    const user = await loginUser(email.trim(), password);
    setUserName(user.name);
    setUserPhone(user.phone);
    setUserEmail(email.trim());
    setUserId(user.$id);                                
    if (user.avatarId) {
      setUserAvatarId(user.avatarId);
      setUserAvatar(getAvatarUrl(user.avatarId));
    }
    router.replace("/(tabs)/chats");
  } catch (error) {
    Alert.alert("Login Failed", error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💬</Text>
      <Text style={styles.title}>ChatApp</Text>

      {/*Tabs*/}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "login" && styles.tabActive]}
          onPress={() => setActiveTab("login")}
        >
          <Text style={[styles.tabText, activeTab === "login" && styles.tabTextActive]}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "register" && styles.tabActive]}
          onPress={() => setActiveTab("register")}
        >
          <Text style={[styles.tabText, activeTab === "register" && styles.tabTextActive]}>
            Register
          </Text>
        </TouchableOpacity>
      </View>

      {/* Register Form*/}
      {activeTab === "register" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Your name..."
            placeholderTextColor="gray"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone number..."
            placeholderTextColor="gray"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={15}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email..."
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password..."
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={activeTab === "login" ? handleLogin : handleRegister}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>
              {activeTab === "login" ? "Login" : "Create Account"}
            </Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveTab(activeTab === "login" ? "register" : "login")}>
        <Text style={styles.switchText}>
          {activeTab === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  emoji: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 36, fontWeight: "bold", color: "#075E54", marginBottom: 24 },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginBottom: 24,
    padding: 4,
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: { backgroundColor: "#075E54" },
  tabText: { fontSize: 15, fontWeight: "bold", color: "#888" },
  tabTextActive: { color: "#fff" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    backgroundColor: "#075E54",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: { backgroundColor: "#aaa" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  switchText: { color: "#075E54", fontSize: 14, marginTop: 4 },
});