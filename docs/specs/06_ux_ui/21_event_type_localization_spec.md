# Sistema de Registros Médicos Psiquiátricos — Especificación de Localización de Tipos de Eventos Clínicos

## Resumen Ejecutivo

Este documento define la especificación funcional para la localización de tipos de eventos clínicos en la interfaz de usuario del sistema. Establece un vocabulario clínico canónico en español que garantiza que la UI nunca muestre términos en inglés, manteniendo los identificadores internos sin cambios.

**Versión:** 1.0  
**Estado:** Final  
**Depende de:** `02_domain.md`, `03_timeline.md`, `13_timeline_engine.md`, `14_timeline_contracts.md`, `18_patient_crud_specs.md`  
**Consumido por:** Implementación Backend, Implementación UX, QA Testing

---

## 1. Propósito y Alcance

### 1.1 Objetivo Principal

Definir una especificación de localización de tipos de eventos clínicos para garantizar que la interfaz de usuario del sistema clínico presente exclusivamente términos en español, manteniendo la consistencia lingüística en toda la experiencia del usuario.

### 1.2 Problema que Resuelve

Actualmente, los tipos de eventos clínicos se muestran en la UI utilizando identificadores en inglés (por ejemplo, "Encounter", "Medication Start", "Hospitalization"). Esto viola el principio de idioma único en la UI clínica y genera inconsistencia con el resto de la interfaz, que está completamente en español.

### 1.3 Alcance de la Especificación

Esta especificación cubre:

| Incluido | Excluido |
|----------|----------|
| Traducción de tipos de eventos en timeline | Traducción de otros elementos de UI (fuera de tipos de eventos) |
| Vistas laterales que muestran tipos de eventos | Sistema completo de i18n (internacionalización avanzada) |
| Filtros y búsquedas por tipo de evento | Soporte multi-idioma (solo español) |
| Consistencia textual en toda la UI clínica | Traducción de contenido clínico (notas, descripciones) |
| Vocabulario canónico en español | Cambios a identificadores internos o base de datos |

### 1.4 Principios Fundamentales

1. **Inmutabilidad de Identificadores Internos**: Los identificadores en la base de datos, enums de Prisma, y código interno permanecen en inglés sin cambios.

2. **Separación de Presentación y Datos**: La traducción ocurre exclusivamente en la capa de presentación (UI), no en la capa de datos.

3. **Idioma Único en UI**: Toda la interfaz de usuario debe presentar exclusivamente español, sin excepciones.

4. **Vocabulario Canónico**: Existe un único mapeo autorizado de identificadores internos a términos visibles en español.

---

## 2. Principio de Idioma Único en UI Clínica

### 2.1 Regla Fundamental

**TODA la interfaz de usuario del sistema clínico DEBE presentar texto exclusivamente en español.**

Esta regla aplica a:

- **Etiquetas y rótulos** de tipos de eventos
- **Filtros y opciones** de selección de tipos de eventos
- **Mensajes y notificaciones** relacionadas con eventos
- **Tooltips y ayuda contextual** sobre tipos de eventos
- **Estados vacíos** que mencionen tipos de eventos
- **Mensajes de error** relacionados con tipos de eventos

### 2.2 Excepciones Explícitas

Las siguientes excepciones están permitidas y NO violan el principio:

| Excepción | Justificación |
|-----------|---------------|
| **Identificadores técnicos** (IDs, UUIDs) | No son texto visible para el usuario final |
| **Nombres de campos en base de datos** | No son visibles en la UI |
| **Códigos de error técnicos** (para debugging) | No son visibles para usuarios finales |
| **Comentarios en código fuente** | No son parte de la UI |
| **Logs del sistema** | No son parte de la UI visible |

### 2.3 Casos Prohibidos

Los siguientes casos están **EXPLÍCITAMENTE PROHIBIDOS**:

| Caso Prohibido | Ejemplo Incorrecto | Ejemplo Correcto |
|----------------|-------------------|------------------|
| **Mezcla de idiomas en un mismo componente** | "Encounter - Encuentro" | "Encuentro" |
| **Términos en inglés visibles al usuario** | Mostrar "Medication Start" | Mostrar "Inicio de Medicación" |
| **Tooltips en inglés** | Tooltip: "Clinical encounter" | Tooltip: "Encuentro clínico" |
| **Mensajes de error en inglés** | "Invalid event type" | "Tipo de evento inválido" |
| **Filtros con opciones en inglés** | Filtro: "Encounter" | Filtro: "Encuentro" |

