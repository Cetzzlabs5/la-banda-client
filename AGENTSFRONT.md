# CONTEXTO GLOBAL

**"La Banda"** es una plataforma integral (ecosistema nocturno) que conecta bares, boliches y marcas afines en la ciudad.
- **Problema Resuelto:** Fragmentación de la información nocturna y falta de fidelización cruzada.
- **Solución:** Permite descubrir lugares, ganar puntos por consumos y canjearlos por beneficios exclusivos. Provee a los comercios de métricas exactas sobre su clientela y un sistema robusto de validación antifraude.
- **Usuarios Finales:**
  - **Clubbers (B2C):** Jóvenes y adultos que usan la PWA para ver la agenda, sumar puntos mediante escaneo de QRs y acceder a beneficios.
  - **Staff B2B (Mozos, Cajeros, Seguridad):** Usan la PWA de negocios para validar DNIs en puerta, ingresar tickets de consumo, tomar foto-evidencia y generar QRs dinámicos.
  - **Owners B2B (Dueños y Marcas):** Acceden a un panel web para monitorear analíticas, auditar operaciones y configurar promociones.

---

# AGENTES DE IA ESPECIALIZADOS

## [AGENTE: FRONTEND PWA]
**Responsabilidad:** Desarrollo de la interfaz de usuario, PWA B2C/B2B y Panel Web, enfocado en resiliencia offline y UX.
**Tecnologías:** React (v19.2), Vite, TypeScript, React Router (v7), Tailwind CSS (v4.2.1), Chakra UI (@chakra-ui/pin-input), TanStack React Query, Axios, React Hook Form, Zod.
**Reglas Estrictas:**
1. **Tipado Estricto Front-to-Back:** Prohibido usar `any`. Para la validación de formularios, utiliza las reglas integradas de React Hook Form pasándolas como opciones a la función `register` (ej. `required`, `pattern`) y muestra los errores con el componente `<ErrorMessage>`. Obligatorio el uso de Zod para la validación de esquemas/DTOs en respuestas expuestas por el backend (Axios/React Query).
2. **Resiliencia Offline-First:** Configura Service Workers e implementa estrategias de caché en LocalStorage/IndexedDB para garantizar la disponibilidad offline de información crítica (puntos, QR estático de entrada).
3. **Separación de Fetching y UI:** Encapsula toda la lógica de obtención/mutación de estado del servidor con TanStack React Query en hooks personalizados `/hooks`. Prohibido hacer fetch directo dentro de componentes de UI.
4. **Nomenclatura y Estructura:** Utiliza `kebab-case` para archivos y carpetas (`/views/auth/`), `PascalCase` para componentes y clases React, y `camelCase` para variables y funciones.
5. **Estilos Controlados:** Emplea Tailwind CSS como estándar.

## FLUJO DE TRABAJO Y ARQUITECTURA DE REFERENCIA (CLIENT)
El agente debe replicar la arquitectura basándose en los componentes provistos (ej. `AuthAPI`, `LoginView`, `MainLayout`, `router.tsx`) siguiendo estos pasos modulares para el desarrollo de cada nueva pantalla/función:

1. **Definición de Tipos (`/src/types/`):** Define interfaces completas para entidades y genera Sub-Tipos específicos para payloads de Request/Response valiéndote de Utility Types (`Pick`, `Omit`). (Referencia: `types/auth.ts` -> `LoginFormDataType = Pick<Auth, 'email' | 'password'>`).
2. **Capa de Red Pura (`/src/API/`):** Crea funciones asíncronas aisladas y tipadas (ej. `api.post<string>`) mediante Axios (`@/libs/axios`). Engloba el bloque en `try-catch`, retornando solo el `data` de éxito y canalizando los errores mediante `throwStandardError(error)` (`@/utils/apiError`). Prohibido manejar UI o Estado aquí.
3. **Manejos de Mutaciones y UI (`/src/views/`):** Realiza consumos de endpoints que alteren el backend inicializando el hook `useMutation` (TanStack React Query) *dentro del componente visual*. Coordina el ciclo de vida del Request utilizando `onSuccess` para enrutamiento (`useNavigate`) o estado (`toast.success` con `sonner`) y maneja la captura de fallos pasándole al callback `onError` la función `toastApiError`.
4. **Estado Global y Lecturas Constantes (`/src/hooks/`):** Extrae las Request de tipo GET globales (ej. Session, Settings) a hooks de React independientes utilizando `useQuery` (ej. `useAuth()`) manejando explícitamente `retry`, `refetchOnWindowFocus`, `staleTime` y manipulando la caché directamente en la mutación si aplica (ej. `queryClient.setQueryData`) antes de exponer el `data` finalizado al front.
5. **Formularios Predecibles (`react-hook-form`):** Inicializa obligatoriamente `useForm` brindando una interfaz y objeto de `defaultValues` vacío/precargado para tipado automático del Form. Dispara tu función API en el Wrapper de `handleSubmit(onSubmit)` extrayendo los datos desde el spread attribute `{...register("field")}`.
6. **Protección de Rutas (`/src/layouts/` y `/src/router.tsx`):** Declara la existencia de Vistas y Layouts en React Router (v7). Usa arquitecturas de `Layouts` (ej. `MainLayout`) que funcionen como Guards: Inyectan lógica como hooks globales (ej. comprobación de Login `useAuth()`), resuelven UI de cargando/fail (`Navigate to="/login"`), y finalmente actúan de wrapper con el componente dinámico `<Outlet />`.

