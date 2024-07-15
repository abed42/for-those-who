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
import { RefObject, useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import fetchWrapper from "@/utils/fetchWrapper";

type AssistantChatType = {
  action: string;
  actionSheetRef: RefObject<any>;
};

type MessageType = {
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
  actionSheetRef,
}: AssistantChatType) {
  const scrollViewRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [threadId, setThreadId] = useState<string>();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [text, setText] = useState<string>(action ? action : "");

  const sendMessage = async () => {
    // send temp message
    setMessages([...messages, { id: "tempId", message: text, role: "user" }]);
    setText("");

    const body = JSON.stringify({
      //TODO: implement auth on the route
      uniqueId: "BM3CDA7ATU1E6",
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
      //TODO: implement auth on the route
      uniqueId: "BM3CDA7ATU1E6",
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

  return (
    <View style={styles.layout}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Assistant Chat</Text>
        <TouchableOpacity
          style={styles.close}
          onPress={() => actionSheetRef.current?.hide()}
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
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              message={message.message}
            />
          ))}
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
        <TouchableOpacity
          style={text ? styles.button : styles.buttonDisabled}
          disabled={text.length === 0}
          onPress={sendMessage}
        >
          <FontAwesome name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
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
  buttonDisabled: {
    opacity: 0.5,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#0029FF",
  },
});
