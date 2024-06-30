import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '@/lib/appwrite'
import { useGlobalContext, User } from '@/context/GlobalProvider'

const SignIn = () => {
  const context = useGlobalContext();

  if (!context) {
    // You can return a loading state or handle the absence of context here
    return null;
  }

  const { setUser, setIsLoggedIn } = context; // Trích xuất setUser và setIsLoggedIn từ context

  const [form, setform] = useState({
    email: '',
    password: ''
  })

  const [isSubmitting, setisSubmitting] = useState(false)

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields')
      return
    }
    setisSubmitting(true);
    try {
      await signIn(form.email, form.password)
      const result = await getCurrentUser();

      if (result) {
        const user: User = {
          $id: result.$id,
          accountId: result.accountId,
          email: result.email,
          username: result.username,
          avatar: result.avatar,
          // Thêm các trường khác nếu cần
        };
        setUser(user);
        setIsLoggedIn(true);
        router.replace('/home')
      } else {
        Alert.alert('Error', 'Unable to get user data')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message)
      } else {
        Alert.alert('Error', 'An unknown error occurred')
      }
    } finally {
      setisSubmitting(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[83vh] px-4 my-6'>
          <Image source={images.logo} resizeMode='contain' className='w-[115px] h-[35px]' />
          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
            Log in to Aora
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: any) => setform({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address" placeholder={undefined} />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: any) => setform({ ...form, password: e })}
            otherStyles="mt-7"
            keyboardType="email-address" placeholder={undefined} />

          <CustomButton
            title='Sign in'
            handlePress={submit}
            containerStyles={`mt-7`}
            isLoading={isSubmitting} textStyles={undefined} />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Don't have account?
            </Text>
            <Link href={`/sign-up`} className='text-lg font-psemibold text-secondary'>
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn

const styles = StyleSheet.create({})
