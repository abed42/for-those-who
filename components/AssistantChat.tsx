import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import fetchWrapper from "@/utils/fetchWrapper";
import { uniqueId } from "@/constants/UniqueId";
import ChatClues from "./ChatClues";
import * as SecureStore from "expo-secure-store";
import { Categories } from "@/constants/Categories";
import Spinner from "react-native-loading-spinner-overlay";
import "react-native-get-random-values";
import { nanoid } from "nanoid";

type AssistantChatType = {
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
  setIsModalVisible,
}: AssistantChatType) {
  const scrollViewRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [blocked, setBlocked] = useState<boolean>(false);
  const [threadId, setThreadId] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatClues, setChatClues] = useState<any>();
  const [text, setText] = useState<string>("");
  const [loadingClues, setLoadingClues] = useState<boolean>(false);
  const [assistantTyping, setAssistantTyping] = useState<boolean>(false);
  const getChatClues = async () => {
    setBlocked(true);
    const body = JSON.stringify({
      threadId,
      uniqueId,
    });
    try {
      const response: MessageType[] = await fetchWrapper(
        "/assistant/retrieve-clues",
        { method: "POST", body }
      );

      return response;
    } catch (e) {
      console.log(e);
    } finally {
      setBlocked(false);
    }
  };

  const exitChat = async () => {
    Keyboard.dismiss();
    setLoadingClues(true);

    const clues = await getChatClues();

    // clues are saved inside a json string
    if (clues) {
      setChatClues(JSON.parse(clues[0].message));
      setLoadingClues(false);
    }

    setMessages([
      ...messages,
      {
        id: nanoid(),
        message: "You have chosen to exit the chat",
        role: "assistant",
      },
      {
        id: nanoid(),
        message:
          "Based on our conversation today, we gathered more relevant information for your feed",
        role: "assistant",
      },
    ]);
  };

  const sendMessage = async () => {
    setChatClues(undefined); // hide clues component on send message
    setBlocked(true);
    setAssistantTyping(true);
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
      setBlocked(false);
      setLoading(false);
      setAssistantTyping(false);
    }
  };

  const initiateAssistant = async () => {
    setBlocked(true);
    const userId = await SecureStore.getItemAsync("userId");

    const body = JSON.stringify({
      userId,
      uniqueId,
      category: Categories.CHANGE_CLUES,
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
      setBlocked(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    initiateAssistant();
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      if (scrollViewRef.current) scrollViewRef.current.scrollToEnd();
    });

    return () => {
      showSubscription.remove();
    };
  }, [scrollViewRef]);

  return (
    <View style={[styles.layout]}>
      <Spinner visible={loadingClues} color="#0029FF" size={"large"} />
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
        <Spinner
          visible={loading}
          color="#0029FF"
          size={"large"}
          overlayColor="transparent"
        />
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
            {assistantTyping && <Text style={styles.typing}>Typing...</Text>}
            {chatClues && (
              <ChatClues
                clues={chatClues}
                setClues={setChatClues}
                threadId={threadId}
                setIsModalVisible={setIsModalVisible}
              />
            )}
          </>
        </ScrollView>
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          onChangeText={setText}
          placeholder="Start typing or end the conversation..."
          placeholderTextColor="#979BB1"
          value={text}
          style={styles.input}
        />
        {text ? (
          <TouchableOpacity
            style={
              text.length === 0 || blocked
                ? styles.buttonDisabled
                : styles.button
            }
            disabled={text.length === 0 || blocked}
            onPress={sendMessage}
          >
            <FontAwesome name="send" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={
              blocked || !!chatClues
                ? styles.exitButtonDisabled
                : styles.exitButton
            }
            onPress={exitChat}
            disabled={blocked || !!chatClues}
          >
            <Ionicons name="exit" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    height: "100%",
    position: "relative",
  },
  typing: {
    padding: 12,
    color: "gray",
    fontStyle: "italic",
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
  buttonDisabled: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#0029FF",
    opacity: 0.5,
  },
  exitButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#F9325D",
  },
  exitButtonDisabled: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#F9325D",
    opacity: 0.5,
  },
});