## [AGENTE: CORE BACKEND]
**Responsabilidad:** Orquestar la lógica de negocio, REST APIs, integración con base de datos y procesamiento de analíticas.
**Tecnologías:** Node.js, Express (v5.2), TypeScript, MongoDB, Mongoose (v9.2), Zod.
**Reglas Estrictas:**
1. **Tipado Estricto y Validación:** Prohibido el uso de `any`. Todos los endpoints de Express deben validar el `body`, `params` y `query` obligatoriamente utilizando middlewares contra esquemas de Zod antes de ejecutar lógica de controladores.
2. **Encapsulamiento Lógico:** Mantén los controladores en la carpeta `/controllers/` limpios y delgados. Delega la lógica de negocio compleja a servicios o utilidades en `/utils/` o modelos en `/models/`.
3. **Manejo Centralizado de Errores:** Implementa un middleware global de errores que estandarice respuestas y evite la fuga de stack-traces al cliente. Captura asincronía limpiamente.
4. **Nomenclatura Unificada:** Aplica `kebab-case` para archivos e importaciones, `PascalCase` para clases (ej. Modelos) y `camelCase` para instancias, variables locales y funciones.
5. **Autonomía Zero-Trust:** Asume que cualquier payload que viene del frontend es hostil. Valida integridad de datos, límites y estados exclusivamente del lado del servidor.

## [AGENTE: SEGURIDAD Y TRANSACCIONES]
**Responsabilidad:** Ejecutar el motor de puntos, validaciones antifraude offline/online, y proteger end-to-end la infraestructura.
**Tecnologías:** JWT (jsonwebtoken), Bcrypt, MongoDB/Mongoose (Session Transactions), Node.js, TypeScript.
**Reglas Estrictas:**
1. **Transacciones ACID Mandatorias:** Toda operación que modifique el balance de puntos o beneficios de un usuario debe envolverse en una transacción de Mongoose (`session.startTransaction()`). Ejecuta auto-rollback ante la mínima falla.
2. **Flujo Anti-Fraude B2B:** Imprime la validación obligatoria de 4 pasos para sumar consumos: Monto + Ticket (referencia) + Foto Evidencia + QR efímero.
3. **QR Dinámicos y Vida Útil:** Genera QRs transaccionales con una caducidad máxima estricta de 60 segundos. Invalida su uso tras el primer escaneo.
4. **Seguridad Zero-Trust:** Prohibido delegar la validación de geolocalización o de estado (vencimiento/duplicidad) al Frontend. El Backend siempre ejerce la validación final y absoluta.
5. **Gestión de Identidad Segura:** Almacena todos los passwords hasheados con Bcrypt. Maneja sesiones via JWT firmados asimétricamente, proveyendo endpoints de revocación y refresco seguro.

---

# ANTI-PATRONES PROHIBIDOS

1. **Confianza Ciega en el Client-Side:** Validar geolocalización o caducidad de códigos QR y promociones únicamente en la PWA frontend. El backend asume el control absoluto; el frontend es solo una vía de representación.
2. **Mutaciones Disjuntas en DB (No ACID):** Actualizar perfiles, agregar consumos o debitar puntos usando múltiples operaciones `Model.updateOne()` o `.save()` aisladas sin una sesión transaccional. Esto genera desincronización de saldos en caso de caída de un nodo o latencia.
3. **TypeScript Decorativo (`any` / Type-Casting Forzado):** Evadir el chequeo de tipos estático usando `any` o sobreescribiendo tipos (`as MyType`) sin una validación dinámica (Zod) subyacente. Los datos mutables o externos siempre deben parsearse, no castearse.