### 2.4 Garantías del Sistema

El sistema debe garantizar:

| Garantía | Descripción |
|----------|-------------|
| **Consistencia absoluta** | Nunca se mostrará un tipo de evento en inglés en ninguna parte de la UI |
| **Traducción completa** | Todos los tipos de eventos tienen traducción canónica |
| **Sin regresión** | Cambios futuros no pueden introducir términos en inglés |
| **Validación automática** | El sistema debe validar que todas las traducciones estén presentes |

---

## 3. Lista Canónica de Tipos de Evento

### 3.1 Mapeo Interno → Visible

La siguiente tabla define el mapeo canónico y autorizado de identificadores internos (en inglés) a términos visibles en español (UI):

| Identificador Interno (Prisma Enum) | Identificador Intermedio (UI Type) | Término Visible en Español (UI) |
|-------------------------------------|-----------------------------------|----------------------------------|
| `Encounter` | `'Encounter'` | **"Encuentro"** |
| `MedicationStart` | `'Medication Start'` | **"Inicio de Medicación"** |
| `MedicationChange` | `'Medication Change'` | **"Cambio de Medicación"** |
| `MedicationStop` | `'Medication Stop'` | **"Suspensión de Medicación"** |
| `Hospitalization` | `'Hospitalization'` | **"Hospitalización"** |
| `LifeEvent` | `'Life Event'` | **"Evento Vital"** |
| `HistoryUpdate` | `'History Update'` | **"Actualización de Historia"** |
| `Other` | `'Other'` | **"Otro"** |

### 3.2 Reglas de Nomenclatura en Español

Los términos visibles deben seguir estas reglas:

| Regla | Aplicación | Ejemplo |
|-------|------------|---------|
| **Capitalización de oración** | Primera letra en mayúscula, resto en minúscula | "Encuentro", no "ENCUENTRO" ni "encuentro" |
| **Sin abreviaciones** | Términos completos, no abreviados | "Inicio de Medicación", no "Inicio Med." |
| **Consistencia terminológica** | Uso consistente de términos médicos estándar | "Medicación" (no "Medicina" ni "Fármaco") |
| **Singular para tipos** | Los tipos se presentan en singular | "Encuentro", no "Encuentros" |
| **Sin artículos** | No incluir artículos determinados | "Encuentro", no "El Encuentro" |

### 3.3 Justificación de Términos

| Término en Español | Justificación Clínica |
|-------------------|----------------------|
| **"Encuentro"** | Término estándar en psiquiatría para interacción clínica directa entre profesional y paciente |
| **"Inicio de Medicación"** | Indica claramente el comienzo de un tratamiento farmacológico |
| **"Cambio de Medicación"** | Refleja modificación de dosis, frecuencia o medicamento |
| **"Suspensión de Medicación"** | Término preciso que indica cese del tratamiento (más específico que "Detención") |
| **"Hospitalización"** | Término médico estándar y reconocido |
| **"Evento Vital"** | Término psiquiátrico estándar para eventos significativos en la vida del paciente |
| **"Actualización de Historia"** | Indica modificación de información histórica psiquiátrica |
| **"Otro"** | Término genérico para eventos no categorizados |

### 3.4 Variantes Prohibidas

Los siguientes términos están **PROHIBIDOS** y no deben usarse:

| Término Prohibido | Término Correcto | Razón |
|------------------|------------------|-------|
| "Encuentro Clínico" | "Encuentro" | Redundante (todos los encuentros son clínicos) |
| "Medicina" | "Medicación" | Término menos preciso en contexto clínico |
| "Fármaco" | "Medicación" | Término menos común en psiquiatría |
| "Detención de Medicación" | "Suspensión de Medicación" | Menos preciso clínicamente |
| "Evento de Vida" | "Evento Vital" | Término menos estándar en psiquiatría |
| "Historia Clínica" | "Historia" (en contexto) | Redundante cuando ya se habla de historia psiquiátrica |
| "Otros" | "Otro" | Debe ser singular para consistencia |

