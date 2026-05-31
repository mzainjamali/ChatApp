import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image, Alert
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../lib/auth";
import { getAvatarUrl } from "../../lib/storage";
import { useUser } from "../../context/UserContext";
import { getMessages } from "../../lib/messages";

export default function ChatsScreen() {
  const router = useRouter();
  const { userId } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seenChats, setSeenChats] = useState([]);   

  useEffect(() => {
    loadUsers();
  }, []);

  const getChatId = (otherUserId) => {
    return [userId, otherUserId].sort().join("_");
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();

      const otherUsers = allUsers.filter((u) => u.userId !== userId);

      const usersWithMessages = await Promise.all(
        otherUsers.map(async (user) => {
          try {
            const chatId = getChatId(user.userId);
            const messages = await getMessages(chatId);
            const lastMessage = messages[messages.length - 1];
            const unreadCount = messages.filter(
              (m) => m.senderId !== userId
            ).length;

            return {
              ...user,
              lastMessage: lastMessage?.text || "No messages yet",
              lastMessageTime: lastMessage?.createdAt || null,
              unreadCount,
            };
          } catch {
            return {
              ...user,
              lastMessage: "No messages yet",
              lastMessageTime: null,
              unreadCount: 0,
            };
          }
        })
      );

      
      usersWithMessages.sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      });

      setUsers(usersWithMessages);
    } catch (error) {
      Alert.alert("Error", "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { day: "2-digit", month: "short" });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075E54" />
        <Text style={styles.loadingText}>Loading chats...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            const chatId = getChatId(item.userId);
            setSeenChats((prev) => [...prev, chatId]);  
            router.push(`/chat/${chatId}`);
          }}
        >
          
          {item.avatarId ? (
            <Image
              source={{ uri: getAvatarUrl(item.avatarId) }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarBox}>
              <Text style={styles.avatarEmoji}>🧑</Text>
            </View>
          )}

          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.lastMsg} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>

          <View style={styles.right}>
            <Text style={styles.time}>{formatTime(item.lastMessageTime)}</Text>
            
            {item.unreadCount > 0 && !seenChats.includes(getChatId(item.userId)) && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>

        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No users found</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 12, color: "#075E54", fontSize: 15 },
  item: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  avatarEmoji: { fontSize: 28 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#111" },
  lastMsg: { color: "#888", marginTop: 3, fontSize: 14 },
  right: { alignItems: "flex-end", gap: 6 },
  time: { color: "#999", fontSize: 12 },
  badge: {
    backgroundColor: "#25D366",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  separator: { height: 1, backgroundColor: "#f2f2f2", marginLeft: 80 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: { fontSize: 16, color: "#888" },
});