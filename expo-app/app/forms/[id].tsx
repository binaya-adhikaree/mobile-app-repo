import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FormsAPI } from '@/api/endpoints';
import { useState, useMemo } from 'react';

export default function FormDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const formId = Number(id);
  const { data: form, isLoading } = useQuery({
    queryKey: ['forms', formId],
    queryFn: () => FormsAPI.retrieve(formId),
  });

  const [values, setValues] = useState<Record<string, string>>({});
  const fields = useMemo(() => form?.fields ?? [], [form]);

  const submitMut = useMutation({
    mutationFn: (payload: Record<string, unknown>) => FormsAPI.submit(formId, payload),
    onSuccess: () => Alert.alert('Submitted', 'Thanks — your response was recorded.'),
    onError: (e: any) => Alert.alert('Submission failed', e?.response?.data?.detail ?? e.message),
  });

  if (isLoading || !form) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <>
      <Stack.Screen options={{ title: form.title }} />
      <ScrollView contentContainerStyle={s.c}>
        <Text style={s.h1}>{form.title}</Text>
        {form.description ? <Text style={s.sub}>{form.description}</Text> : null}
        {fields.length === 0 ? (
          <Text style={{ color: '#666' }}>This form has no defined fields. Contact your admin.</Text>
        ) : fields.map((f) => (
          <View key={f.name} style={{ gap: 6 }}>
            <Text style={s.label}>{f.label}{f.required ? ' *' : ''}</Text>
            <TextInput
              style={s.input}
              value={values[f.name] ?? ''}
              onChangeText={(t) => setValues((v) => ({ ...v, [f.name]: t }))}
              keyboardType={f.type === 'number' ? 'numeric' : 'default'}
              multiline={f.type === 'textarea'}
            />
          </View>
        ))}
        <Pressable style={s.btn} onPress={() => submitMut.mutate(values)} disabled={submitMut.isPending}>
          <Text style={s.btnText}>{submitMut.isPending ? 'Submitting…' : 'Submit'}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}
const s = StyleSheet.create({
  c: { padding: 20, gap: 12, backgroundColor: '#fff' },
  h1: { fontSize: 22, fontWeight: '700' },
  sub: { color: '#666' },
  label: { fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16 },
  btn: { backgroundColor: '#111', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: '600' },
});
