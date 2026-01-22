# MediProof - Privacy-First Medical Verification

<p align="center">
  <img src="public/favicon.svg" alt="MediProof Logo" width="80" height="80">
</p>

<p align="center">
  <strong>Prove Health Facts. Reveal Nothing.</strong>
</p>

<p align="center">
  Privacy-first medical verification using zero-knowledge proofs on Aleo blockchain.
</p>

<p align="center">
  <a href="#features">Features</a> |
  <a href="#how-it-works">How It Works</a> |
  <a href="#tech-stack">Tech Stack</a> |
  <a href="#getting-started">Getting Started</a> |
  <a href="#smart-contract">Smart Contract</a>
</p>

---


 live url : https://mediproof.vercel.app/
## The Problem

Traditional medical verification systems expose sensitive personal health data:
- Hospitals store data in centralized databases prone to breaches
- Verifiers (employers, insurance) receive more data than necessary
- Patients have no control over who sees their information
- Public blockchains make privacy even worse - data is visible forever

## The Solution

MediProof enables **selective disclosure** of health facts using **zero-knowledge proofs**:
- Prove you're fit for employment without revealing your entire medical history
- Verify blood type for emergencies without exposing other conditions
- Confirm vaccination status without sharing personal records
- Grant time-limited access that can be revoked anytime

## Features

### For Patients
- **Create Encrypted Profile**: Store medical metadata on Aleo's private blockchain
- **Upload Documents**: Store medical documents on IPFS with only the hash on-chain
- **Manage Consent**: Approve or reject verification requests from doctors/verifiers
- **Generate ZK Proofs**: Prove specific health facts without revealing raw data
- **Full Control**: Revoke access anytime, data belongs to you

### For Doctors / Hospitals
- **Request Verification**: Send verification requests to patients
- **Receive Proofs**: Get cryptographic proofs without accessing raw data
- **No Data Liability**: Never store patient data - just verify proofs
- **Instant Verification**: Results in seconds, not hours

### For Verifiers (Insurance, Employers)
- **Employment Fitness**: Verify candidates are medically fit for work
- **Insurance Eligibility**: Check health requirements without full disclosure
- **Compliance-Ready**: Cryptographic audit trail for regulations
- **Privacy-Preserving**: Never see personal health information

## How It Works

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     Patient     │         │   Aleo Network  │         │    Verifier     │
│                 │         │                 │         │                 │
│  1. Create      │────────▶│  Store encrypted│         │                 │
│     profile     │         │  profile record │         │                 │
│                 │         │                 │         │                 │
│                 │◀────────│                 │◀────────│  2. Request     │
│  3. Approve &   │         │  Verification   │         │     verification│
│     generate    │────────▶│  request        │         │                 │
│     ZK proof    │         │                 │         │                 │
│                 │         │  ZK Proof       │────────▶│  4. Verify      │
│                 │         │  (no raw data)  │         │     proof       │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Zero-Knowledge Proof Types

| Proof Type | Description | Use Case |
|------------|-------------|----------|
| `prove_fitness` | Proves patient is fit (not diabetic, not hypertensive) | Employment screening |
| `prove_blood_type` | Proves blood group matches expected value | Emergency transfusions |
| `prove_not_diabetic` | Proves patient is not diabetic | Insurance eligibility |
| `prove_not_hypertensive` | Proves patient is not hypertensive | Life insurance |

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **shadcn/ui** - Beautiful UI components

### Blockchain
- **Aleo** - Privacy-first L1 blockchain
- **Leo** - Aleo's programming language for ZK circuits
- **Puzzle Wallet** - Aleo wallet integration

### Storage
- **Pinata/IPFS** - Decentralized document storage
- **Aleo Records** - Private on-chain data storage

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Puzzle Wallet browser extension
- (Optional) Leo CLI for contract development

### Installation

```bash
# Clone the repository
git clone https://github.com/mediproof/mediproof.git
cd mediproof

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Start development server
bun dev
```

 
## Smart Contract

The MediProof smart contract is written in Leo and deployed on Aleo testnet.

### Contract Address
```
mediproof_9126.aleo
```

### Records

```leo
record PatientProfile {
    owner: address,
    patient_id: field,
    blood_group: u8,      // 0-7 representing blood types
    diabetic: bool,
    hypertensive: bool,
    last_checkup: u64,
    document_hash: field,
    is_active: bool,
}

record AccessRequest {
    owner: address,
    request_id: field,
    requester: address,
    patient: address,
    proof_type: u8,
    expires_at: u64,
    is_pending: bool,
}

record HealthProof {
    owner: address,
    proof_id: field,
    patient: address,
    proof_type: u8,
    result: bool,
    generated_at: u64,
    verifier: address,
}
```

### Key Functions

| Function | Description |
|----------|-------------|
| `create_patient_profile` | Create new encrypted patient profile |
| `update_profile` | Update existing profile data |
| `request_verification` | Doctor/verifier requests patient verification |
| `prove_fitness` | Generate fitness proof |
| `prove_blood_type` | Generate blood type proof |
| `prove_not_diabetic` | Generate diabetes status proof |
| `prove_not_hypertensive` | Generate hypertension status proof |
| `verify_proof` | Verify a health proof |

### Building the Contract

```bash
cd contracts/mediproof_v1

# Build
leo build

# Deploy to testnet
leo deploy --network testnet --broadcast
```

## User Flow

### Patient Flow
1. Connect Puzzle Wallet
2. Select "Patient" role
3. Create medical profile (blood group, conditions)
4. Upload documents to IPFS (optional)
5. Wait for verification requests
6. Approve/reject requests → generate ZK proofs

### Doctor/Verifier Flow
1. Connect Puzzle Wallet
2. Select "Doctor" or "Verifier" role
3. Enter patient's Aleo address
4. Select verification type needed
5. Wait for patient approval
6. Receive and verify ZK proof

## Security & Privacy

- **Zero-Knowledge**: Proofs reveal nothing except the verified fact
- **Private Records**: All on-chain data is encrypted using Aleo records
- **Patient Control**: Only patients can generate proofs about their data
- **No Central Authority**: No single entity can access all data
- **IPFS Storage**: Documents stored off-chain, only hashes on-chain
- **Time-Limited Access**: Requests expire, preventing indefinite access

## Project Structure

```
mediproof/
├── contracts/
│   └── mediproof_v1/
│       ├── src/
│       │   └── main.leo        # Smart contract
│       └── program.json
├── public/
│   ├── favicon.svg
│   ├── logo.svg
│   └── og-image.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── aleo/           # Aleo API routes
│   │   │   └── upload/         # IPFS upload route
│   │   ├── dashboard/
│   │   │   ├── patient/
│   │   │   ├── doctor/
│   │   │   └── verifier/
│   │   ├── features/
│   │   ├── how-it-works/
│   │   ├── select-role/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── context/
│   │   └── WalletContext.tsx
│   ├── hooks/
│   └── lib/
│       └── aleo-config.ts
└── README.md
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Built For

<p align="center">
  <strong>Aleo WaveHack 2024</strong>
</p>

 
---

<p align="center">
  <strong>MediProof</strong> - Your health data, your rules.
</p>

<p align="center">
  Powered by <a href="https://aleo.org">Aleo</a> & Zero-Knowledge Proofs
</p>
