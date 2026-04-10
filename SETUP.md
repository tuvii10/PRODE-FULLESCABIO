# Prode Fullescabio Mundial 2026 — Guía de setup y deploy

## 1. Requisitos previos
- Node.js 20+
- Cuenta en [Supabase](https://supabase.com) (free tier alcanza para empezar)
- Cuenta en [Vercel](https://vercel.com) (para deploy, gratuito)

---

## 2. Crear proyecto en Supabase

1. Ir a https://app.supabase.com → **New project**
2. Elegir nombre, contraseña y región (America South es una buena opción)
3. Esperar ~2 min a que el proyecto se inicialice

---

## 3. Configurar la base de datos

### Opción A — Supabase Dashboard (más fácil)
1. En tu proyecto Supabase → **SQL Editor**
2. Pegar el contenido de `supabase/migrations/001_initial_schema.sql` y ejecutar
3. Luego pegar `supabase/seed.sql` y ejecutar (partidos de ejemplo)

### Opción B — Supabase CLI
```bash
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
npx supabase db push
npx supabase db seed
```

---

## 4. Obtener credenciales de Supabase
En tu proyecto → **Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon / public key
- `SUPABASE_SERVICE_ROLE_KEY` → service_role key (¡nunca exponer en frontend!)

---

## 5. Configurar variables de entorno

Copiar `.env.local.example` a `.env.local` y completar:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 6. Configurar Auth en Supabase
1. **Authentication → Settings**:
   - Site URL: `http://localhost:3000` (para dev) / URL de Vercel (para prod)
   - Redirect URLs: agregar `http://localhost:3000/auth/callback` y `https://TU-DOMINIO/auth/callback`
2. **Email → Magic Link**: debe estar habilitado (está por defecto)
3. **Rate limiting**: por defecto ya tiene protección contra spam

---

## 7. Crear primer usuario admin

Después de registrarte con tu email en la app:
1. Ir al **SQL Editor** en Supabase
2. Ejecutar:
```sql
UPDATE profiles
SET is_admin = TRUE
WHERE email = 'TU_EMAIL@ejemplo.com';
```

---

## 8. Correr en desarrollo

```bash
cd prode-fullescabio
npm install
npm run dev
```
Abrir http://localhost:3000

---

## 9. Deploy en Vercel

```bash
# Instalar Vercel CLI si no lo tenés
npm i -g vercel

# Deploy
vercel

# O conectar el repo de GitHub y dejar que Vercel haga autodeploy
```

En Vercel → **Settings → Environment Variables**, agregar las 4 variables de `.env.local`.

Actualizar `NEXT_PUBLIC_SITE_URL` con la URL de Vercel producción.
Actualizar Supabase Auth → Site URL con la misma URL.

---

## 10. Flujo completo de uso

### Para participantes:
1. Entran a la URL → **Participar**
2. Ingresan email → reciben magic link
3. Hacen clic → entran a su panel
4. Cargan pronósticos por partido
5. Siguen el ranking en tiempo real

### Para el admin:
1. Login normal → acceder a `/admin`
2. **Partidos**: crear/editar partidos, cargar resultados cuando terminan
3. Al guardar resultado con status "Finalizado", el sistema recalcula puntos automáticamente
4. **Usuarios**: ver listado, suspender si hay fraude
5. **Ranking**: ver tabla completa, exportar CSV

---

## 11. Habilitar Google Login (futuro)

En Supabase → **Authentication → Providers → Google**:
1. Crear OAuth app en Google Cloud Console
2. Pegar Client ID y Secret en Supabase
3. El sistema de unicidad ya está preparado: Supabase maneja la deduplicación por email

En el código, agregar en `login/page.tsx`:
```tsx
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/auth/callback` },
});
```

---

## 12. Estructura de carpetas

```
prode-fullescabio/
├── app/
│   ├── (auth)/login/         → Página de login con magic link
│   ├── (auth)/verify/        → Confirmación de email
│   ├── (dashboard)/          → Layout autenticado
│   │   ├── dashboard/        → Panel principal del usuario
│   │   ├── predictions/      → Carga de pronósticos
│   │   └── ranking/          → Ranking top 50
│   ├── admin/                → Panel de administración
│   │   ├── matches/          → CRUD de partidos + resultados
│   │   ├── users/            → Gestión de usuarios
│   │   ├── ranking/          → Ranking completo
│   │   └── settings/         → Config del torneo
│   ├── api/                  → API Routes
│   │   ├── admin/matches/[id]/ → PATCH/DELETE partido
│   │   ├── admin/users/[id]/   → PATCH usuario (suspender)
│   │   ├── admin/users/export/ → GET CSV export
│   │   ├── admin/settings/     → PATCH settings
│   │   └── rankings/           → GET ranking público
│   ├── auth/callback/        → Callback de Supabase Auth
│   ├── layout.tsx
│   └── page.tsx              → Landing page
├── components/
│   ├── layout/navbar.tsx     → Navbar top (desktop) + bottom tabs (mobile)
│   ├── predictions/prediction-form.tsx → Formulario de pronóstico
│   └── admin/match-form.tsx  → Formulario de partido (admin)
├── lib/
│   ├── supabase/client.ts    → Cliente browser
│   ├── supabase/server.ts    → Cliente server + service
│   ├── types/                → Tipos TypeScript
│   └── utils/points.ts       → Cálculo de puntos + helpers
├── supabase/
│   ├── migrations/001_initial_schema.sql
│   └── seed.sql
├── middleware.ts             → Auth guard + admin guard
└── SETUP.md
```

---

## 13. Sistema de puntos (resumen)

| Acierto | Puntos |
|---------|--------|
| Marcador exacto (ej: 2-1 y fue 2-1) | **3 pts** |
| Ganador/empate correcto (ej: pronosticó 1-0, fue 2-0) | **1 pt** |
| Fallo | **0 pts** |

**Desempate en ranking:**
1. Mayor cantidad de resultados exactos
2. Mayor cantidad de aciertos ganador/empate
3. Registro más antiguo (primero en anotarse)

---

## 14. Notas de seguridad

- Row Level Security activo en todas las tablas
- Los pronósticos se bloquean a nivel DB cuando `match_date <= NOW()` o `status != 'upcoming'`
- El admin usa service_role key solo en API routes (server-side, nunca en cliente)
- Un usuario no puede ver ni modificar pronósticos ajenos
- Rate limiting de magic link: Supabase lo aplica por defecto (3 emails/hora por IP)
