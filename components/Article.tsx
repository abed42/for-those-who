import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import fetchWrapper from "@/utils/fetchWrapper";

import { uniqueId } from "@/constants/UniqueId";
import { Categories } from "@/constants/Categories";
import Action from "./Action";
import { AntDesign } from "@expo/vector-icons";
import { AssistantArticleContext } from "@/app/contexts/AssistantArticleContext";
import { AssistantModalContext } from "@/app/contexts/AssistantModalContext";
export type MessageType = {
  role: string;
  message: string | any;
  id: string;
};
type InitializeMessageResponseType = {
  threadId: string;
  messages: MessageType[];
};
type ReasoningData = {
  Reasoning: string[];
};

type CluesType = {
  cluesToBeAdded: { clue: string; id: string }[];
  cluesToBeRemoved: { clue: string; id: string }[];
  cluesToRemain: { clue: string; id: string }[];
};
const removeSpecialChars = (text: string) =>
  text.replaceAll("\n", "").replaceAll("\t", "");

const LinkSvg = () => {
  return (
    <Svg style={styles.linkSvg} viewBox="0 0 640 512">
      <Path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
    </Svg>
  );
};

const ArrowSvg = () => {
  return (
    <Svg style={styles.actionSvg} viewBox="0 0 500 500">
      <Path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
    </Svg>
  );
};

const LikeSvg = ({ style }: { style: any }) => {
  return (
    <Svg style={style} viewBox="0 0 512 512">
      <Path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z" />
    </Svg>
  );
};
const DislikeSvg = ({ style }: { style: any }) => {
  return (
    <Svg style={styles.actionSvg} viewBox="0 0 512 512">
      <Path d="M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16l-97.5 0c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8L384 32c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32L0 128c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0z" />
    </Svg>
  );
};

const BookmarkSvg = () => {
  return (
    <Svg style={styles.actionSvg} viewBox="0 0 384 512">
      <Path d="M0 48C0 21.5 21.5 0 48 0l0 48 0 393.4 130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4 336 48 48 48 48 0 336 0c26.5 0 48 21.5 48 48l0 440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488L0 48z" />
    </Svg>
  );
};
interface FeedbackHeaderProps {
  closeAction: () => void;
}

const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({ closeAction }) => {
  return (
    <View style={styles.feedbackHeader}>
      <View style={styles.feedbackHeaderIcon}>
        <LikeSvg style={styles.secondaryLikedBtn} />
      </View>

      <Text style={{ width: "80%" }}>
        You seem to like this piece of reading. Tell me why, so we can get to
        know you better.
      </Text>

      <TouchableOpacity style={styles.close} onPress={closeAction}>
        <AntDesign name="close" size={20} color="#0029FF" />
      </TouchableOpacity>
    </View>
  );
};

