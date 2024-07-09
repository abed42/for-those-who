import Article from "@/components/Article";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

import { ActivityIndicator, FlatList, Text, View } from "react-native";

const Articles = () => {
  const PER_PAGE = 10;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);

  const getArticles = async () => {
    const token = await SecureStore.getItemAsync("token");
    const userId = await SecureStore.getItemAsync("userId");

    try {
      const response = await fetch(
        `https://staging.forthosewho.com/v2/users/${userId}/articles?offset=${offset}&limit=${PER_PAGE}`,
        {
          headers: new Headers({
            Authorization: "Bearer " + token,
          }),
        }
      );
      const json = await response.json();
      setData([...data, ...json.rows]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getArticles();
  }, [offset]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
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

export default Articles;
