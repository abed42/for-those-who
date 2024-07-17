import { View, Text, StyleSheet } from "react-native";
import ChatMessage from "./ChatMessage";
import Action from "./Action";
import fetchWrapper from "@/utils/fetchWrapper";
import * as SecureStore from "expo-secure-store";
import { Categories } from "@/constants/Categories";
import { uniqueId } from "@/constants/UniqueId";

type CluesType = {
  cluesToBeAdded: { clue: string; id: string }[];
  cluesToBeRemoved: { clue: string }[];
  cluesToRemain: { clue: string; id: string }[];
};

export default function ChatClues({
  clues,
  setClues,
  threadId,
  setIsModalVisible,
}: {
  clues: CluesType;
  setClues: (clues?: CluesType) => void;
  threadId: string;
  setIsModalVisible: (isVisible: boolean) => void;
}) {
  const updateProfile = async () => {
    const userId = await SecureStore.getItemAsync("userId");

    const body = JSON.stringify({
      userId,
      uniqueId,
      threadId,
      category: Categories.CHANGE_CLUES,
      cluesToBeAdded: clues.cluesToBeAdded,
      cluesToBeRemoved: clues.cluesToBeRemoved,
    });

    try {
      await fetchWrapper("/flows/user-signup", {
        method: "POST",
        body,
      });
      setIsModalVisible(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.layout}>
      <Text style={styles.title}>
        {clues.cluesToRemain.length} clue
        {clues.cluesToRemain.length > 1 ? "s" : ""} to remain
      </Text>
      {clues.cluesToRemain.map(({ id, clue }) => (
        <ChatMessage key={id} role={"assistant"} message={clue} />
      ))}
      {clues.cluesToBeAdded.length > 0 && (
        <Text style={styles.title}>
          {clues.cluesToBeAdded.length} clue
          {clues.cluesToBeAdded.length > 1 ? "s" : ""} to be added
        </Text>
      )}
      {clues.cluesToBeAdded.map(({ id, clue }) => (
        <ChatMessage key={id} role={"assistant"} message={clue} />
      ))}
      {clues.cluesToBeRemoved.length > 0 && (
        <Text style={styles.title}>
          {clues.cluesToBeRemoved.length} clue
          {clues.cluesToBeRemoved.length > 1 ? "s" : ""} to be removed
        </Text>
      )}
      {clues.cluesToBeRemoved.map(({ clue }, index) => (
        <ChatMessage key={index} role={"assistant"} message={clue} />
      ))}
      <Action action={updateProfile}>Yes update profile and close chat</Action>
      <View style={{ padding: 4 }}></View>
      <Action action={() => setClues(undefined)}>No, keep chatting</Action>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#D9EBFF",
  },
  title: {
    fontWeight: "bold",
    paddingBottom: 8,
  },
});
