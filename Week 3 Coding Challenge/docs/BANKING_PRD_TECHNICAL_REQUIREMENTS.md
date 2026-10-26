# Product Requirements Document (PRD) Extension: Technical & UX Specifications
**Target Implementation Reference for Claude Code**

This document details the non-functional, security, and neurodivergent-centric user experience (UX) requirements for the financial banking application. It serves as a comprehensive system prompt extension and technical implementation guide.

---

## 1. Core Engineering & UX Pillars

### Neurodivergent-Centric UX (Dopamine & Low-Friction)
* **Progressive Disclosure:** Mask secondary or overwhelming numeric data by default to prevent sensory fatigue.
* **Just-in-Time Contextual Coaching:** Embed explicit, single-sentence conversational helpers directly alongside interactive elements.
* **Visual Bucket Management:** Model financial accounts as distinct, tactile visual units (buckets/enclaves) instead of abstract data lists.
* **Micro-Interactions:** Integrate lightweight Lottie animation hooks to provide immediate, gamified validation upon successful actions.

### High-Fidelity UI Styling
* **Design Tokens:** Enforce the project's strict high-contrast, low-distraction theme configuration variables.
* **State Integrity:** Every screen component must explicitly manage four distinct visual states: Initial, Loading, Success (with animations), and Error (shame-free recovery text).

---

## 2. Technical Requirements & Constraints

### Data Protection & Cryptography
* **Zero Raw PII Storage:** Never store unmasked Personally Identifiable Information (PII) or raw ledger values in persistent local storage.
* **Local Layer Cryptography:** Use platform-native secure enclaves (e.g., Apple Secure Enclave via Keychain, Android Keystore) or state-approved secure storage modules. All local databases must enforce AES-256 standard encryption.
* **Network Pipeline:** Enforce TLS 1.3 protocol validation. All client fetch or axios modules must verify SSL Certificate Pinning to prevent man-in-the-middle (MITM) attacks.

### Identity Verification & Session Lifecycle
* **Native Biometrics:** Deeply integrate with native mobile biometric secure enclaves (Apple FaceID / TouchID and Android BiometricPrompt).
* **Session Eviction:** Enforce a hard 5-minute absolute inactivity timeout. Clear all sensitive state variables from memory instantly upon expiration.
* **Privacy Masking:** Attach application-lifecycle listeners to the app backgrounding events. Overlay a secure, blurred structural view immediately when the app loses focus to mask visible balances.

### Application Security & Runtime Defenses
* **Environment Attestation:** Execute a blocking environment check on initialization. Safe-terminate application access if a rooted or jailbroken operating system state is identified.
* **Binary Obfuscation Prep:** Keep build configurations stripped of inline strings, reflection pathways, or un-obfuscated route signatures.
* **Debug Sanitation:** Remove all internal console logging (`console.log`, verbose trace, dump statements) from standard production files.

### Transaction Integrity & Syncing
* **Idempotent APIs:** Every balance adjustment, bucket transfer, or mutation event payload *must* pass a cryptographically unique `X-Idempotency-Key` header to protect users against double-tap behaviors.
* **ACID Fallbacks:** Wrap backend ledger transactions in atomic block statements. Roll back state variables cleanly if mid-network connections break down.

---

## 3. Boilerplate Reference: Privacy-Masked Balance Component

```tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, AppState, AppStateStatus } from 'react-native';
import { BlurView } from '@react-native-community/blur';

interface BalanceDisplayProps {
  balanceAmount: string;
  accountName: string;
}

export default function BalanceDisplay({ balanceAmount, accountName }: BalanceDisplayProps) {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const isAppHidden = appState === 'background' || appState === 'inactive';

  return (
    <View style={styles.container}>
      <Text style={styles.helperText}>Tap your card to move funds between your buckets.</Text>
      <View style={styles.card}>
        <Text style={styles.label}>{accountName.toUpperCase()}</Text>
        <Text style={styles.balance}>{balanceAmount}</Text>
      </View>
      {isAppHidden && (
        <BlurView
          style={styles.absoluteBlurOverlay}
          blurType="dark"
          blurAmount={15}
          reducedTransparencyFallbackColor="black"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', marginVertical: 12 },
  helperText: { fontSize: 14, color: '#666', marginBottom: 8, fontStyle: 'italic' },
  card: { backgroundColor: '#111', borderRadius: 16, padding: 24, elevation: 5 },
  label: { color: '#aaa', fontSize: 12, letterSpacing: 1.5, marginBottom: 4 },
  balance: { color: '#fff', fontSize: 32, fontWeight: '700' },
  absoluteBlurOverlay: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, borderRadius: 16 },
});
```

---

## 4. Claude Code Implementation Workflow Instructions

When generating or editing application code, use the following execution rules:
1. **Unhappy Paths First:** Prioritize writing error-handling logic, network drop handlers, and invalid input flows before writing optimal execution paths.
2. **Review Against Specs:** Before finalizing code outputs, explicitly double-check variables against the security and session guidelines listed above.
3. **Audit Context:** Run workspace audits using this specification as the baseline:
   `claudecode "Review the components directory for UX progressive disclosure compliance and session lifecycle security matches against this guide."`
