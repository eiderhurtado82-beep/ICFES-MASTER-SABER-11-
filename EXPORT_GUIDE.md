# 📦 GUÍA DE EXPORTACIÓN Y MIGRACIÓN: ICFES MASTER SABER 11°

Esta guía documenta el procedimiento para **exportar el código fuente** desde Google AI Studio y el **paso a paso técnico** para reemplazar la base de datos simulada (*Mock Data* en memoria y `localStorage`) por una base de datos de producción real (**Supabase / PostgreSQL**) utilizando **Prisma ORM**.

---

## 🚀 PARTE 1: Cómo Exportar y Descargar el Código Fuente

### Opción A: Descarga Directa ZIP
1. En la barra superior derecha de la interfaz de **Google AI Studio Build**, haz clic en el ícono de **Export / Descargar**.
2. Selecciona **Download as ZIP**.
3. Descomprime el archivo en tu máquina local.
4. Abre la carpeta en tu editor preferido (ej. *Visual Studio Code*).
5. Instala las dependencias y ejecuta el servidor local:
   ```bash
   npm install
   npm run dev
   ```
6. El proyecto correrá en `http://localhost:3000` con Vite y Hot Module Replacement (HMR).

### Opción B: Sincronización directa con GitHub
1. Haz clic en el botón **Connect to GitHub** o **Push to GitHub** en la barra superior del entorno.
2. Autoriza tu cuenta de GitHub y selecciona el repositorio de destino (ej. `mi-organizacion/icfes-master`).
3. Clona el repositorio en tu entorno local:
   ```bash
   git clone https://github.com/tu-usuario/icfes-master.git
   cd icfes-master
   npm install
   npm run dev
   ```

---

## 🗄️ PARTE 2: Migración de Mock Data a PostgreSQL / Supabase con Prisma

Actualmente, el proyecto almacena las preguntas en `src/data/questions.ts`, los artículos en `src/data/learningContent.ts`, y el perfil, historial de simulacros y banco de errores en `localStorage` mediante `src/context/AppContext.tsx`.

A continuación tienes la hoja de ruta técnica exacta para conectar tu base de datos relacional.

---

### Paso 1: Configurar variables de entorno en `.env`
Crea o edita tu archivo `.env` en la raíz del proyecto con la cadena de conexión de tu proyecto de **Supabase**:

```env
# URL de conexión agrupada (Connection Pooling) de Supabase (puerto 6543)
DATABASE_URL="postgresql://postgres.[TU-PROYECTO]:[TU-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# URL de conexión directa para migraciones de Prisma (puerto 5432)
DIRECT_URL="postgresql://postgres.[TU-PROYECTO]:[TU-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Clave de Gemini API para el Tutor real (server-side)
GEMINI_API_KEY="AIzaSy..."
```

---

### Paso 2: Esquema de Prisma (`prisma/schema.prisma`)
Crea tu archivo `prisma/schema.prisma` mapeando fielmente las entidades del MVP:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum SubjectArea {
  MATEMATICAS
  LECTURA_CRITICA
  CIENCIAS_NATURALES
  SOCIALES_CIUDADANAS
  INGLES
}

enum MistakeStatus {
  pending
  reviewed
  mastered
}

model User {
  id                     String            @id @default(uuid())
  email                  String            @unique
  name                   String
  curso                  String            @default("11°")
  institucion            String?
  ciudad                 String?
  fechaExamen            String            @default("2026-08-16")
  metaPuntaje            Int               @default(380)
  tiempoDiarioMinutos    Int               @default(30)
  xp                     Int               @default(0)
  level                  Int               @default(1)
  streakDays             Int               @default(1)
  lastActiveDate         DateTime          @default(now())
  dailyGoalQuestions     Int               @default(15)
  questionsAnsweredToday Int               @default(0)
  totalQuestionsAnswered Int               @default(0)
  totalCorrectAnswers    Int               @default(0)
  createdAt              DateTime          @default(now())
  updatedAt              DateTime          @updatedAt
  
  answers                QuestionAnswer[]
  mistakes               UserMistake[]
  mockResults            MockExamResult[]
  studyPlans             StudyPlanDay[]
}

