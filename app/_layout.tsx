import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Somente /login é público
  const publicRoutes = ['/login'];

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem('loggedIn');

        if (loggedIn !== 'true' && !publicRoutes.includes(pathname)) {
          router.replace('/login');
          return;
        }

        if (loggedIn === 'true' && pathname === '/login') {
          router.replace('/books');
          return;
        }

      } catch (error) {
        console.error('Erro ao verificar login:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerTitle: 'Login', headerTitleAlign: 'center' }} />
      <Stack.Screen name="books" options={{ headerTitle: 'Lista de Livros', headerTitleAlign: 'center' }} />
      <Stack.Screen name="bookDetails" options={{ headerTitle: 'Detalhes do Livro' }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
