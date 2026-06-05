import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { AuthAPI } from '@/api/endpoints';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async () => {
    try { await AuthAPI.requestPasswordReset(email.trim()); setSent(true); }
    catch (e: any) { Alert.alert('Error', e?.response?.data?.detail ?? e.message); }
  };

  return (
    <View style={s.c}>
      <Text style={s.h1}>Reset password</Text>
      {sent ? (
        <Text style={{ fontSize: 16 }}>If an account exists for {email}, a reset link has been emailed.</Text>
      ) : (
        <>
          <TextInput style={s.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Pressable style={s.btn} onPress={submit}><Text style={s.btnText}>Send reset link</Text></Pressable>
        </>
      )}
      <Link href="/(auth)/login" style={s.link}>Back to sign in</Link>
    </View>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, padding: 24, justifyContent: 'center', gap: 12, backgroundColor: '#fff' },
  h1: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16 },
  btn: { backgroundColor: '#111', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 8 },
});
