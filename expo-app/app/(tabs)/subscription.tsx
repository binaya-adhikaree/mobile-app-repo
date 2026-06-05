import { View, Text, FlatList, Pressable, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { SubscriptionsAPI } from '@/api/endpoints';

export default function SubscriptionTab() {
  const qc = useQueryClient();
  const { data: plans, isLoading: lp } = useQuery({ queryKey: ['plans'], queryFn: SubscriptionsAPI.plans });
  const { data: sub, isLoading: ls } = useQuery({ queryKey: ['subscription'], queryFn: SubscriptionsAPI.mine });

  const checkoutMut = useMutation({
    mutationFn: async (planId: number) => {
      const success = Linking.createURL('/subscription/success');
      const cancel = Linking.createURL('/subscription/cancel');
      return SubscriptionsAPI.createCheckoutSession(planId, success, cancel);
    },
    onSuccess: async ({ url }) => {
      await WebBrowser.openBrowserAsync(url);
      qc.invalidateQueries({ queryKey: ['subscription'] });
    },
    onError: (e: any) => Alert.alert('Checkout failed', e?.response?.data?.detail ?? e.message),
  });

  const cancelMut = useMutation({
    mutationFn: SubscriptionsAPI.cancel,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscription'] }),
  });

  if (lp || ls) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={s.c}>
      {sub ? (
        <View style={s.card}>
          <Text style={s.h2}>Current subscription</Text>
          <Text>Status: {sub.status}</Text>
          {sub.current_period_end ? <Text>Renews/ends: {sub.current_period_end}</Text> : null}
          <Pressable style={[s.btn, { backgroundColor: '#dc2626' }]} onPress={() => cancelMut.mutate()}>
            <Text style={s.btnText}>Cancel subscription</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={s.sub}>No active subscription. Pick a plan:</Text>
      )}
      <FlatList
        data={plans ?? []}
        keyExtractor={(i) => String(i.id)}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.h2}>{item.name}</Text>
            <Text style={s.price}>${item.price}{item.interval ? ` / ${item.interval}` : ''}</Text>
            {item.features?.map((f) => <Text key={f}>• {f}</Text>)}
            <Pressable style={s.btn} onPress={() => checkoutMut.mutate(item.id)} disabled={checkoutMut.isPending}>
              <Text style={s.btnText}>Subscribe</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fff' },
  sub: { color: '#666' },
  card: { padding: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 12, gap: 6 },
  h2: { fontSize: 18, fontWeight: '700' },
  price: { fontSize: 16, color: '#111' },
  btn: { backgroundColor: '#111', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '600' },
});
