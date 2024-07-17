import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import fetchWrapper from "@/utils/fetchWrapper";
import { uniqueId } from "@/constants/UniqueId";
import ChatClues from "./ChatClues";
import Animated, { useAnimatedKeyboard,useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

type AssistantChatType = {
  action: string;
  setIsModalVisible: (isVisible: boolean) => void;
};

export type MessageType = {
  role: string;
  message: string;
  id: string;
};

type InitializeMessageResponseType = {
  threadId: string;
  messages: MessageType[];
};

export default function AssistantChat({
  action,
  setIsModalVisible,
}: AssistantChatType) {
  const scrollViewRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [threadId, setThreadId] = useState<string>();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatClues, setChatClues] = useState<MessageType[]>([]);
  const [text, setText] = useState<string>(action ? action : "");

  const getChatClues = async () => {
    const body = JSON.stringify({ threadId, uniqueId });
    try {
      const response: MessageType[] = await fetchWrapper(
        "/assistant/retrieve-clues",
        { method: "POST", body }
      );

      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const exitChat = async () => {
    const clues: any = await getChatClues();
    console.log(clues.legnth);

    setChatClues(clues);

    setMessages([
      ...messages,
      {
        id: "tempId1",
        message: "You have chosen to exit the chat",
        role: "assistant",
      },
      {
        id: "tempId2",
        message:
          "Based on our conversation today, we gathered more relevant information for your feed",
        role: "assistant",
      },
    ]);
  };

  const sendMessage = async () => {
    // send temp message
    setMessages([...messages, { id: "tempId", message: text, role: "user" }]);
    setText("");

    const body = JSON.stringify({
      //TODO: implement auth on the route
      uniqueId,
      threadId,
      message: text,
    });

    try {
      const result: MessageType[] = await fetchWrapper(
        "/assistant/send-message",
        {
          method: "POST",
          body,
        }
      );
      setMessages(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const initiateAssistant = async () => {
    const body = JSON.stringify({
      uniqueId,
    });

    try {
      const result: InitializeMessageResponseType = await fetchWrapper(
        "/assistant/initialize-thread",
        {
          method: "POST",
          body,
        }
      );
      setMessages(result.messages);
      setThreadId(result.threadId);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initiateAssistant();
  }, []);

  useEffect(() => {
    let timeoutId: number;
    // if an action is set, send it as a message with 1s delay
    if (action && threadId) {
      timeoutId = window.setTimeout(() => {
        sendMessage();
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [action, threadId]);
  const keyboard = useAnimatedKeyboard();

  const animatedStyles = useAnimatedStyle(() => ({
    bottom: keyboard.height.value
  }));

  return (
    <View style={styles.layout}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Assistant Chat</Text>
        <TouchableOpacity
          style={styles.close}
          onPress={() => setIsModalVisible(false)}
          >
          <AntDesign name="close" size={20} color="#0029FF" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={{ padding: 20 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 92,
          }}
          style={styles.messages}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                message={message.message}
              />
            ))}
            {chatClues.length > 0 && <ChatClues clues={chatClues} />}
          </>
        </ScrollView>
      )}

      <Animated.View style={[styles.inputWrapper, animatedStyles]}>
        <TextInput
          onChangeText={setText}
          placeholder="Start typing or end the conversation..."
          placeholderTextColor="#979BB1"
          value={text}
          style={styles.input}
        />
        {text ? (
          <TouchableOpacity
            style={styles.button}
            disabled={text.length === 0}
            onPress={sendMessage}
          >
            <FontAwesome name="send" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.exitButton} onPress={exitChat}>
            <Ionicons name="exit" size={20} color="white" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    height: "100%",
    position: "relative",
    },
  header: {
    padding: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  close: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FAFF",
    padding: 8,
    borderRadius: 4,
  },
  messages: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 4,
    borderTopColor: "#979BB180",
    borderTopWidth: 1,
    width: "100%",
    maxHeight: 100,
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    padding: 16,
    paddingLeft: 0,
  },
  input: {
    padding: 16,
    flex: 1,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#0029FF",
  },
  exitButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#F9325D",
  },
});
