import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '@/auth/AuthContext';

export default function Profile() {
  const { user, signOut } = useAuth();
  return (
    <View style={s.c}>
      <Text style={s.h1}>{user?.first_name} {user?.last_name}</Text>
      <Text style={s.email}>{user?.email}</Text>
      <Text style={s.meta}>Role: {user?.role ?? (user?.is_staff ? 'staff' : 'client')}</Text>
      <Pressable style={s.btn} onPress={signOut}>
        <Text style={s.btnText}>Sign out</Text>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, padding: 24, gap: 8, backgroundColor: '#fff' },
  h1: { fontSize: 24, fontWeight: '700' },
  email: { color: '#444' },
  meta: { color: '#666' },
  btn: { backgroundColor: '#dc2626', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  btnText: { color: '#fff', fontWeight: '600' },
});
