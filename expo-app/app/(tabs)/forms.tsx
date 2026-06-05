import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { FormsAPI } from '@/api/endpoints';

export default function Forms() {
  const { data, isLoading } = useQuery({ queryKey: ['forms'], queryFn: FormsAPI.list });
  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;
  return (
    <View style={s.c}>
      <FlatList
        data={data ?? []}
        keyExtractor={(i) => String(i.id)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={<Text style={{ color: '#666', textAlign: 'center', marginTop: 32 }}>No forms available.</Text>}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/forms/[id]', params: { id: String(item.id) } }} asChild>
            <Pressable style={s.row}>
              <Text style={s.title}>{item.title}</Text>
              {item.description ? <Text style={s.meta}>{item.description}</Text> : null}
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, padding: 16, backgroundColor: '#fff' },
  row: { padding: 14, borderWidth: 1, borderColor: '#eee', borderRadius: 10 },
  title: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#666', marginTop: 4 },
});