model Question {
  id                 String          @id
  area               SubjectArea
  tema               String
  subtema            String?
  competencia        String
  dificultad         String
  contexto           String?         @db.Text
  pregunta           String          @db.Text
  opciones           String[]        // Array de 4 opciones [A, B, C, D]
  respuestaCorrecta  String          // "A", "B", "C" o "D"
  
  // Metadatos pedagógicos del Sistema Inteligente de Explicaciones
  explicacionPorQue  String          @db.Text
  aprendeEsto        String?         @db.Text
  errorFrecuente     String?         @db.Text
  consejoIcfes       String?         @db.Text
  
  createdAt          DateTime        @default(now())
  answers            QuestionAnswer[]
  mistakes           UserMistake[]
}

model UserMistake {
  id            String        @id @default(uuid())
  userId        String
  questionId    String
  userAnswer    String
  status        MistakeStatus @default(pending)
  reviewCount   Int           @default(0)
  lastAttemptAt DateTime      @default(now())

  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  question      Question      @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@unique([userId, questionId])
}

model MockExamResult {
  id                 String       @id @default(uuid())
  userId             String
  isDiagnostic       Boolean      @default(false)
  totalQuestions     Int
  correctCount       Int
  incorrectCount     Int
  unansweredCount    Int
  timeUsedSeconds    Int
  globalScoreScaled  Int          // Escala 0 a 500
  globalPercentage   Int
  areaBreakdown      Json         // JSON con puntajes y aciertos por las 5 áreas
  recommendations    String[]
  userAnswers        Json         // Mapa { [questionId]: "A" | "B" | "C" | "D" }
  createdAt          DateTime     @default(now())

  user               User         @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model StudyPlanDay {
  id              String      @id @default(uuid())
  userId          String
  dayName         String      // Lunes, Martes, etc.
  area            String
  durationMinutes Int
  topicTitle      String
  completed       Boolean     @default(false)

  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Ejecuta la migración en Supabase:
```bash
npx prisma migrate dev --name init_icfes_master
npx prisma generate
```

---

### Paso 3: Script de Inicialización de Preguntas (`prisma/seed.ts`)
Para poblar automáticamente tu base de datos de PostgreSQL con el banco de preguntas ya validadas de `src/data/questions.ts`:

```typescript
// prisma/seed.ts
import { PrismaClient, SubjectArea } from '@prisma/client';
import { INITIAL_QUESTIONS } from '../src/data/questions';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Poblando preguntas del Saber 11° en Supabase...');

  for (const q of INITIAL_QUESTIONS) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: {
        id: q.id,
        area: q.area as SubjectArea,
        tema: q.tema,
        subtema: q.subtema,
        competencia: q.competencia,
        dificultad: q.dificultad,
        contexto: q.contexto,
        pregunta: q.pregunta,
        opciones: q.opciones,
        respuestaCorrecta: q.respuestaCorrecta,
        explicacionPorQue: q.explicacion.porQue,
        aprendeEsto: q.explicacion.aprendeEsto,
        errorFrecuente: q.explicacion.errorFrecuente,
        consejoIcfes: q.explicacion.consejoIcfes,
      },
    });
  }

  console.log('✅ Banco de preguntas migrado exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Agrégalo a tu `package.json`:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```
Y ejecútalo:
```bash
npx prisma db seed
```

---

### Paso 4: Capa de API en Node / Express (`server.ts`)
Crea tus endpoints de backend para sustituir las llamadas a `localStorage`:

```typescript
// server.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// 1. Obtener preguntas para práctica o examen
app.get('/api/questions', async (req, res) => {
  const { area, limit = 10 } = req.query;
  const where = area && area !== 'ALL' ? { area: String(area) as any } : {};
  const questions = await prisma.question.findMany({
    where,
    take: Number(limit),
  });
  res.json(questions);
});

// 2. Registrar respuesta y actualizar banco de errores
app.post('/api/user/answer', async (req, res) => {
  const { userId, questionId, selectedOption } = req.body;
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) return res.status(404).json({ error: 'Pregunta no encontrada' });

  const isCorrect = selectedOption === question.respuestaCorrecta;

  if (!isCorrect) {
    // Upsert a banco de errores
    await prisma.userMistake.upsert({
      where: { userId_questionId: { userId, questionId } },
      update: { userAnswer: selectedOption, status: 'pending', lastAttemptAt: new Date() },
      create: { userId, questionId, userAnswer: selectedOption, status: 'pending' },
    });
  } else {
    // Si acertó, avanzar de pending -> reviewed -> mastered
    const mistake = await prisma.userMistake.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });
    if (mistake) {
      const nextStatus = mistake.reviewCount >= 1 ? 'mastered' : 'reviewed';
      await prisma.userMistake.update({
        where: { id: mistake.id },
        data: { status: nextStatus, reviewCount: { increment: 1 } },
      });
    }
  }

  // Sumar XP al usuario (+15 correcto, +3 incorrecto)
  const xpDelta = isCorrect ? 15 : 3;
  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: { increment: xpDelta },
      totalQuestionsAnswered: { increment: 1 },
      totalCorrectAnswers: isCorrect ? { increment: 1 } : undefined,
    },
  });

  res.json({ isCorrect, correctAnswer: question.respuestaCorrecta, xpDelta });
});

// 3. Guardar resultado de simulacro o diagnóstico
app.post('/api/mock/results', async (req, res) => {
  const { userId, result, isDiagnostic } = req.body;
  const saved = await prisma.mockExamResult.create({
    data: {
      userId,
      isDiagnostic,
      totalQuestions: result.totalQuestions,
      correctCount: result.correctCount,
      incorrectCount: result.incorrectCount,
      unansweredCount: result.unansweredCount,
      timeUsedSeconds: result.timeUsedSeconds,
      globalScoreScaled: result.globalScoreScaled,
      globalPercentage: result.globalPercentage,
      areaBreakdown: result.areaBreakdown,
      recommendations: result.recommendations,
      userAnswers: result.userAnswers,
    },
  });
  res.json(saved);
});

export default app;
```

---

### Paso 5: Reemplazo en el Frontend (`src/context/AppContext.tsx`)
En lugar de persistir en `localStorage.setItem(STORAGE_KEY, ...)`, crea un cliente HTTP sencillo (`api.ts` o TanStack Query):

```typescript
// src/services/api.ts
export async function fetchQuestions(area?: string, limit = 10) {
  const res = await fetch(`/api/questions?limit=${limit}${area ? `&area=${area}` : ''}`);
  return res.json();
}

export async function submitQuestionAnswer(userId: string, questionId: string, option: string) {
  const res = await fetch('/api/user/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, questionId, selectedOption: option }),
  });
  return res.json();
}
```

Reemplaza en `recordQuestionAnswer`:
```typescript
const recordQuestionAnswer = async (question: Question, selectedOption: 'A' | 'B' | 'C' | 'D') => {
  await submitQuestionAnswer(profile.id, question.id, selectedOption);
  // Actualizar estado local reactivo
};
```

---

## 🎯 Resumen de Arquitectura y Beneficios
1. **Frontend Desacoplado:** El cliente React + Vite sigue funcionando a máxima velocidad con Tailwind CSS y tipado estricto.
2. **Cero Deuda Técnica:** Toda la estructura de tipos en `src/types/index.ts` concuerda al 100% con los modelos de Prisma.
3. **Escalabilidad Inmediata:** Tu base de datos Supabase podrá albergar miles de preguntas, usuarios concurrentes, autenticación con Supabase Auth / Google OAuth y reportes de desempeño en tiempo real.
