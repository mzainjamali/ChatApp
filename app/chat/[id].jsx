import { useState, useRef, useEffect } from "react";
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../context/UserContext";
import { sendMessage, getMessages } from "../../lib/messages";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
const { userName, userId } = useUser();             
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages(id);
      setMessages(data);
    } catch (error) {
      Alert.alert("Error", "Could not load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
  if (!input.trim()) return;
  const text = input.trim();
  setInput("");

  const tempMsg = {
    $id: Date.now().toString(),
    text,
    senderId: userId,                               
    senderName: userName,
    chatId: id,
    createdAt: new Date().toISOString(),
  };
  setMessages((prev) => [...prev, tempMsg]);
  setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

  try {
    setSending(true);
    await sendMessage(userId, userName, text, id);  
  } catch (error) {
    Alert.alert("Error", "Message could not be sent");
    setMessages((prev) => prev.filter((m) => m.$id !== tempMsg.$id));
  } finally {
    setSending(false);
  }
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075E54" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {messages.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={styles.emptyText}>No messages yet</Text>
          <Text style={styles.emptySubText}>Say hello! 👋</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
  <View style={[
    styles.bubble,
    item.senderId === userId ? styles.mine : styles.theirs,  
  ]}>
    {item.senderId !== userId && (
      <Text style={styles.senderName}>{item.senderName}</Text>
    )}
    <Text style={styles.msgText}>{item.text}</Text>
    <Text style={styles.time}>
      {new Date(item.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </Text>
  </View>
)}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || sending}
        >
          {sending
            ? <ActivityIndicator size="small" color="#fff" />
            : <Ionicons name="send" size={20} color="#fff" />
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECE5DD" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ECE5DD" },
  loadingText: { marginTop: 12, color: "#075E54", fontSize: 15 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyText: { fontSize: 18, color: "#888", fontWeight: "bold" },
  emptySubText: { fontSize: 14, color: "#aaa", marginTop: 6 },
  messageList: { padding: 16, paddingBottom: 8, flexGrow: 1 },
  bubble: { maxWidth: "75%", padding: 10, paddingHorizontal: 14, borderRadius: 16, marginBottom: 8 },
  mine: { backgroundColor: "#DCF8C6", alignSelf: "flex-end", borderBottomRightRadius: 2 },
  theirs: { backgroundColor: "#fff", alignSelf: "flex-start", borderBottomLeftRadius: 2 },
  senderName: { fontSize: 12, color: "#075E54", fontWeight: "bold", marginBottom: 2 },
  msgText: { fontSize: 15, color: "#111" },
  time: { fontSize: 10, color: "#999", marginTop: 4, textAlign: "right" },
  inputBar: { flexDirection: "row", padding: 8, paddingHorizontal: 12, backgroundColor: "#f0f0f0", alignItems: "flex-end", gap: 8 },
  input: { flex: 1, backgroundColor: "#fff", borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendBtn: { backgroundColor: "#075E54", borderRadius: 24, padding: 12, justifyContent: "center", alignItems: "center" },
  sendBtnDisabled: { backgroundColor: "#aaa" },
});