---

## 4. Reglas de Consistencia Textual

### 4.1 Consistencia en Timeline

En la vista de timeline, los tipos de eventos deben:

| Regla | Implementación |
|-------|----------------|
| **Mostrar siempre en español** | El componente `TimelineEvent` debe usar la función de traducción |
| **Mantener formato visual** | El estilo visual (iconos, colores) no cambia, solo el texto |
| **Consistencia tipográfica** | Mismo tamaño, peso y estilo que otros rótulos en timeline |
| **Sin variaciones contextuales** | El mismo tipo de evento siempre muestra el mismo texto |

**Ejemplo de implementación:**
```typescript
// ❌ INCORRECTO: Mostrar directamente el identificador
<span>{event.event_type}</span> // Muestra "Encounter"

// ✅ CORRECTO: Usar función de traducción
<span>{translateEventType(event.event_type)}</span> // Muestra "Encuentro"
```

### 4.2 Consistencia en Vistas Laterales

En paneles laterales, filtros y vistas de detalle:

| Ubicación | Regla |
|----------|-------|
| **Filtros de timeline** | Opciones de filtro deben mostrar términos en español |
| **Paneles de resumen** | Si se mencionan tipos de eventos, deben estar en español |
| **Vistas de detalle de evento** | El tipo de evento debe mostrarse en español |
| **Búsquedas** | Si se permite buscar por tipo, los términos deben estar en español |

### 4.3 Consistencia en Formularios

En formularios que permiten seleccionar o crear eventos:

| Regla | Aplicación |
|-------|------------|
| **Opciones de selección** | Dropdowns, radio buttons, checkboxes muestran términos en español |
| **Etiquetas de campos** | Labels de campos de tipo de evento en español |
| **Mensajes de validación** | Errores relacionados con tipos de eventos en español |
| **Placeholders** | Textos de ayuda en español |

### 4.4 Consistencia en Mensajes del Sistema

| Tipo de Mensaje | Regla |
|-----------------|-------|
| **Mensajes de éxito** | "Evento de tipo 'Encuentro' creado exitosamente" |
| **Mensajes de error** | "Tipo de evento inválido: 'Encounter' no es válido" |
| **Estados vacíos** | "No hay eventos de tipo 'Encuentro' en este período" |
| **Confirmaciones** | "¿Está seguro de crear un evento de tipo 'Hospitalización'?" |

### 4.5 Regla de Inmutabilidad del Mapeo

**El mapeo canónico definido en la Sección 3.1 es INMUTABLE.**

| Restricción | Justificación |
|-------------|---------------|
| **No se pueden agregar variantes** | Evita inconsistencia y confusión |
| **No se pueden modificar términos** | Mantiene consistencia histórica |
| **No se pueden crear alias** | Previene ambigüedad |
| **Cambios requieren actualización de especificación** | Cualquier cambio debe ser documentado y aprobado |

---

## 5. Casos Prohibidos (Mezcla de Idiomas)

### 5.1 Prohibiciones Absolutas

Los siguientes casos están **EXPLÍCITAMENTE PROHIBIDOS** y deben ser detectados y rechazados:

| Caso Prohibido | Ejemplo | Acción Requerida |
|----------------|---------|------------------|
| **Mostrar identificador interno directamente** | Mostrar "Encounter" en UI | Rechazar en code review |
| **Mezcla en mismo componente** | "Encounter (Encuentro)" | Rechazar en code review |
| **Tooltips en inglés** | Tooltip: "Clinical encounter event" | Rechazar en code review |
| **Comentarios en UI** | Comentario visible: "// Encounter type" | Rechazar en code review |
| **Filtros con opciones en inglés** | Filtro: ["Encounter", "Medication Start"] | Rechazar en code review |
| **Mensajes de error en inglés** | "Invalid event type: Encounter" | Rechazar en code review |

### 5.2 Detección de Violaciones

El sistema debe implementar mecanismos para detectar violaciones:

| Mecanismo | Descripción |
|-----------|-------------|
| **Validación en tiempo de desarrollo** | Linter o validación que detecte términos en inglés en componentes UI |
| **Tests automatizados** | Tests que verifiquen que todos los tipos de eventos se muestran en español |
| **Code review checklist** | Checklist que incluya verificación de localización |
| **Validación en runtime (opcional)** | Warnings en consola si se detectan términos no traducidos |

