import React from 'react'
import { Text, View, Document, Page, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 10, fontFamily: 'Helvetica' },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 12 },
  section: { marginTop: 14 },
  row: { display: 'flex', flexDirection: 'row', gap: 14 },
  label: { color: '#666', width: 140 },
  value: { flex: 1 },
  h2: { fontSize: 12, fontWeight: 700, marginBottom: 8 },
  bullet: { marginBottom: 8 },
  disclaimer: { marginTop: 18, color: '#555', fontSize: 9, lineHeight: 1.35 },
})

export type WeeklyReportPdfModel = Awaited<ReturnType<typeof import('./weekly').getWeeklyReportData>>

export default function WeeklyReportPdf({ model }: { model: WeeklyReportPdfModel }) {
  const { clientName, summary, highlights } = model

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>VaultCheck Weekly Report</Text>
        <View style={styles.section}>
          <Text>
            Client: <Text style={{ fontWeight: 700 }}>{clientName}</Text>
          </Text>
          <Text>
            Week: <Text style={{ fontWeight: 700 }}>{model.range.start.toDateString()}</Text> -{' '}
            <Text style={{ fontWeight: 700 }}>{model.range.end.toDateString()}</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Invoices scanned</Text>
            <Text style={styles.value}>{summary.invoicesScanned}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Avg risk (this week)</Text>
            <Text style={styles.value}>{summary.avgRiskThisWeek.toFixed(1)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Risk trend</Text>
            <Text style={styles.value}>{summary.riskTrend}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Alerts generated</Text>
            <Text style={styles.value}>{summary.alertsGenerated}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Alerts resolved</Text>
            <Text style={styles.value}>{summary.alertsResolvedThisWeek}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Open alerts (end)</Text>
            <Text style={styles.value}>{summary.openAlertsAtEnd}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fingerprint updates</Text>
            <Text style={styles.value}>{summary.fingerprintUpdates}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Highlights</Text>
          {highlights.length === 0 ? (
            <Text>No notable alerts this week.</Text>
          ) : (
            highlights.map((h, idx) => (
              <View key={idx} style={styles.bullet}>
                <Text style={{ fontWeight: 700 }}>
                  {h.severity.toUpperCase()}: {h.title}
                </Text>
                <Text>
                  Vendor: {h.vendorName} | Amount: ${h.amount.toLocaleString()}
                </Text>
                <Text>{h.description}</Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.disclaimer}>
          VaultCheck provides payment verification assistance. It does not guarantee fraud detection. Always
          verify suspicious payments through direct phone contact with known vendor numbers.
        </Text>
      </Page>
    </Document>
  )
}

