import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';

export default function Register() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try { await signUp({ email: email.trim(), password, first_name: first, last_name: last }); }
    catch (e: any) {
      const d = e?.response?.data;
      Alert.alert('Registration failed', typeof d === 'string' ? d : JSON.stringify(d ?? e.message));
    } finally { setLoading(false); }
  };

  return (
    <View style={s.c}>
      <Text style={s.h1}>Create account</Text>
      <TextInput style={s.input} placeholder="First name" value={first} onChangeText={setFirst} />
      <TextInput style={s.input} placeholder="Last name" value={last} onChangeText={setLast} />
      <TextInput style={s.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Pressable style={s.btn} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Sign up</Text>}
      </Pressable>
      <Link href="/(auth)/login" style={s.link}>Already have an account? Sign in</Link>
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
