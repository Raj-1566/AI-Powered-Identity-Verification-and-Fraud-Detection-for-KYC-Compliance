# -AI-Powered-Identity-Verification-and-Fraud-Detection-for-KYC-Compliance
This project presents an AI-driven solution for automating KYC (Know Your Customer) and AML (Anti-Money Laundering) verification in the Banking, Financial Services, and Insurance (BFSI) domain. It focuses on intelligent identity validation, address verification, and fraud detection using advanced machine-learning and graph-based techniques.

# Objectives
Automate document verification and address validation using AI.
Detect fraudulent or duplicate identities through graph-based analysis.
Reduce manual verification overhead while improving compliance accuracy.

# Technical Workflow

- Data Preprocessing:
Raw KYC data (e.g., AADHAR, utility bills) is cleaned, standardized, and structured using Pandas and NumPy.

- Graph-Based Fraud Detection:
Using NetworkX, entities (individuals, documents, and addresses) are represented as graph nodes. Connections (shared addresses or document numbers) form edges that help uncover suspicious patterns or duplicate identities.

- AI Modeling:
Future integration includes Graph Neural Networks (GNNs) and Natural Language Processing (NLP) for enhanced document understanding, anomaly detection, and contextual validation.

- Frontend Simulation:
A simple HTML, CSS, and JavaScript interface allows users to upload documents, initiate AI verification, and view real-time (simulated) results. The system displays outputs such as Identity Verified, Suspicious Address Detected, or Verification Failed, simulating backend AI responses.

- Admin Dashboard:
All verification results are stored in a local log (browser-based) and displayed in a dynamic table for audit and monitoring. The dashboard provides transparency and traceability in KYC operations.

# Tech Stack

Backend / AI Modeling: Python, Pandas, NumPy, NetworkX
Frontend: HTML, CSS, JavaScript
Future Integration: FastAPI, Azure OpenAI, Graph Neural Networks

# Impact

This system demonstrates how AI can make KYC processes faster, more reliable, and more secure. By combining automation with data intelligence, it enhances trust, prevents identity fraud, and ensures regulatory compliance—helping organizations build safer digital onboarding experiences.
