import { FlatList, Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { icons } from '@/constants';
import { ResizeMode, Video, AVPlaybackStatus } from 'expo-av';

// Define the Document type based on your Appwrite schema
interface Document {
  $id: string;
  title: string;
  thumbnail: string;
  prompt: string;
  video: string;
}

const zoomIn: Animatable.CustomAnimation = {
  0: {
    transform: [{ scale: 0.9 }]
  },
  1: {
    transform: [{ scale: 1.1 }]
  }
};

const zoomOut: Animatable.CustomAnimation = {
  0: {
    transform: [{ scale: 1 }]
  },
  1: {
    transform: [{ scale: 0.9 }]
  }
};

const TrendingItem = ({ activeItem, item }: { activeItem: any, item: Document }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className='mr-5'
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video 
          source={{uri: item.video}}
          className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if (status.isLoaded && status.didJustFinish) {
              setPlay(false)
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className='relative justify-center items-center'
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
            resizeMode='cover'
          />

          <Image
            source={icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
}

const Trending = ({ posts }: { posts: Document[] | null }) => {
  if (!posts) return null;
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanged = ({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].item.$id);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      horizontal
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70
      }}
      contentOffset={{ x: 170, y: 0 }} // Ensure both x and y properties are present
    />
  );
}

export default Trending;
