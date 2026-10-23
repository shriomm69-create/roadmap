import type { ProjectIdea } from '../types/index.ts';

export const PROJECT_IDEAS: ProjectIdea[] = [
  // SDE / Full-Stack
  {
    id: 'sde-1',
    title: 'Distributed In-Memory Key-Value Store with Raft Consensus',
    careerPath: 'sde',
    difficulty: 'Advanced',
    duration: '4-6 weeks',
    description: 'Implement a distributed, fault-tolerant key-value store using the Raft consensus algorithm. Handles leader election, log replication, snapshotting, and network partition recovery with linearizable reads.',
    techStack: ['Go or C++', 'gRPC / Protocol Buffers', 'LevelDB / RocksDB engine', 'Docker'],
    keyFeatures: [
      'Leader election with randomized heartbeats and term counters',
      'AppendEntries RPC with commit index advancement and rollback on mismatch',
      'Persistent log compaction via log compaction & snapshots',
      'Jepsen-style chaos testing simulating split-brain network drops',
    ],
    interviewDiscussionPoints: [
      'Trade-offs between Raft vs Paxos in ease of implementation and leader-centricity',
      'How to avoid stale reads on network partitions via Lease Read or Leader Confirmation',
      'Log compaction memory budgeting during high write spikes',
    ],
    atsResumeBullet: 'Architected distributed KV store in Go implementing Raft consensus; sustained 12,000 req/sec with <8ms P99 latency and zero data loss across simulated 33% node failure partitions.',
  },
  {
    id: 'sde-2',
    title: 'Collaborative Real-Time Code Canvas & Remote Pair-Programming Sandbox',
    careerPath: 'sde',
    difficulty: 'Intermediate',
    duration: '3-4 weeks',
    description: 'Web-based multi-user IDE supporting simultaneous document editing using Operational Transformation (OT) or CRDTs, Dockerized remote code compilation runner, and WebRTC audio chat.',
    techStack: ['TypeScript', 'React', 'Node.js / Express', 'WebSockets / Socket.io', 'Yjs CRDTs', 'Docker Isolated Sandbox'],
    keyFeatures: [
      'Conflict-free replicated data types (CRDT) for multi-cursor real-time document sync',
      'Sandboxed ephemeral Docker containers for executing C++, Java, and Python with CPU/RAM cgroups limits',
      'Syntax highlighting with Monaco Editor & real-time AST linting',
      'WebRTC peer-to-peer audio connection with zero server media load',
    ],
    interviewDiscussionPoints: [
      'Why CRDTs were chosen over Centralized Operational Transformation',
      'Container isolation security preventing fork bombs and disk exhaustion via Docker cgroups',
      'WebSocket reconnection backoff and heartbeat ping/pong design',
    ],
    atsResumeBullet: 'Engineered real-time collaborative code editor supporting 50+ concurrent users with Yjs CRDTs; built isolated Docker sandbox executing code securely within 300ms roundtrip.',
  },
  {
    id: 'sde-3',
    title: 'High-Throughput E-Commerce Microservices with Stripe & Redis Cache-Aside',
    careerPath: 'sde',
    difficulty: 'Intermediate',
    duration: '3-4 weeks',
    description: 'Scalable backend services for product catalog, shopping cart, order checkout with idempotency keys, inventory reservations, and Stripe webhooks.',
    techStack: ['Node.js / TypeScript', 'PostgreSQL', 'Redis', 'BullMQ / Kafka', 'Stripe API'],
    keyFeatures: [
      'Idempotent payment processing preventing double-billing on client retries',
      'Redis distributed locking (Redlock) for strict inventory concurrency control during flash sales',
      'Asynchronous order fulfillment via event-driven message queues',
      'Database connection pooling with indexing optimizing search queries from 450ms to 12ms',
    ],
    interviewDiscussionPoints: [
      'How distributed locks prevent overselling inventory in high-concurrency spikes',
      'Dead-letter queues (DLQ) and retry policies for failed webhook deliveries',
      'Database normalization vs denormalization for order history tables',
    ],
    atsResumeBullet: 'Developed e-commerce backend microservice handling 5,000+ orders/min; reduced database query latency by 96% via Redis cache-aside and enforced payment idempotency.',
  },

  // AI/ML
  {
    id: 'aiml-1',
    title: 'Multimodal Research Paper Assistant with Hybrid RAG & Knowledge Graph',
    careerPath: 'aiml',
    difficulty: 'Advanced',
    duration: '4-5 weeks',
    description: 'End-to-end question answering pipeline over scientific arXiv papers using BM25 dense-sparse hybrid search, reranking with Cross-Encoders, and citation grounding.',
    techStack: ['Python', 'PyTorch', 'LangChain / LlamaIndex', 'Qdrant / ChromaDB', 'FastAPI', 'Gemini / Claude API'],
    keyFeatures: [
      'Semantic chunking with Markdown table parsing and formula extraction',
      'Reciprocal Rank Fusion (RRF) combining dense vector search and BM25 keyword search',
      'Cohere / BGE Cross-Encoder reranker cutting hallucination rate by 80%',
      'Strict citation attribution mapping every generated paragraph back to page and line numbers',
    ],
    interviewDiscussionPoints: [
      'Chunk size vs context window trade-offs in technical scientific documents',
      'Why hybrid dense-sparse search beats pure vector search for domain-specific terminology',
      'Evaluation methodologies: Ragas faithfulness, answer relevancy, and context recall',
    ],
    atsResumeBullet: 'Built hybrid RAG system querying 10,000+ scientific PDFs; boosted retrieval precision by 34% using Reciprocal Rank Fusion and Cross-Encoder reranking with strict citation grounding.',
  },
  {
    id: 'aiml-2',
    title: 'Real-Time Edge Computer Vision for Traffic Density & Safety Violations',
    careerPath: 'aiml',
    difficulty: 'Intermediate',
    duration: '3-4 weeks',
    description: 'YOLOv8 deep learning pipeline optimized with ONNX and TensorRT for real-time vehicle and pedestrian detection from CCTV feeds with Kalman filter multi-object tracking (ByteTrack).',
    techStack: ['Python', 'OpenCV', 'YOLOv8', 'TensorRT', 'ByteTrack', 'FastAPI', 'Streamlit'],
    keyFeatures: [
      'Real-time object detection and classification running at 60+ FPS on GPU',
      'ByteTrack multi-object tracker assigning persistent track IDs across occlusions',
      'Spatial geofencing detecting wrong-way driving and zebra-crossing violations',
      'Exported model quantized to INT8 precision reducing model footprint by 65%',
    ],
    interviewDiscussionPoints: [
      'Handling occlusions and ID switches in crowded traffic intersections',
      'Quantization aware training (QAT) vs post-training quantization (PTQ)',
      'Balancing FPS latency versus mean Average Precision (mAP)',
    ],
    atsResumeBullet: 'Trained and deployed YOLOv8 traffic monitoring pipeline achieving 58 FPS on edge hardware; tracked 200+ simultaneous vehicles with 92.4% mAP using ByteTrack and INT8 quantization.',
  },

  // Cybersecurity
  {
    id: 'cyber-1',
    title: 'Automated Cloud Vulnerability Scanner & Network Traffic Anomaly Detector',
    careerPath: 'cybersecurity',
    difficulty: 'Intermediate',
    duration: '3-4 weeks',
    description: 'Lightweight SIEM tool that monitors Linux audit logs, parses raw PCAP network traffic for port scans (SYN/FIN), and audits AWS/GCP IAM permission sprawl.',
    techStack: ['Python', 'Scapy', 'Elasticsearch / OpenSearch', 'FastAPI', 'Docker', 'Linux auditd'],
    keyFeatures: [
      'Real-time packet inspection detecting ARP spoofing, TCP SYN flood attacks, and DNS tunneling',
      'Least-privilege IAM policy auditor flagging wildcard `*` permissions',
      'MITRE ATT&CK framework mapping for detected security alerts',
      'Interactive security telemetry dashboard with real-time alerting to Slack / Discord',
    ],
    interviewDiscussionPoints: [
      'Detecting DNS tunneling using entropy calculations and domain name length heuristics',
      'Trade-offs between signature-based vs anomaly-based intrusion detection systems',
      'How to minimize false positive alert fatigue in SOC workflows',
    ],
    atsResumeBullet: 'Engineered network intrusion detection engine analyzing 50,000 packets/sec; identified port scans and DNS tunneling with <2% false positives and mapped alerts directly to MITRE ATT&CK.',
  },

  // Core & Embedded
  {
    id: 'core-1',
    title: 'FreeRTOS Autonomous Mobile Robot with Sensor Fusion & Obstacle Avoidance',
    careerPath: 'core_embedded',
    difficulty: 'Advanced',
    duration: '4-5 weeks',
    description: 'Embedded firmware for an autonomous ground rover using ESP32/STM32 running FreeRTOS with Extended Kalman Filter (EKF) sensor fusion of IMU and wheel encoders.',
    techStack: ['C / C++', 'FreeRTOS', 'STM32 / ESP32', 'I2C / SPI / UART', 'PID Control', 'ROS2'],
    keyFeatures: [
      'Preemptive multi-threaded RTOS architecture with prioritized motor control tasks',
      'Extended Kalman Filter fusing noisy accelerometer/gyroscope readings with wheel odometry',
      'PID closed-loop velocity control loop running at 100 Hz',
      'Hardware watchdog timer and fail-safe stop on sensor disconnection',
    ],
    interviewDiscussionPoints: [
      'Preventing priority inversion using priority inheritance mutexes in FreeRTOS',
      'Tuning PID gains (Kp, Ki, Kd) for smooth trajectory tracking without overshoot',
      'DMA hardware transfers to prevent CPU blocking on UART telemetry streams',
    ],
    atsResumeBullet: 'Designed FreeRTOS embedded firmware for autonomous rover on STM32; maintained 100 Hz PID control loop and fused IMU/encoder telemetry with EKF to achieve <3cm navigation drift.',
  },
];