---

## Database Schema & Domain Knowledge

### 1. Usuarios (`users`)

Los usuarios son entidades independientes. No deben conocer bares, grupos ni puntos directamente.

```js
users {
  _id,
  name,
  lastName,
  birthdate,
  email,
  password,
  role,           // USER | OWNER | WAITER | ADMIN
  avatarUrl,
  isActive,
  createdAt,
  updatedAt
}
```

**Claves del diseño**
- El rol es global
- Los puntos no viven acá
- No hay arrays que crezcan sin límite

---

### 2. Bares (`bars`) — agregado raíz

El bar es el centro operativo del sistema. Todo lo que depende exclusivamente del bar se embebe.

```js
bars {
  _id,
  name,
  address,
  logoUrl,
  isActive,
  waiters: [
    {
      userId,
      isActive,
      assignedAt
    }
  ],
  createdAt
}
```

**Por qué embebido**
- Los mozos solo existen en el contexto del bar
- No se consultan globalmente
- Se accede siempre desde el bar

---

### 3. Grupos (`groups`) — agregado social

Los grupos son estables, pequeños y muy consultados. Sus relaciones se embeben.

```js
groups {
  _id,
  name,
  logoUrl,
  leaderId,
  inviteCode,
  members: [
    {
      userId,
      joinedAt
    }
  ],
  invitations: [
    {
      email,
      invitedBy,
      status,
      expiresAt,
      createdAt
    }
  ],
  createdAt
}
```

**Ventajas**
- Validar membresía sin lookup
- Crear salidas rápido
- Listar grupos por usuario con índice en `members.userId`

---

### 4. Puntos por bar (colecciones separadas)

Los puntos **NO** se embeben en usuarios ni grupos.

#### Usuario por bar

```js
userBarPoints {
  _id,
  userId,
  barId,
  totalPoints,
  updatedAt
}
```

#### Grupo por bar

```js
groupBarPoints {
  _id,
  groupId,
  barId,
  totalPoints,
  updatedAt
}
```

**Motivo**
- Rankings
- Queries por bar
- Actualizaciones frecuentes
- Índices `{ barId, userId }` y `{ barId, groupId }`

---

### 5. Salidas (`outings`) — agregado de evento

Las salidas son eventos acotados en tamaño. La asistencia se embebe.

```js
outings {
  _id,
  groupId,
  barId,
  leaderId,
  status,  // PENDING | ACTIVE | COMPLETED | CANCELLED
  scheduledFor,
  startedAt,
  qrToken,
  attendances: [
    {
      userId,
      confirmedAt
    }
  ],
  createdAt
}
```

- El número de asistentes es limitado
- Siempre se consulta junto a la salida
- Evita N+1 lookups

---

### 6. Sesiones de asistencia QR (`attendanceSessions`)

Las sesiones son efímeras pero auditables.

```js
attendanceSessions {
  _id,
  outingId,
  groupId,
  barId,
  waiterUserId,
  qrToken,
  status,
  expiresAt,
  createdAt
}
```

**Colección separada porque:**
- Expiran
- Se validan por token
- Pueden auditarse

---

### 7. Consumos (`consumptions`) — histórico

Nunca se embeben.

```js
consumptions {
  _id,
  outingId,
  groupId,
  barId,
  waiterUserId,
  amount,
  basePoints,
  multiplier,
  tableNumber,
  createdAt
}
```

**Son:**
- Registros financieros
- Base de puntos
- Crecientes sin límite

---

### 8. Promociones y canjes

#### Promociones (`promotions`)

```js
promotions {
  _id,
  barId,
  title,
  description,
  costPoints,
  stock,
  isActive,
  validUntil,
  createdAt
}
```

#### Canjes (`redemptions`)

```js
redemptions {
  _id,
  userId,
  groupId,
  promotionId,
  barId,
  pointsSpent,
  redeemedAt
}
```

**Separados porque:**
- Stock
- Control antifraude
- Reporting

---

### 9. Transacciones de puntos (`pointsTransactions`) — auditoría total