### 5.3 Proceso de Corrección

Si se detecta una violación:

| Paso | Acción |
|------|--------|
| 1. **Identificación** | Identificar el componente y el término en inglés |
| 2. **Mapeo** | Verificar el mapeo canónico en Sección 3.1 |
| 3. **Corrección** | Reemplazar con término en español correcto |
| 4. **Validación** | Verificar que la corrección sigue todas las reglas |
| 5. **Documentación** | Si es necesario, actualizar documentación de implementación |

---

## 6. Impacto en Timeline y Vistas Laterales

### 6.1 Componente Timeline Principal

**Ubicación:** `src/ui/components/Timeline.tsx` y `src/ui/components/TimelineEvent.tsx`

| Cambio Requerido | Descripción |
|-----------------|-------------|
| **Función de traducción** | Crear función `translateEventType()` que mapee identificadores a términos en español |
| **Actualización de renderizado** | Modificar línea 32 de `TimelineEvent.tsx` para usar traducción |
| **Mantenimiento de estilos** | Los estilos visuales (iconos, colores) no cambian |
| **Tests actualizados** | Actualizar tests para verificar términos en español |

**Ejemplo de implementación:**
```typescript
// Nueva función de traducción
function translateEventType(eventType: EventType): string {
  const translations: Record<EventType, string> = {
    'Encounter': 'Encuentro',
    'Medication Start': 'Inicio de Medicación',
    'Medication Change': 'Cambio de Medicación',
    'Medication Stop': 'Suspensión de Medicación',
    'Hospitalization': 'Hospitalización',
    'Life Event': 'Evento Vital',
    'History Update': 'Actualización de Historia',
    'Other': 'Otro',
  };
  return translations[eventType] ?? 'Otro';
}

// Uso en componente
<span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
  {translateEventType(event.event_type)}
</span>
```

### 6.2 Filtros de Timeline

Si existen filtros por tipo de evento:

| Cambio Requerido | Descripción |
|-----------------|-------------|
| **Opciones de filtro** | Todas las opciones deben mostrar términos en español |
| **Valores internos** | Los valores enviados al backend pueden mantener identificadores en inglés |
| **Etiquetas visibles** | Las etiquetas mostradas al usuario deben estar en español |

### 6.3 Paneles Laterales

En paneles que muestran resúmenes o listas de eventos:

| Panel | Cambio Requerido |
|-------|-----------------|
| **Panel de medicaciones activas** | Si menciona "Medication Start", debe mostrar "Inicio de Medicación" |
| **Panel de próximas citas** | Si menciona "Encounter", debe mostrar "Encuentro" |
| **Panel de eventos recientes** | Todos los tipos de eventos deben estar en español |

### 6.4 Vistas de Detalle de Evento

Cuando se muestra el detalle completo de un evento:

| Elemento | Cambio Requerido |
|----------|-----------------|
| **Título del tipo** | Debe mostrar término en español |
| **Metadatos** | Si se muestra "Tipo: Encounter", debe ser "Tipo: Encuentro" |
| **Breadcrumbs** | Si incluyen tipo de evento, deben estar en español |
| **Navegación** | Enlaces relacionados deben usar términos en español |

### 6.5 Formularios de Creación de Eventos

En formularios que permiten crear eventos manuales:

| Elemento | Cambio Requerido |
|----------|-----------------|
| **Campo de selección de tipo** | Dropdown/select debe mostrar opciones en español |
| **Valores internos** | Los valores enviados pueden mantener identificadores en inglés |
| **Validación** | Mensajes de error deben estar en español |
| **Ayuda contextual** | Tooltips y ayuda deben estar en español |

---

## 7. Fuera de Alcance

### 7.1 Explicaciones Explícitas

Los siguientes elementos están **EXPLÍCITAMENTE FUERA DEL ALCANCE** de esta especificación:

