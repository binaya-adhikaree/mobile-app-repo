import { View, Text, FlatList, Pressable, ActivityIndicator, Alert, StyleSheet, RefreshControl } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import * as WebBrowser from 'expo-web-browser';
import { DocumentsAPI } from '@/api/endpoints';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { useState } from 'react';

export default function Documents() {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['documents'],
    queryFn: () => DocumentsAPI.list(),
  });

  const createMut = useMutation({
    mutationFn: DocumentsAPI.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  });
  const delMut = useMutation({
    mutationFn: DocumentsAPI.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  });

  const pickAndUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (res.canceled) return;
    const f = res.assets[0];
    setUploading(true);
    try {
      const up = await uploadToCloudinary(f.uri, f.name, f.mimeType ?? 'application/octet-stream');
      await createMut.mutateAsync({ title: f.name, section: 'General', file_url: up.secure_url });
    } catch (e: any) {
      Alert.alert('Upload failed', e.message);
    } finally { setUploading(false); }
  };

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={s.c}>
      <Pressable style={s.btn} onPress={pickAndUpload} disabled={uploading}>
        <Text style={s.btnText}>{uploading ? 'Uploading…' : 'Upload document'}</Text>
      </Pressable>
      <FlatList
        data={data ?? []}
        keyExtractor={(i) => String(i.id)}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={<Text style={{ color: '#666', textAlign: 'center', marginTop: 32 }}>No documents yet.</Text>}
        renderItem={({ item }) => (
          <View style={s.row}>
            <Pressable style={{ flex: 1 }} onPress={() => item.file_url && WebBrowser.openBrowserAsync(item.file_url)}>
              <Text style={s.title}>{item.title}</Text>
              {item.section ? <Text style={s.meta}>{item.section}</Text> : null}
            </Pressable>
            <Pressable onPress={() => Alert.alert('Delete?', item.title, [
              { text: 'Cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => delMut.mutate(item.id) },
            ])}>
              <Text style={{ color: '#dc2626', fontWeight: '600' }}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, padding: 16, backgroundColor: '#fff' },
  btn: { backgroundColor: '#111', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1, borderColor: '#eee', borderRadius: 10, gap: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#666', marginTop: 2 },
});
