import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import { searchPosts } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard';
import { useLocalSearchParams } from 'expo-router';

// Define the Document type based on your Appwrite schema
interface Document {
  $id: string;
  title: string;
  thumbnail: string;
  prompt: string;
  video: string;
  creator: {
    username: string;
    avatar: string;
  };
}

const Search = () => {
  const { query } = useLocalSearchParams();
  const searchQuery = typeof query === 'string' ? query : ''; // Chuyển đổi query thành string

  const { data: posts, refetch } = useAppwrite<Document[]>(() => searchPosts(searchQuery));

  useEffect(() => {
    refetch()
  }, [searchQuery]);

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}  // Chuyển đổi $id thành chuỗi
        renderItem={({ item }) => (
          <VideoCard
            video={item}
          />
        )}
        ListHeaderComponent={() => (
          <View className='my-6 px-4'>
            <Text className='font-pmedium text-sm text-gray-100'>
              Search Results
            </Text>
            <Text className='text-2xl font-psemibold text-white'>
              {searchQuery}
            </Text>
            <View className='mt-6 mb-8'>
              <SearchInput initialQuery={searchQuery} title={''} value={undefined} placeholder={undefined} handleChangeText={undefined} otherStyles={undefined} keyboardType={undefined} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
}

export default Search;

const styles = StyleSheet.create({});