| Elemento | Justificación |
|----------|---------------|
| **Sistema completo de i18n (internacionalización)** | Esta especificación solo cubre tipos de eventos, no todo el sistema |
| **Soporte multi-idioma** | El sistema es exclusivamente en español |
| **Traducción de contenido clínico** | Notas, descripciones y contenido clínico no se traducen |
| **Traducción de otros elementos de UI** | Esta especificación solo cubre tipos de eventos |
| **Cambios a base de datos** | Los identificadores en la base de datos permanecen en inglés |
| **Cambios a contratos de API** | Los contratos pueden mantener identificadores en inglés |
| **Traducción de tipos de encuentro** | `EncounterType` (InitialEvaluation, FollowUp, etc.) está fuera de alcance |
| **Traducción de estados** | Estados como "Active", "Finalized" están fuera de alcance |
| **Traducción de tipos de fuente** | `SourceType` (Note, Medication, etc.) está fuera de alcance |

### 7.2 Limitaciones Intencionales

Estas limitaciones son intencionales y no deben interpretarse como omisiones:

| Limitación | Razón |
|-----------|-------|
| **Solo tipos de eventos clínicos** | Mantiene el alcance manejable y específico |
| **No i18n completo** | El sistema no requiere soporte multi-idioma |
| **No traducción de contenido** | El contenido clínico debe permanecer en el idioma original del profesional |

### 7.3 Futuras Expansiones

Si en el futuro se requiere expandir la localización:

| Expansión Futura | Consideración |
|-----------------|---------------|
| **Traducción de tipos de encuentro** | Requeriría nueva especificación similar |
| **Sistema completo de i18n** | Requeriría arquitectura diferente y especificación más amplia |
| **Soporte multi-idioma** | Requeriría cambios arquitectónicos significativos |

---

## 8. Implementación Técnica

### 8.1 Arquitectura de Traducción

La traducción debe implementarse siguiendo este patrón:

```
┌─────────────────────────────────────────────────────────┐
│                    Base de Datos                        │
│  ClinicalEventType enum: Encounter, MedicationStart...  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Capa de Dominio / Backend                   │
│  Mantiene identificadores en inglés (sin cambios)       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Capa de Mapeo (patient-data.ts)              │
│  mapEventType(): Convierte enum → UI type (inglés)      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Capa de Presentación (UI Components)             │
│  translateEventType(): Convierte UI type → Español      │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Ubicación de la Función de Traducción

**Recomendación:** Crear archivo `src/utils/event-type-translations.ts`

```typescript
/**
 * Traducciones canónicas de tipos de eventos clínicos para UI.
 * 
 * Fuente: docs/21_event_type_localization_spec.md
 * 
 * IMPORTANTE: Este mapeo es canónico e inmutable.
 * Cualquier cambio requiere actualización de la especificación.
 */
import type { EventType } from '@/types/ui';

export const EVENT_TYPE_TRANSLATIONS: Record<EventType, string> = {
  'Encounter': 'Encuentro',
  'Medication Start': 'Inicio de Medicación',
  'Medication Change': 'Cambio de Medicación',
  'Medication Stop': 'Suspensión de Medicación',
  'Hospitalization': 'Hospitalización',
  'Life Event': 'Evento Vital',
  'History Update': 'Actualización de Historia',
  'Other': 'Otro',
} as const;

/**
 * Traduce un tipo de evento a su término visible en español.
 * 
 * @param eventType - Tipo de evento (identificador intermedio)
 * @returns Término visible en español
 */
export function translateEventType(eventType: EventType): string {
  return EVENT_TYPE_TRANSLATIONS[eventType] ?? 'Otro';
}
```

### 8.3 Integración en Componentes

**Componente TimelineEvent.tsx:**

```typescript
import { translateEventType } from '@/utils/event-type-translations';

