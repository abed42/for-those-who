import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { RefObject, useState } from "react";
import ChatMessage from "./ChatMessage";

type AssistantChatType = {
  actionSheetRef: RefObject<any>;
};

export default function AssistantChat({ actionSheetRef }: AssistantChatType) {
  const [text, onChangeText] = useState<any>(null);

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
      <ScrollView style={{ padding: 20 }}>
        <ChatMessage
          role={"assistant"}
          message={
            "Hey there! I’m your AI assistant, ready to help you get the most relevant content."
          }
        />
        <ChatMessage
          role={"assistant"}
          message={"How can I assist you today?"}
        />

        <ChatMessage
          role={"user"}
          message={"I want to change some of my clues"}
        />
      </ScrollView>
      <View style={styles.inputWrapper}>
        <TextInput
          onChangeText={onChangeText}
          placeholder="Start typing or end the conversation..."
          placeholderTextColor="#979BB1"
          value={text}
          style={styles.input}
        />
        <TouchableOpacity
          style={text ? styles.button : styles.buttonDisabled}
          disabled={true}
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
  },
  input: {
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
