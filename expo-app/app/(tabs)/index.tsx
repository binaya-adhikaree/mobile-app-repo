import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/auth/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <View style={s.c}>
      <Text style={s.h1}>Hi {user?.first_name ?? user?.email}</Text>
      <Text style={s.sub}>Role: {user?.role ?? (user?.is_staff ? 'staff' : 'client')}</Text>
      <Text style={s.body}>Use the tabs below to manage documents, fill out forms, and view your subscription.</Text>
    </View>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, padding: 24, gap: 8, backgroundColor: '#fff' },
  h1: { fontSize: 26, fontWeight: '700' },
  sub: { color: '#666' },
  body: { marginTop: 12, fontSize: 16, lineHeight: 22 },
});