export function TimelineEvent({ event }: TimelineEventProps) {
  // ... código existente ...
  
  return (
    // ... JSX existente ...
    <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {translateEventType(event.event_type)}
    </span>
    // ... resto del JSX ...
  );
}
```

### 8.4 Validación y Tests

**Tests requeridos:**

```typescript
describe('Event Type Translations', () => {
  it('debe traducir todos los tipos de eventos a español', () => {
    const eventTypes: EventType[] = [
      'Encounter',
      'Medication Start',
      'Medication Change',
      'Medication Stop',
      'Hospitalization',
      'Life Event',
      'History Update',
      'Other',
    ];
    
    eventTypes.forEach(type => {
      const translation = translateEventType(type);
      expect(translation).not.toBe(type); // No debe ser el mismo texto
      expect(translation).toMatch(/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]+$/); // Formato correcto
    });
  });
  
  it('debe retornar "Otro" para tipos desconocidos', () => {
    const unknown = 'UnknownType' as EventType;
    expect(translateEventType(unknown)).toBe('Otro');
  });
  
  it('debe mantener consistencia con especificación', () => {
    expect(translateEventType('Encounter')).toBe('Encuentro');
    expect(translateEventType('Medication Start')).toBe('Inicio de Medicación');
    // ... verificar todos los mapeos ...
  });
});
```

### 8.5 Checklist de Implementación

- [ ] Crear archivo `src/utils/event-type-translations.ts` con función de traducción
- [ ] Actualizar `TimelineEvent.tsx` para usar `translateEventType()`
- [ ] Actualizar cualquier filtro que muestre tipos de eventos
- [ ] Actualizar paneles laterales que mencionen tipos de eventos
- [ ] Actualizar formularios que permitan seleccionar tipos de eventos
- [ ] Crear tests para validar traducciones
- [ ] Verificar que no queden términos en inglés en la UI
- [ ] Actualizar documentación de componentes si es necesario

---

## 9. Validación y Cumplimiento

### 9.1 Criterios de Cumplimiento

La implementación cumple con esta especificación si:

| Criterio | Verificación |
|---------|--------------|
| **Todos los tipos de eventos se muestran en español** | Revisión manual de UI + tests automatizados |
| **No hay términos en inglés visibles** | Búsqueda en código de términos prohibidos |
| **El mapeo canónico se respeta** | Comparación con Sección 3.1 |
| **Consistencia en todas las vistas** | Revisión de timeline, filtros, paneles, formularios |
| **Tests pasan** | Suite de tests de traducción completa |

### 9.2 Proceso de Validación

1. **Revisión de código**: Verificar que todos los componentes usen `translateEventType()`
2. **Revisión visual**: Verificar que la UI muestre términos en español
3. **Tests automatizados**: Ejecutar suite de tests de traducción
4. **Búsqueda de términos prohibidos**: Buscar en código términos como "Encounter", "Medication Start" en componentes UI
5. **Revisión de documentación**: Verificar que la documentación refleje los cambios

### 9.3 Mantenimiento Continuo

Para mantener el cumplimiento:

| Actividad | Frecuencia |
|----------|------------|
| **Revisión en code review** | Cada PR que toque componentes de eventos |
| **Ejecución de tests** | En cada build |
| **Búsqueda de términos prohibidos** | En cada release |
| **Actualización de especificación** | Si se agregan nuevos tipos de eventos |

---

## 10. Resumen

### 10.1 Principios Clave

1. **Idioma único en UI**: Toda la interfaz de usuario debe estar exclusivamente en español
2. **Inmutabilidad de identificadores**: Los identificadores internos permanecen en inglés
3. **Vocabulario canónico**: Existe un único mapeo autorizado de identificadores a términos visibles
4. **Separación de capas**: La traducción ocurre solo en la capa de presentación

### 10.2 Mapeo Canónico

| Interno | Visible |
|--------|---------|
| `Encounter` | "Encuentro" |
| `MedicationStart` | "Inicio de Medicación" |
| `MedicationChange` | "Cambio de Medicación" |
| `MedicationStop` | "Suspensión de Medicación" |
| `Hospitalization` | "Hospitalización" |
| `LifeEvent` | "Evento Vital" |
| `HistoryUpdate` | "Actualización de Historia" |
| `Other` | "Otro" |

### 10.3 Impacto

- **Timeline**: Todos los tipos de eventos se muestran en español
- **Filtros**: Opciones de filtro en español
- **Paneles laterales**: Referencias a tipos de eventos en español
- **Formularios**: Opciones de selección en español
- **Mensajes**: Mensajes del sistema en español

### 10.4 Fuera de Alcance

- Sistema completo de i18n
- Soporte multi-idioma
- Traducción de contenido clínico
- Traducción de otros elementos de UI
- Cambios a base de datos o contratos de API

---

*Documento Versión: 1.0*  
*Estado: Final*  
*Última actualización: [Fecha de creación]*  
*Mantenedor: Responsable de Consistencia Lingüística*
