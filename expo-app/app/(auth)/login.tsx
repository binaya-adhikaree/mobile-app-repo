import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try { await signIn(email.trim(), password); }
    catch (e: any) { Alert.alert('Login failed', e?.response?.data?.detail ?? e.message); }
    finally { setLoading(false); }
  };

  return (
    <View style={s.c}>
      <Text style={s.h1}>Welcome back</Text>
      <TextInput style={s.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Pressable style={s.btn} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Sign in</Text>}
      </Pressable>
      <Link href="/(auth)/register" style={s.link}>Create an account</Link>
      <Link href="/(auth)/forgot-password" style={s.link}>Forgot password?</Link>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, padding: 24, justifyContent: 'center', gap: 12, backgroundColor: '#fff' },
  h1: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16 },
  btn: { backgroundColor: '#111', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 8 },
});
