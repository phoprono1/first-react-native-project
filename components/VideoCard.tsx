import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants'
import { AVPlaybackStatus, ResizeMode, Video as ExpoVideo } from 'expo-av';

// Định nghĩa kiểu dữ liệu cho đối tượng creator
interface Creator {
    username: string;
    avatar: string;
}

// Định nghĩa kiểu dữ liệu cho đối tượng video
interface Video {
    title: string;
    thumbnail: string;
    video: string;
    creator: Creator; // Sử dụng Creator ở đây
}

const VideoCard = ({ video }: { video: Video }) => {
    const [play, setPlay] = useState(false)
    const { title, thumbnail, creator } = video;
    const { username, avatar } = creator;

    return (
        <View className='flex-col items-center px-4 mb-14'>
            <View className='flex-grow gap-3 items-center flex-row flex-1'>
                <View className='justify-center items-center flex-row flex-1'>
                    <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center item-center p-0.5'>
                        <Image
                            source={{ uri: avatar }}
                            className='w-full h-full rounded-lg'
                            resizeMode='cover'
                        />
                    </View>
                    <View className='justify-center flex-1 ml-3 gap-y-1'>
                        <Text className='text-xs text-gray-100 font-psemibold' numberOfLines={1}>
                            {title}
                        </Text>
                        <Text className='text-xs text-gray-100 font-regular' numberOfLines={1}>
                            {username}
                        </Text>
                    </View>
                </View>
                <View className='pt-2'>
                    <Image source={icons.menu} className='w-5 h-5' resizeMode='contain' />
                </View>
            </View>
            {play ? (
                <ExpoVideo 
                source={{uri: video.video}}
                className='w-full h-60 rounded-xl mt-3'
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
                <TouchableOpacity className='w-full h-60 rounded-xl mt-3 relative justify-center items-center' activeOpacity={0.7} onPress={() => setPlay(true)}>
                    <Image
                        source={{ uri: thumbnail }}
                        className='w-full h-full rounded-xl mt-3'
                        resizeMode='cover'
                    />
                    <Image
                        source={icons.play}
                        className='w-12 h-12 absolute'
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default VideoCard;