```js
pointsTransactions {
  _id,
  userId,
  groupId,
  barId,
  type,        // EARN | REDEEM
  amount,
  description,
  createdAt
}
```

> Nunca se recalcula, nunca se borra.

---

### 10. Misiones del bar (`barMissions`)

```js
barMissions {
  _id,
  barId,
  title,
  description,
  type,
  goal,
  unit,
  rewardPoints,
  isActive,
  validUntil
}
```

---

# La Banda — Design System & Agent Rules

> Este archivo define las reglas de diseño, arquitectura y estilo que el agente **siempre** debe respetar al generar o modificar código del proyecto.

---

## 0. Principio fundamental

Nunca uses valores hardcodeados de color, tipografía, spacing o animación.
**Todo** sale de los tokens del design system definidos en `index.css` (variables CSS `--color-*`, `--font-*`, `--space-*`, etc.) o del archivo `src/app/components/ui/ds.ts` cuando usas JS/TSX.

---

## 1. Estructura de archivos (arquitectura escalable)

```
src/
├── app/
│   ├── components/
│   │   ├── ui/           ← primitivos reutilizables (Button, Card, Badge, Input…)
│   │   │   └── ds.ts     ← tokens JS (C, F)
│   │   ├── shared/       ← componentes compuestos reutilizables (PointsCard, LevelBadge…)
│   │   └── layout/       ← Layout, BottomNav, PageWrapper
│   ├── pages/            ← una página = un archivo, sin lógica de negocio pesada
│   ├── hooks/            ← custom hooks (useAuth, usePoints…)
│   ├── data/             ← mockData, types, schemas
│   └── routes.tsx
├── styles/
│   └── index.css         ← fuente de verdad de todos los tokens
```

**Reglas de arquitectura:**
- Un componente = un único responsable. Si supera ~120 líneas, extráelo.
- Props mínimas: usa variantes (`variant="primary" | "ghost"`) en vez de props booleanas múltiples.
- No dupliques estilos en línea que ya existan como clase utilitaria en `index.css`.
- Usa `React.memo` en componentes de lista (cards, items de nav).

---

## 2. Tokens de color

Los colores vienen de las variables CSS. En TSX usa el objeto `C` de `ds.ts`:

| Token CSS                    | JS (`C.`)          | Valor          | Uso |
|------------------------------|--------------------|----------------|-----|
| `--color-lime`               | `C.lime`           | `#C8FF00`      | Acento principal, puntos, activo |
| `--color-lime-dim`           | `C.limeDim`        | rgba lime 12%  | Fondo de elementos activos/lime |
| `--color-lime-glow`          | `C.limeGlow`       | rgba lime 25%  | Glow blobs decorativos |
| `--color-lime-border`        | `C.limeBorder`     | rgba lime 22%  | Bordes con acento lime |
| `--color-bg`                 | `C.bg`             | `#080808`      | Fondo de la app |
| `--color-surface`            | `C.surface`        | `#111111`      | Cards principales |
| `--color-surface-2`          | `C.surface2`       | `#181818`      | Cards secundarias, inputs |
| `--color-surface-3`          | `C.surface3`       | `#202020`      | Hover states, layers |
| `--color-border`             | `C.border`         | rgba white 7%  | Bordes sutiles |
| `--color-border-hover`       | `C.borderHover`    | rgba white 14% | Hover en bordes |
| `--color-text-primary`       | `C.textPrimary`    | `#FFFFFF`      | Texto principal |
| `--color-text-secondary`     | `C.textSecondary`  | `#888888`      | Texto secundario |
| `--color-text-muted`         | `C.textMuted`      | `#444444`      | Labels, overlines |
| `--color-error`              | `C.error`          | `#FF4455`      | Errores, destructivos |
| `--color-error-dim`          | `C.errorDim`       | rgba error 15% | Fondo de estados error |

---

## 3. Tipografía

### Familias

| Uso | Familia | Token JS |
|-----|---------|----------|
| Títulos, números grandes, nombre de bares, puntos totales | `Space Grotesk` | `F.display` |
| Botones, inputs, labels, cuerpo, navegación | `Plus Jakarta Sans` | `F.ui` |

### Escala de texto (usa las variables CSS)

