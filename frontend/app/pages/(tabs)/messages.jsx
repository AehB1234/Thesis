import { 
  View, 
  ScrollView, 
  TouchableWithoutFeedback, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  Text,
  RefreshControl
} from "react-native";
import React, { useEffect, useState } from "react";
import { rem, em } from "../../../components/stylings/responsiveSize";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { default as CustomText } from "../../../components/CustomText";

//Customs
import ElevatedButton from "../../../components/customs/ElevatedButton";
import ChatLogBar from "../../../components/ChatLogBar";

//Icons
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

//Paper
import { ActivityIndicator, FAB, PaperProvider } from "react-native-paper";
import theme from "../../../components/CustomTheme";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../context/axiosInstance";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { useSelector } from "react-redux";
import axios from "axios";

const Messages = ({ navigation }) => {
  const { user, axiosInstanceWithBearer } = useAuth();
  const [chatData, setChatData] = useState([]);
  const [pressOutside, setPressOutside] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const authState = useSelector((state) => state.auth.auth);

  // Local storage keys
  const CHAT_STORAGE_KEY = '@mental_health_chats';
  const MESSAGES_STORAGE_KEY = '@mental_health_messages';

  useEffect(() => {
    if (!authState.isLoggedIn) {
      navigation.navigate("Login");
    } else {
      retrieveChats();
    }
  }, []);

  // Safe API call function with better error handling
  const safeApiCall = async (method, url, data = null) => {
    try {
      const config = {
        method,
        url,
        ...(data && { data })
      };
      
      const response = await axiosInstanceWithBearer(config);
      return { success: true, data: response.data };
    } catch (error) {
      console.log(`API call failed for ${url}:`, error.response?.status, error.message);
      return { 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status 
      };
    }
  };

  // Check if a chat ID is from backend (MongoDB-like ID) or local
  const isBackendChatId = (chatId) => {
    return chatId && !chatId.startsWith('chat-') && !chatId.startsWith('sample-');
  };

  // Generate unique local chat ID
  const generateLocalChatId = () => {
    return `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Save messages to local storage
  const saveMessagesToLocalStorage = async (chatId, messages) => {
    try {
      const existingMessages = await getMessagesFromLocalStorage();
      const updatedMessages = {
        ...existingMessages,
        [chatId]: messages
      };
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages));
      return true;
    } catch (error) {
      console.log('Error saving messages to local storage:', error);
      return false;
    }
  };

  // Get messages from local storage
  const getMessagesFromLocalStorage = async () => {
    try {
      const messagesJson = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
      return messagesJson ? JSON.parse(messagesJson) : {};
    } catch (error) {
      console.log('Error getting messages from local storage:', error);
      return {};
    }
  };

  // Get messages for a specific chat from backend or local storage
  const getChatMessages = async (chatId) => {
    try {
      // For local chats, only use local storage
      if (!isBackendChatId(chatId)) {
        const allMessages = await getMessagesFromLocalStorage();
        return allMessages[chatId] || [];
      }

      // For backend chats, try backend first, then fallback to local
      const backendResponse = await safeApiCall('GET', `/Message?chat_id=${chatId}`);
      
      if (backendResponse.success && backendResponse.data) {
        // Transform backend messages to frontend format
        const formattedMessages = backendResponse.data.map(msg => ({
          user: msg.from_user,
          text: msg.message_content,
          timestamp: msg.createdAt || new Date().toISOString()
        }));
        
        // Save to local storage as cache
        await saveMessagesToLocalStorage(chatId, formattedMessages);
        return formattedMessages;
      } else {
        // Fallback to local storage
        const allMessages = await getMessagesFromLocalStorage();
        return allMessages[chatId] || [];
      }
    } catch (error) {
      console.log('Error getting chat messages:', error);
      const allMessages = await getMessagesFromLocalStorage();
      return allMessages[chatId] || [];
    }
  };

  // Save chat to local storage
  const saveChatToLocalStorage = async (chat) => {
    try {
      const existingChats = await getChatsFromLocalStorage();
      const updatedChats = [...existingChats.filter(c => c.id !== chat.id), chat];
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedChats));
      return chat;
    } catch (error) {
      console.log('Error saving chat to local storage:', error);
      return null;
    }
  };

  // Get chats from local storage
  const getChatsFromLocalStorage = async () => {
    try {
      const chatsJson = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      return chatsJson ? JSON.parse(chatsJson) : [];
    } catch (error) {
      console.log('Error getting chats from local storage:', error);
      return [];
    }
  };

  // Remove duplicate chats based on ID
  const removeDuplicateChats = (chats) => {
    const uniqueChats = [];
    const seenIds = new Set();
    
    for (const chat of chats) {
      if (!seenIds.has(chat.id)) {
        seenIds.add(chat.id);
        uniqueChats.push(chat);
      } else {
        console.log(`🔄 Removing duplicate chat: ${chat.id}`);
      }
    }
    
    return uniqueChats;
  };

  // Update chat preview and title based on conversation
  const updateChatPreview = async (chatId, userMessage, botResponse) => {
    try {
      // Get current chat data
      const existingChats = await getChatsFromLocalStorage();
      const chatIndex = existingChats.findIndex(chat => chat.id === chatId);
      
      if (chatIndex !== -1) {
        const chat = existingChats[chatIndex];
        
        // Update title with first user message if it's still the default
        let newTitle = chat.title;
        if (chat.title === 'New Conversation' || chat.title === 'Welcome Chat') {
          newTitle = userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '');
        }
        
        // Update preview with latest message
        const newPreview = userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : '');
        
        const updatedChat = {
          ...chat,
          title: newTitle,
          preview: newPreview,
          last_updated: new Date().toISOString()
        };
        
        existingChats[chatIndex] = updatedChat;
        await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(existingChats));
        
        // Also update backend if it's a backend chat
        if (isBackendChatId(chatId)) {
          await safeApiCall('PUT', `/Chat/${chatId}`, {
            title: newTitle,
            preview: newPreview
          });
        }
        
        return updatedChat;
      }
    } catch (error) {
      console.log('Error updating chat preview:', error);
    }
  };

  // Delete chat from local storage
  const deleteChatFromLocalStorage = async (chatId) => {
    try {
      // Delete chat
      const existingChats = await getChatsFromLocalStorage();
      const updatedChats = existingChats.filter(chat => chat.id !== chatId);
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedChats));
      
      // Delete messages
      const allMessages = await getMessagesFromLocalStorage();
      delete allMessages[chatId];
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));
      
      return true;
    } catch (error) {
      console.log('Error deleting chat from local storage:', error);
      return false;
    }
  };

  const retrieveChats = async () => {
    setLoading(true);
    try {
      // Try to get chats from backend first
      const backendResponse = await safeApiCall('GET', '/Chat');
      
      let allChats = [];

      if (backendResponse.success && backendResponse.data && backendResponse.data.length > 0) {
        // Transform backend data to match frontend format
        const backendChats = backendResponse.data.map(chat => ({
          id: chat._id || chat.id,
          date_created: chat.date_created || chat.createdAt,
          title: chat.title,
          preview: chat.preview,
          last_updated: chat.updatedAt || chat.date_created,
          source: 'backend'
        }));
        
        allChats = [...backendChats];
        
        console.log(`✅ Loaded ${backendChats.length} chats from backend`);
      } else {
        console.log('⚠️ No backend chats found, using local storage');
      }

      // Always include local chats as fallback
      const localChats = await getChatsFromLocalStorage();
      const localOnlyChats = localChats.filter(chat => !isBackendChatId(chat.id));
      
      if (localOnlyChats.length > 0) {
        allChats = [...allChats, ...localOnlyChats];
        console.log(`✅ Loaded ${localOnlyChats.length} chats from local storage`);
      }

      // If no chats at all, create sample ones
      if (allChats.length === 0) {
        const sampleChats = [
          {
            id: generateLocalChatId(),
            date_created: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            title: 'Welcome to Mental Health Support',
            preview: 'Hello! How can I help you today?',
            last_updated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            source: 'local'
          }
        ];
        allChats = sampleChats;
        await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sampleChats));
        console.log('✅ Created sample chat');
      }

      // Remove duplicate chats and sort by last_updated
      const uniqueChats = removeDuplicateChats(allChats);
      const sortedChats = uniqueChats.sort((a, b) => {
        const dateA = new Date(a.last_updated || a.date_created);
        const dateB = new Date(b.last_updated || b.date_created);
        return dateB - dateA;
      });

      setChatData(sortedChats);
      console.log(`✅ Total unique chats loaded: ${sortedChats.length}`);

      // Save the unique chats back to local storage
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sortedChats));

    } catch (e) {
      console.log('❌ Error retrieving chats:', e);
      // Fallback to local storage only
      const localChats = await getChatsFromLocalStorage();
      const uniqueChats = removeDuplicateChats(localChats);
      const sortedChats = uniqueChats.sort((a, b) => {
        const dateA = new Date(a.last_updated || a.date_created);
        const dateB = new Date(b.last_updated || b.date_created);
        return dateB - dateA;
      });
      setChatData(sortedChats);
      console.log(`✅ Loaded ${sortedChats.length} unique chats from local storage (fallback)`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull to refresh handler
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    retrieveChats();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat? This will remove all messages in this conversation.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              let backendSuccess = false;
              
              // Only try to delete from backend if it's a backend chat
              if (isBackendChatId(id)) {
                const backendResponse = await safeApiCall('DELETE', `/Chat/${id}`);
                backendSuccess = backendResponse.success;
              }
              
              // Always delete from local storage
              const localSuccess = await deleteChatFromLocalStorage(id);
              
              if (backendSuccess || localSuccess) {
                Alert.alert("Success", "Chat deleted successfully.");
                retrieveChats();
              } else {
                Alert.alert("Error", "Failed to delete chat.");
              }
            } catch (e) {
              console.log(e);
              // Try local storage deletion as fallback
              const localSuccess = await deleteChatFromLocalStorage(id);
              if (localSuccess) {
                Alert.alert("Success", "Chat deleted from local storage.");
                retrieveChats();
              } else {
                Alert.alert("Error", "Failed to delete chat.");
              }
            }
          }
        }
      ]
    );
  };

  const makeVapiCall = async () => {
    const url = "https://api.vapi.ai/call";
    const token = "7e9e423d-5e35-4f99-86fd-d94dd0f5a532";
    const data = {
      assistantId: "d98095b5-6bf0-4bb0-9631-214660006c3c",
      phoneNumberId: "bff018f4-3a66-433b-89ba-37be59fc96ea",
      customer: {
        number: "+639934532573",
        name: "Mark",
      },
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);
      Alert.alert("Call Initiated", "The support call has been initiated.");
      return response.data;
    } catch (error) {
      console.error(
        "Error making API call:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("Call Failed", "Unable to initiate call. Please try again later.");
    }
  };

  // Function to create a new chat in both backend and local storage
  const createNewChat = async () => {
    try {
      let chatId;
      let chatToSave;

      // Try to save to backend first
      const backendResponse = await safeApiCall('POST', '/Chat', {
        title: 'New Conversation',
        preview: 'Start a new conversation...',
        type: 'mental_health'
      });

      if (backendResponse.success && backendResponse.data) {
        // Use backend chat
        chatId = backendResponse.data._id || backendResponse.data.id;
        chatToSave = {
          id: chatId,
          date_created: backendResponse.data.date_created || backendResponse.data.createdAt,
          title: backendResponse.data.title,
          preview: backendResponse.data.preview,
          last_updated: new Date().toISOString(),
          source: 'backend'
        };
        console.log('✅ Created new backend chat:', chatId);
      } else {
        // Fallback to local storage
        chatId = generateLocalChatId();
        chatToSave = {
          id: chatId,
          date_created: new Date().toISOString(),
          title: 'New Conversation',
          preview: 'Start a new conversation...',
          last_updated: new Date().toISOString(),
          source: 'local'
        };
        console.log('✅ Created new local chat:', chatId);
      }

      await saveChatToLocalStorage(chatToSave);
      
      // Initialize empty messages array for this chat
      await saveMessagesToLocalStorage(chatId, []);
      
      navigation.navigate("Chat", {
        isNew: true,
        chatId: chatId,
      });
    } catch (error) {
      console.log('❌ Error creating new chat:', error);
      // Use local storage as fallback
      const chatId = generateLocalChatId();
      const chatToSave = {
        id: chatId,
        date_created: new Date().toISOString(),
        title: 'New Conversation',
        preview: 'Start a new conversation...',
        last_updated: new Date().toISOString(),
        source: 'local'
      };
      await saveChatToLocalStorage(chatToSave);
      await saveMessagesToLocalStorage(chatId, []);
      navigation.navigate("Chat", {
        isNew: true,
        chatId: chatId,
      });
    }
  };

  return (
    <PaperProvider theme={theme}>
      {authState.isLoggedIn ? (
        <TouchableWithoutFeedback
          onPress={() => setPressOutside((prev) => prev + 1)}
        >
          <View style={styles.container}>
            <ElevatedButton text="Chat History" />
            
            {loading && !refreshing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8b5cf6" />
                <CustomText style={styles.loadingText}>Loading your conversations...</CustomText>
              </View>
            ) : (
              <ScrollView 
                style={styles.scrollView}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#8b5cf6"]}
                    tintColor="#8b5cf6"
                    title="Pull to refresh"
                    titleColor="#6b7280"
                  />
                }
                showsVerticalScrollIndicator={true}
              >
                <View style={styles.chatList}>
                  {chatData && chatData.length > 0 ? (
                    <>
                      <View style={styles.chatCountContainer}>
                        <CustomText style={styles.chatCountText}>
                          {chatData.length} conversation{chatData.length !== 1 ? 's' : ''}
                        </CustomText>
                        <TouchableOpacity
                          style={styles.refreshButton}
                          onPress={onRefresh}
                        >
                          <Ionicons name="refresh" size={16} color="#8b5cf6" />
                          <CustomText style={styles.refreshText}>Pull to refresh</CustomText>
                        </TouchableOpacity>
                      </View>
                      {chatData.map((item, index) => {
                        // Ensure unique key by combining ID and index as fallback
                        const uniqueKey = `${item.id}-${index}`;
                        
                        return (
                          <Animated.View 
                            entering={FadeInLeft} 
                            key={uniqueKey}
                          >
                            <ChatLogBar
                              chatLogNum={item.id}
                              date={item.last_updated || item.date_created}
                              title={item.title}
                              preview={item.preview}
                              pressOutside={pressOutside}
                              handleDelete={handleDelete}
                              handlePress={() => {
                                navigation.navigate("Chat", {
                                  isNew: false,
                                  chatId: item.id,
                                });
                              }}
                            />
                          </Animated.View>
                        );
                      })}
                    </>
                  ) : (
                    <View style={styles.emptyState}>
                      <Ionicons name="chatbubble-outline" size={64} color="#9ca3af" />
                      <CustomText style={styles.emptyTitle}>No conversations yet</CustomText>
                      <CustomText style={styles.emptyText}>
                        Start a new conversation to get mental health support
                      </CustomText>
                      <TouchableOpacity
                        style={styles.refreshHintButton}
                        onPress={onRefresh}
                      >
                        <Ionicons name="refresh-circle" size={20} color="#8b5cf6" />
                        <CustomText style={styles.refreshHintText}>Pull down to refresh</CustomText>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}

            {/* Floating Action Buttons - Bottom Right Corner */}
            <View style={styles.floatingButtons}>
              {/* Call Button */}
              <TouchableOpacity
                style={[styles.floatingButton, styles.callButton]}
                onPress={makeVapiCall}
              >
                <MaterialIcons name="call" size={24} color="white" />
              </TouchableOpacity>

              {/* New Chat Button */}
              <TouchableOpacity
                style={[styles.floatingButton, styles.chatButton]}
                onPress={createNewChat}
              >
                <Ionicons name="chatbubble-ellipses" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.loginRequired}>
          <CustomText>You need to be logged in to view this page.</CustomText>
        </View>
      )}
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rem(8),
    backgroundColor: '#fafafa',
  },
  scrollView: {
    flex: 1,
  },
  chatList: {
    paddingHorizontal: rem(8),
    gap: rem(16),
    marginBottom: rem(16),
    marginTop: rem(16),
  },
  chatCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rem(8),
    marginBottom: rem(8),
  },
  chatCountText: {
    fontSize: rem(12),
    color: '#6b7280',
    fontStyle: 'italic',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: rem(8),
    paddingVertical: rem(4),
    borderRadius: rem(6),
  },
  refreshText: {
    fontSize: rem(10),
    color: '#8b5cf6',
    marginLeft: rem(4),
    fontWeight: '500',
  },
  loginRequired: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fafafa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: rem(16),
  },
  loadingText: {
    fontSize: rem(14),
    color: '#6b7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: rem(40),
    gap: rem(16),
  },
  emptyTitle: {
    fontSize: rem(18),
    fontWeight: "600",
    color: '#374151',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: rem(14),
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: rem(20),
  },
  refreshHintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: rem(12),
    paddingVertical: rem(6),
    borderRadius: rem(8),
    marginTop: rem(8),
  },
  refreshHintText: {
    fontSize: rem(12),
    color: '#8b5cf6',
    marginLeft: rem(6),
    fontWeight: '500',
  },
  // Floating Action Buttons
  floatingButtons: {
    position: "absolute",
    bottom: 30,
    right: 20,
    alignItems: "flex-end",
    gap: 15,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatButton: {
    backgroundColor: "#8b5cf6",
  },
  callButton: {
    backgroundColor: "#ef4444",
  },
});

export default Messages;