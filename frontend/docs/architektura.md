
# Architektura Systemu LexiCore RAG AI

## Przegląd Architektury

LexiCore RAG AI to zaawansowany system asystenta prawniczego oparty na architekturze Retrieval-Augmented Generation (RAG), zbudowany z wykorzystaniem nowoczesnych technologii webowych i sztucznej inteligencji.

## Stack Technologiczny

### Frontend
- **React 18** - Główny framework UI
- **TypeScript** - Typowanie statyczne
- **Tailwind CSS** - Framework CSS
- **Shadcn/UI** - Komponenty UI
- **React Router** - Routing
- **Tanstack Query** - Zarządzanie stanem i cache
- **Lucide React** - Ikony
- **Recharts** - Wykresy i wizualizacje

### Backend & Baza Danych
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Baza danych relacyjna
- **pgvector** - Rozszerzenie dla wektorów
- **Row Level Security (RLS)** - Bezpieczeństwo na poziomie wierszy

### AI & Machine Learning
- **Google Gemini API** - Model językowy
- **Embeddings** - Wektoryzacja tekstów
- **Vector Search** - Wyszukiwanie semantyczne

## Architektura RAG

### 1. Ingestion Pipeline
```
Dokumenty → Preprocessing → Chunking → Embeddings → Vector DB
```

### 2. Query Pipeline
```
Pytanie → Embedding → Vector Search → Context Retrieval → LLM → Odpowiedź
```

### 3. Komponenty Systemu

#### A. Document Manager
- Upload dokumentów (PDF, DOCX, TXT)
- Preprocessing i chunking
- Generowanie embeddingów
- Metadata extraction

#### B. RAG Engine
- Semantic search w bazie wektorowej
- Context retrieval z rankingiem
- Prompt engineering
- Response generation

#### C. Chat Interface
- Interfejs konwersacyjny
- Historia rozmów
- Źródła odpowiedzi
- Feedback loop

## Struktura Bazy Danych

### Tabele Główne

#### `embeddings`
```sql
- id: uuid (PK)
- content: text
- embedding: vector(768)
- metadata: jsonb
- source_type: text
- source_id: uuid
- user_id: uuid (FK)
- document_name: text
- file_size: integer
- file_type: text
- chunk_index: integer
- processing_status: text
```

#### `rag_sessions`
```sql
- id: uuid (PK)
- user_id: uuid (FK)
- title: text
- created_at: timestamp
- updated_at: timestamp
- metadata: jsonb
```

#### `rag_messages`
```sql
- id: uuid (PK)
- session_id: uuid (FK)
- role: text
- content: text
- sources: jsonb
- created_at: timestamp
- metadata: jsonb
```

## Bezpieczeństwo

### Row Level Security (RLS)
- Izolacja danych między użytkownikami
- Polityki bezpieczeństwa na poziomie tabel
- Autoryzacja oparta na `auth.uid()`

### Uwierzytelnianie
- Supabase Auth
- Email/password
- OAuth providers (przyszłość)
- JWT tokens

## Performance & Skalowanie

### Optymalizacje
- HNSW indeksy dla vector search
- Lazy loading komponentów
- Query caching z Tanstack Query
- Connection pooling

### Monitoring
- Edge Functions logs
- Database performance metrics
- User analytics
- Error tracking

## Komponenty UI

### Glassmorphism Design
- Przezroczyste tła z blur efektami
- Moderne gradienty
- Smooth animations
- Responsive design

### 3D Animations
- Canvas-based particle systems
- CSS 3D transforms
- Smooth transitions
- Interactive elements

## Edge Functions

### gemini-rag
- Endpoint: `/functions/v1/gemini-rag`
- Funkcje: Query processing, RAG pipeline
- Model: Google Gemini Pro
- Rate limiting: Tak
- CORS: Skonfigurowane

## Deployment

### Development
- Vite dev server
- Hot module replacement
- Local Supabase instance

### Production
- Lovable hosting platform
- Automatyczne deployments
- CDN distribution
- SSL certificates

## Monitorowanie i Logging

### Metryki
- Response times
- Query accuracy
- User engagement
- System performance

### Logi
- Application logs
- Database queries
- API calls
- Error tracking

## Przyszłe Rozszerzenia

### Planowane Funkcje
- Multi-modal RAG (obrazy, dokumenty)
- Fine-tuning modeli
- Advanced analytics
- Mobile aplikacja
- API marketplace

### Integracje
- Microsoft Office
- Google Workspace
- Slack/Teams
- CRM systems
