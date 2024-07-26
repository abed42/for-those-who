import Article from "@/components/Article";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

import { ActivityIndicator, FlatList, Text, View } from "react-native";
import fetchWrapper from "@/utils/fetchWrapper";

type ArticleResponseType = {
  count: number;
  rows: ArticleExtendedModel[];
};

const Feed = () => {
  const PER_PAGE = 10;
  const [isLoading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ArticleExtendedModel[]>([]);
  const [offset, setOffset] = useState<number>(0);

  const getArticles = async () => {
    const token = await SecureStore.getItemAsync("token");
    const userId = await SecureStore.getItemAsync("userId");

    try {
      const response: ArticleResponseType = await fetchWrapper(
        `/users/${userId}/articles?offset=${offset}&limit=${PER_PAGE}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      setData([...data, ...response.rows]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // fetch articles at the end of the list
  useEffect(() => {
    getArticles();
  }, [offset]);

  return (
    <SafeAreaView style={styles.layout}>
      {isLoading ? (
        <ActivityIndicator style={styles.footer} />
      ) : (
        <FlatList
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.stories}>Stories for you</Text>
              <Text style={styles.subHead}>
                Picked based on the clues you shared
              </Text>
            </View>
          }
          data={data}
          keyExtractor={({ ArticleId }) => ArticleId}
          onEndReached={() => setOffset((offset: number) => offset + PER_PAGE)}
          onEndReachedThreshold={0.8}
          ListFooterComponent={<ActivityIndicator />}
          renderItem={({ item }) => (
            <View>
              <Article article={item} />
              <View style={styles.separator}></View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 24,
  },
  stories: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 30,
  },
  subHead: {
    fontSize: 18,
    marginBottom: 30,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "100%",
    backgroundColor: "#F9F7F7",
  },
  footer: {
    marginTop: 42,
  },
});

export default Feed;