| Variable CSS       | rem      | px aprox. | Uso típico |
|--------------------|----------|-----------|------------|
| `--text-xs`        | 0.65rem  | 10px      | Overlines, etiquetas (`letterSpacing: widest`) |
| `--text-sm`        | 0.75rem  | 12px      | Captions, muted text |
| `--text-base`      | 0.875rem | 14px      | Cuerpo, botones, nav labels |
| `--text-md`        | 1rem     | 16px      | Subtítulos |
| `--text-lg`        | 1.2rem   | 19px      | Títulos de sección |
| `--text-xl`        | 1.6rem   | 25px      | Headings de página |
| `--text-2xl`       | 2.4rem   | 38px      | Hero heading |
| `--text-3xl`       | 3.6rem   | 57px      | Número de puntos (display) |

### Reglas tipográficas

- Los números de puntos/estadísticas usan **siempre** `F.display` + `--text-3xl` + `color: C.lime`.
- Los overlines van en `uppercase` + `letterSpacing: 0.18–0.22em` + `color: C.textMuted`.
- Los headings de página usan `letterSpacing: -0.03 a -0.04em` (tight).
- Nunca uses `font-size` en px directamente; usa los tokens `--text-*`.

---

## 4. Spacing

Usa múltiplos de 4px. Preferir las clases de Tailwind (`gap-2`, `px-4`) o las variables CSS.

| Variable       | Valor |
|----------------|-------|
| `--space-1`    | 4px   |
| `--space-2`    | 8px   |
| `--space-3`    | 12px  |
| `--space-4`    | 16px  |
| `--space-5`    | 20px  |
| `--space-6`    | 24px  |

- Padding horizontal de página: `px-4` (16px) — `var(--page-padding-x)`.
- Padding top de página: `pt-5` (20px).
- Padding bottom de página: usa clase `.pb-nav` para respetar la bottom nav + safe area.

---

## 5. Border radius

| Variable        | Valor  | Uso |
|-----------------|--------|-----|
| `--radius-sm`   | 8px    | Chips, badges pequeños |
| `--radius-md`   | 12px   | Botones, inputs, iconos |
| `--radius-lg`   | 16px   | Cards compactas |
| `--radius-xl`   | 20px   | Cards principales |
| `--radius-2xl`  | 24px   | Modals, bottom sheets |
| `--radius-full` | 9999px | Pills, avatares |

---

## 6. Sombras y efectos

- Glow del acento lime: `box-shadow: var(--shadow-lime)` — solo en el CTA principal o elemento destacado.
- Glow blob decorativo: `<div className="glow-blob" style={{ width: 200, height: 200, top: -50, right: -50 }} />` — solo 1–2 por pantalla, con `opacity: 0.15–0.25`.
- No uses `box-shadow` oscuro en superficies oscuras; usa bordes con opacidad en su lugar.
- Backdrop blur en bottom nav y modals: `backdrop-filter: blur(24px)` + `background: rgba(8,8,8,0.96)`.

---

## 7. Animaciones (Framer Motion)

### Patrones estándar

```tsx
// Entrada de página / sección principal
initial={{ y: 16, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}

// Entrada escalonada (lista de cards)
// Wrapper
initial="hidden"
animate="visible"
variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
// Cada item
variants={{ hidden: { y: 12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}

// Feedback táctil en botones/cards
whileTap={{ scale: 0.97 }}

// Aparición suave con delay
initial={{ y: 16, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ delay: 0.08 }}

// Modal / bottom sheet
initial={{ y: "100%" }}
animate={{ y: 0 }}
exit={{ y: "100%" }}
transition={{ type: "spring", damping: 28, stiffness: 300 }}
```

### Reglas de animación

- **Siempre** usa `whileTap={{ scale: 0.97 }}` en botones principales y cards presionables.
- **Nunca** animes `width`, `height` o `layout` sin `layout` prop de Framer — puede causar jank.
- Delay máximo en stagger: `0.06s` por item. No más de 6 items animados simultáneamente.
- Duración estándar: `120ms` (micro-interacciones), `220ms` (transiciones), `380ms` (modals).
- Usa `AnimatePresence` con `mode="wait"` para transiciones de página.

---

## 8. Componentes — Patrones y variantes

### Button

```tsx
// Variantes: "primary" | "ghost" | "outline" | "danger"
// Tamaños: "sm" | "md" | "lg"
// Nunca crear botones con estilos inline completos; usar el componente Button con variant.
<Button variant="primary" size="lg">Escanear QR</Button>
```