export default function Article({
  article,
}: {
  article: ArticleExtendedModel;
}) {
  const [reasoning, setReasoning] = useState<ReasoningData>({ Reasoning: [] });
  const [feedbackLoading, setFeedbackLoading] = useState<boolean>(false);

  const [_, setMessages] = useState<MessageType[]>([]);
  const [showFeedbackReasoning, setShowFeedbackReasoning] =
    useState<boolean>(false);
  const { setIsModalVisible } = useContext(AssistantModalContext);
  const { setArticle, threadId, setThreadId } = useContext(
    AssistantArticleContext
  );

  const updateProfile = async (clues: CluesType) => {
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

      setShowFeedbackReasoning(false);
    } catch (err) {
      console.log(err);
    }
  };
  const getClues = async () => {
    const body = JSON.stringify({
      threadId,
      uniqueId,
    });
    try {
      const response: MessageType[] = await fetchWrapper(
        "/assistant/retrieve-clues",
        { method: "POST", body }
      );

      await updateProfile(JSON.parse(response[0].message));
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async (message: string) => {
    const body = JSON.stringify({
      uniqueId,
      threadId,
      message,
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
      await getClues();
    } catch (err) {
      console.log(err);
    }
  };

  const initializeThread = async ({ positive }: { positive: boolean }) => {
    setFeedbackLoading(true);
    const userId = await SecureStore.getItemAsync("userId");

    const body = JSON.stringify({
      userId,
      uniqueId,
      category: positive ? Categories.LIKE : Categories.DISLIKE,
      articleId: article.ArticleId,
    });

    try {
      const result: InitializeMessageResponseType = await fetchWrapper(
        "/assistant/initialize-thread",
        {
          method: "POST",
          body,
        }
      );
      // the value of message in the message array returns a json string, so we need to parse it even tho the fetch wrapper parses the response
      setReasoning(JSON.parse(result.messages[0].message));
      setThreadId(result.threadId);
      setShowFeedbackReasoning(true);
    } catch (err) {
      console.log(err);
    } finally {
      setFeedbackLoading(false);
    }
  };
  const handlePressButtonAsync = async () => {
    await WebBrowser.openBrowserAsync(article.Article.link);
  };

  const handleLike = async () => {
    await initializeThread({ positive: true });
  };

  const handleDislike = async () => {
    await initializeThread({ positive: false });
  };

  const handleBookmark = async () => {
    console.log("i want to bookmark this article");
  };
  const handleShare = async () => {
    await Share.share({
      message: article.Article.link,
    });
  };
  return (
    <View style={styles.article}>
      <View style={styles.container}>
        <Text
          onPress={handlePressButtonAsync}
          style={styles.title}
          numberOfLines={4}
        >
          {article.Article.title}
        </Text>
        {article.Article.imageUrl && (
          <Image
            style={styles.image}
            source={{ uri: article.Article.imageUrl }}
          />
        )}
      </View>
      <Text numberOfLines={4}>
        {removeSpecialChars(article.Article.content)}
      </Text>
      <View style={styles.actions}>
        {article.Article.Source?.name ? (
          <TouchableOpacity
            style={styles.link}
            onPress={handlePressButtonAsync}
          >
            <LinkSvg />
            <Text style={styles.linkText}>{article.Article.Source?.name}</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.share}>
          <LikeSvg
            style={article?.isLiked ? styles.likedBtn : styles.actionSvg}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDislike} style={styles.share}>
          <DislikeSvg style={styles.actionSvg} />
        </TouchableOpacity>
        <View style={styles.verticalLine}></View>
        <TouchableOpacity
          disabled
          onPress={handleBookmark}
          style={styles.share}
        >
          <BookmarkSvg />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.share}>
          <ArrowSvg />
        </TouchableOpacity>
      </View>
      {feedbackLoading && <ActivityIndicator />}
      {showFeedbackReasoning && (
        <View style={styles.feedback}>
          <FeedbackHeader closeAction={() => setShowFeedbackReasoning(false)} />
          <View style={styles.feedbackActions}>
            {reasoning.Reasoning.map((reason, index) => (
              <Action
                key={index}
                action={async () => await sendMessage(reason)}
              >
                {reason}
              </Action>
            ))}
            <Action
              // to do open the modal and provide threadID & article obj
              key="talk-to-assistant"
              action={() => {
                setIsModalVisible(true);
                setArticle(article.Article);
                setShowFeedbackReasoning(false);
              }}
            >
              Let me chat with my assistant
            </Action>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  article: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
    marginTop: 20,
  },
  title: {
    fontFamily: "SourseSerif4",
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  image: {
    width: 82,
    height: 82,
    borderRadius: 16,
  },
  actions: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    alignItems: "center",
  },
  link: {
    width: "auto",
    backgroundColor: "#F5FAFF",
    padding: 8,
    borderRadius: 30,
    alignSelf: "flex-start",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    color: "#0029FF",
    fontWeight: "bold",
  },
  linkSvg: {
    //@ts-ignore
    fill: "#0029FF",
    width: 20,
    height: 20,
    marginRight: 8,
  },
  share: {
    borderWidth: 1,
    display: "flex",
    alignItems: "center",
    padding: 8,
    borderColor: "#F9F7F7",
    borderRadius: 50,
  },
  actionSvg: {
    //@ts-ignore
    fill: "#979BB1",
    width: 16,
    height: 16,
  },
  likedBtn: {
    //@ts-ignore
    fill: "#0029FF",
    width: 16,
    height: 16,
  },
  secondaryLikedBtn: {
    //@ts-ignore
    //@ts-ignore
    fill: "white",
    width: 16,
    height: 16,
    backgroundColor: "#0029FF",
  },
  dislikedBtn: {
    //@ts-ignore
    fill: "#979BB1",
    width: 16,
    height: 16,
  },
  verticalLine: {
    height: "100%",
    width: 1,
    backgroundColor: "#F9F7F7",
  },
  feedback: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5FAFF",
    padding: 16,
    gap: 12,
    borderRadius: 12,
  },
  feedbackHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  feedbackHeaderIcon: {
    backgroundColor: "#0029FF",
    display: "flex",
    alignItems: "center",
    padding: 8,
    borderRadius: 50,
    marginLeft: 16,
  },
  feedbackActions: {
    display: "flex",
    flexDirection: "column",
    gap: 12,

    width: "80%",
  },
  close: {
    paddingRight: 16,
    paddingLeft: 6,
  },
});
