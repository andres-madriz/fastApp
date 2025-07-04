import { useState } from 'react';
import { router, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // or MaterialIcons if you prefer
import { Text, TextInput, View, Pressable } from 'react-native';

import { useSession } from '@/contexts';

/**
 * SignUp component handles new user registration
 * @returns {JSX.Element} Sign-up form component
 */
export default function SignUp() {
  // ============================================================================
  // Hooks & State
  // ============================================================================

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useSession();

  // ============================================================================
  // Handlers
  // ============================================================================

  /**
   * Handles the registration process
   * @returns {Promise<Models.User<Models.Preferences> | null>}
   */
  const handleRegister = async () => {
    setRegisterError(null);
    // Client-side validation
    if (password.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return null;
    }
    try {
      return await signUp(email, password, name);
    } catch (err: unknown) {
      // Safe check for Firebase error object
      if (err && typeof err === 'object') {
        if ('code' in err && typeof (err as any).code === 'string') {
          const code = (err as any).code;
          // Use code as you want
          if (code === 'auth/weak-password') {
            setRegisterError('Password must be at least 6 characters.');
          } else if (code === 'auth/email-already-in-use') {
            setRegisterError('That email is already registered.');
          } else {
            setRegisterError((err as any).message || 'Could not register. Please try again.');
          }
        } else if ('message' in err && typeof (err as any).message === 'string') {
          setRegisterError((err as any).message);
        } else {
          setRegisterError('Could not register. Please try again.');
        }
      } else {
        setRegisterError('Could not register. Please try again.');
      }
      return null;
    }
  };

  /**
   * Handles the sign-up button press
   */
  const handleSignUpPress = async () => {
    const resp = await handleRegister();
    if (resp) {
      router.replace('/(app)/(drawer)/(tabs)/');
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <View className="flex-1 justify-center items-center p-4">
      {/* Welcome Section */}
      <View className="items-center mb-8">
        <Text className="text-2xl font-bold text-gray-800 mb-2">Create Account</Text>
        <Text className="text-sm text-gray-500">Sign up to get started</Text>
      </View>

      {/* Form Section */}
      <View className="w-full max-w-[300px] space-y-4 mb-8">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Name</Text>
          <TextInput
            placeholder="Your full name"
            value={name}
            onChangeText={setName}
            textContentType="name"
            autoCapitalize="words"
            className="w-full p-3 border border-gray-300 rounded-lg text-base bg-white"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Email</Text>
          <TextInput
            placeholder="name@mail.com"
            value={email}
            onChangeText={setEmail}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full p-3 border border-gray-300 rounded-lg text-base bg-white"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Password</Text>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <TextInput
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              textContentType="newPassword"
              className="flex-1 w-full p-3 border border-gray-300 rounded-lg text-base bg-white"
            />
            <Pressable
              onPress={() => setShowPassword(p => !p)}
              style={{ marginLeft: 6 }}
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#687076" />
            </Pressable>
          </View>
        </View>
        {/* Error Message */}
        {registerError ? <Text className="text-red-500 mt-1 text-sm">{registerError}</Text> : null}
      </View>

      {/* Sign Up Button */}
      <Pressable
        onPress={handleSignUpPress}
        className="bg-blue-600 w-full max-w-[300px] py-3 rounded-lg active:bg-blue-700"
      >
        <Text className="text-white font-semibold text-base text-center">Sign Up</Text>
      </Pressable>

      {/* Sign In Link */}
      <View className="flex-row items-center mt-6">
        <Text className="text-gray-600">Already have an account?</Text>
        <Link href="/sign-in" asChild>
          <Pressable className="ml-2">
            <Text className="text-blue-600 font-semibold">Sign In</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