Estilos por variante:
- `primary`: `bg: C.lime`, `color: C.bg`, `borderRadius: --radius-md`, font `F.ui` semibold
- `ghost`: `bg: transparent`, `color: C.textSecondary`, hover `bg: C.surface2`
- `outline`: `bg: transparent`, `border: C.border`, `color: C.textPrimary`, hover `border: C.borderHover`
- `danger`: `bg: C.errorDim`, `color: C.error`, `border: C.errorBorder`

### Card

Siempre usa `--radius-xl` y `border: 1px solid C.border`. Hover state: `border-color: C.borderHover`.
Cards con acento lime: `background: C.limeDim`, `border: C.limeBorder`.

### Input

- `background: C.surface2`, `border: 1px solid C.border`
- Focus: `border-color: C.limeBorder`, `box-shadow: 0 0 0 3px rgba(200,255,0,0.08)`
- Error: `border-color: C.errorBorder`
- `borderRadius: --radius-md`, `padding: 12px 16px`

### Badge / Level chip

```tsx
// Usa el objeto LEVEL_COLORS para el color del nivel
const LEVEL_COLORS = {
  Bronze: "var(--color-level-bronze)",
  Silver: "var(--color-level-silver)",
  Gold: "var(--color-level-gold)",
  Platinum: "var(--color-level-platinum)",
  Diamond: "var(--color-level-diamond)",
};
```

### Bottom Navigation

- Máximo **4 items**.
- Icono activo: `color: C.lime`, fondo `C.limeDim`, `borderRadius: --radius-md`.
- Icono inactivo: `color: #555`.
- Label activo: `color: C.lime`, `fontWeight: 600`.
- Label inactivo: `color: #444`, `fontWeight: 400`.
- Siempre incluye `safe-area-inset-bottom`.

---

## 9. Layout y responsive

- La app es **mobile-first** con `maxWidth: 430px` centrado.
- Nunca uses breakpoints `lg:` o `xl:` — la UI es solo móvil.
- Usa `sm:` únicamente para ajustes menores de padding/font en pantallas muy pequeñas (< 375px).
- El contenido principal siempre tiene `pb-nav` para no quedar bajo la bottom nav.
- Usa `overflow-y: auto` en el `<main>`, nunca en el `<body>`.

---

## 10. Patrones visuales de la app

### Glow blob de fondo (decorativo)
```tsx
<div
  className="absolute pointer-events-none rounded-full"
  style={{
    width: 320, height: 256,
    top: 0, left: "50%", transform: "translateX(-50%)",
    background: "var(--color-lime-glow)",
    filter: "blur(80px)",
    opacity: 0.18,
  }}
/>
```
Máximo **2 blobs por pantalla**. Uno en top, uno en bottom (opcional).

### Radial gradient de fondo en Layout
```css
background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200,255,0,0.07) 0%, transparent 70%);
```

### Overline label
```tsx
<p className="overline">Mis puntos</p>
/* o en inline: fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMuted */
```

---

## 11. Reglas que NUNCA se deben romper

1. **Nunca** uses colores fuera del design system (ni `#fff`, ni `black`, ni `gray-500` de Tailwind sin mapear a un token).
2. **Nunca** dupliques componentes UI — si existe en `ui/`, úsalo.
3. **Nunca** pongas lógica de negocio en componentes de presentación.
4. **Nunca** uses `style={{ fontFamily: "..." }}` inline — siempre `F.display` o `F.ui` desde `ds.ts`.
5. **Nunca** uses la bottom nav con más de 4 ítems.
6. **Nunca** uses `position: absolute` fuera de elementos decorativos (blobs, badges de notificación).
7. **Siempre** incluye `whileTap={{ scale: 0.97 }}` en botones y cards presionables.
8. **Siempre** usa `AnimatePresence` si un componente puede aparecer/desaparecer del DOM.
9. **Siempre** usa `var(--color-*)` en CSS puro y `C.*` en TSX — nunca valores literales.
10. **Siempre** respeta `maxWidth: 430px` — esta app NO es responsive más allá de móvil.

---

## 12. Referencia rápida de imports

```tsx
// Tokens de diseño
import { C, F } from "@/app/components/ui/ds";

// Animaciones
import { motion, AnimatePresence } from "motion/react";

// Navegación
import { useNavigate, NavLink } from "react-router";

// Iconos (Lucide)
import { Bell, Zap, Users, QrCode, TrendingUp, ChevronRight, MapPin, Star } from "lucide-react";
```