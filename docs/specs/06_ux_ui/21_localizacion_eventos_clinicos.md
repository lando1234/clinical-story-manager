# Sistema de Registros Médicos Psiquiátricos — Especificación de Localización de Tipos de Eventos Clínicos

## Resumen Ejecutivo

Este documento define la especificación funcional para la localización de tipos de eventos clínicos en la interfaz de usuario del Sistema de Registros Médicos Psiquiátricos.

**Objetivo principal:** Garantizar que todos los términos relacionados con tipos de eventos clínicos se muestren exclusivamente en español en la interfaz de usuario, manteniendo los identificadores internos en inglés para la integridad del sistema.

**Alcance:** Esta especificación cubre únicamente la presentación visual de tipos de eventos en la UI. No modifica la estructura de datos, los identificadores internos, ni los contratos de API.

---

## 1. Principio de Idioma Único en UI Clínica

### 1.1 Regla Fundamental

**La interfaz de usuario del sistema clínico debe presentar todos los términos relacionados con tipos de eventos clínicos exclusivamente en español.**

Esta regla aplica a:
- Etiquetas de tipos de eventos en la línea de tiempo (timeline)
- Opciones de filtrado por tipo de evento
- Selectores de tipo de evento en formularios
- Mensajes y descripciones que mencionen tipos de eventos
- Vistas laterales y paneles de detalle
- Cualquier texto visible al usuario relacionado con tipos de eventos

### 1.2 Separación de Responsabilidades

**Identificadores Internos (Backend/Database):**
- Permanecen en inglés (camelCase/PascalCase)
- No se modifican ni traducen
- Ejemplos: `Encounter`, `MedicationStart`, `LifeEvent`

**Presentación Visual (Frontend/UI):**
- Deben mostrarse en español
- Se obtienen mediante mapeo desde identificadores internos
- Ejemplos: "Encuentro", "Inicio de Medicación", "Evento Vital"

### 1.3 Justificación

1. **Consistencia clínica:** Los profesionales de la salud en el contexto de uso trabajan en español
2. **Claridad:** Reduce ambigüedad y mejora la comprensión del contexto clínico
3. **Profesionalismo:** Presenta una interfaz coherente y profesional
4. **Mantenibilidad:** Separa la lógica de negocio (inglés) de la presentación (español)

---

## 2. Lista Canónica de Tipos de Evento

### 2.1 Mapeo Interno → Visible

La siguiente tabla define el mapeo canónico entre identificadores internos (que permanecen inmutables) y las etiquetas visibles en español:

| Identificador Interno | Etiqueta Visible (Español) | Contexto Clínico |
|----------------------|----------------------------|-------------------|
| `Encounter` | **Encuentro** | Interacción clínica directa entre profesional y paciente |
| `MedicationStart` | **Inicio de Medicación** | Inicio de un tratamiento farmacológico |
| `MedicationChange` | **Cambio de Medicación** | Modificación de dosis o frecuencia de medicación |
| `MedicationStop` | **Suspensión de Medicación** | Discontinuación de un tratamiento farmacológico |
| `Hospitalization` | **Hospitalización** | Episodio de atención psiquiátrica hospitalaria |
| `LifeEvent` | **Evento Vital** | Acontecimiento significativo en la vida del paciente |
| `HistoryUpdate` | **Actualización de Historia** | Revisión o corrección de la historia psiquiátrica |
| `Other` | **Otro** | Evento clínicamente significativo fuera de categorías estándar |

### 2.2 Reglas de Capitalización

**En la interfaz de usuario:**
- **Primera letra en mayúscula** para todos los tipos de eventos
- **Resto en minúsculas** (excepto nombres propios si aplican)
- **Sin mayúsculas intermedias** (no "Inicio De Medicación")

**Ejemplos correctos:**
- ✅ "Inicio de Medicación"
- ✅ "Evento Vital"
- ✅ "Actualización de Historia"

**Ejemplos incorrectos:**
- ❌ "INICIO DE MEDICACIÓN" (todo mayúsculas)
- ❌ "inicio de medicación" (todo minúsculas)
- ❌ "Inicio De Medicación" (mayúsculas intermedias)

### 2.3 Uso de Artículos y Preposiciones

Los tipos de eventos se presentan **sin artículos** cuando aparecen como etiquetas o en listas:

- ✅ "Encuentro"
- ✅ "Inicio de Medicación"
- ❌ "El Encuentro"
- ❌ "Un Inicio de Medicación"

En frases descriptivas, se pueden usar artículos según el contexto:
- ✅ "Se registró un Encuentro"
- ✅ "El Encuentro fue documentado"

---

## 3. Reglas de Consistencia Textual

### 3.1 Terminología Clínica Estándar

**Términos preferidos:**
- **"Medicación"** (no "Medicina", "Fármaco", "Droga")
- **"Suspensión"** (no "Detención", "Finalización", "Cese")
- **"Evento Vital"** (no "Evento de Vida", "Acontecimiento Vital")
- **"Actualización de Historia"** (no "Actualización Histórica", "Revisión de Historia")

### 3.2 Pluralización

Cuando se requiere plural, se mantiene la estructura:
- "Encuentros" (plural de "Encuentro")
- "Inicios de Medicación" (plural de "Inicio de Medicación")
- "Cambios de Medicación" (plural de "Cambio de Medicación")
- "Suspensiones de Medicación" (plural de "Suspensión de Medicación")
- "Hospitalizaciones" (plural de "Hospitalización")
- "Eventos Vitales" (plural de "Evento Vital")
- "Actualizaciones de Historia" (plural de "Actualización de Historia")
- "Otros" (plural de "Otro")

### 3.3 Abreviaciones

**No se permiten abreviaciones** de tipos de eventos en la interfaz de usuario:
- ❌ "Enc." por "Encuentro"
- ❌ "Med. Inicio" por "Inicio de Medicación"
- ❌ "Hosp." por "Hospitalización"

**Excepción:** En contextos de espacio extremadamente limitado (por ejemplo, tooltips o etiquetas de iconos), se puede usar el término completo con truncamiento visual controlado por CSS, pero nunca abreviaciones arbitrarias.

---

## 4. Casos Prohibidos (Mezcla de Idiomas)

### 4.1 Prohibiciones Absolutas

**NUNCA se debe mostrar en la UI:**

1. **Identificadores internos en inglés:**
   - ❌ "Encounter"
   - ❌ "MedicationStart"
   - ❌ "LifeEvent"

2. **Mezcla de idiomas:**
   - ❌ "Encuentro (Encounter)"
   - ❌ "Medication Start" (con espacio)
   - ❌ "Evento Life"

3. **Traducciones parciales:**
   - ❌ "Medication Inicio"
   - ❌ "Encuentro Event"
   - ❌ "Hospitalización Event"

4. **Términos técnicos en inglés:**
   - ❌ "Event Type: Encounter"
   - ❌ "Tipo: MedicationStart"
   - ❌ "Filter by Event Type"

### 4.2 Casos Específicos a Evitar

**En la línea de tiempo (Timeline):**
- ❌ Mostrar `event.event_type` directamente sin mapeo
- ❌ Usar identificadores internos como texto visible
- ❌ Mostrar "Type: Encounter" en lugar de "Tipo: Encuentro"

**En filtros:**
- ❌ Opciones de filtro en inglés: "Filter by: Encounter, Medication Start..."
- ❌ Etiquetas de checkbox en inglés: "Show Encounter events"
- ❌ Placeholders en inglés: "Select event type..."

**En formularios:**
- ❌ Selectores con valores en inglés: `<option value="Encounter">Encounter</option>`
- ❌ Labels en inglés: "Event Type:"
- ❌ Mensajes de validación en inglés: "Please select an event type"

**En vistas laterales:**
- ❌ Títulos de sección en inglés: "Event Details"
- ❌ Campos en inglés: "Event Type: Encounter"
- ❌ Botones en inglés: "Close", "Edit Event"

### 4.3 Validación de Consistencia

Cualquier componente que muestre tipos de eventos debe:
1. **Usar el mapeo canónico** definido en la sección 2.1
2. **Nunca acceder directamente** a identificadores internos para presentación
3. **Validar en tiempo de desarrollo** que no hay strings hardcodeados en inglés
4. **Revisar en pruebas** que todos los textos visibles están en español

---

## 5. Impacto en Timeline y Vistas Laterales

### 5.1 Línea de Tiempo (Timeline)

**Componente:** `TimelineEvent.tsx`

**Cambios requeridos:**
1. **Etiqueta de tipo de evento:**
   - **Antes:** `{event.event_type}` (muestra "Encounter", "Medication Start", etc.)
   - **Después:** Usar función de mapeo que retorne "Encuentro", "Inicio de Medicación", etc.

2. **Estilos por tipo:**
   - La función `getEventStyle()` debe recibir el identificador interno pero mostrar el texto en español
   - Los casos del `switch` deben usar identificadores internos para lógica, pero el texto visible debe ser español

3. **Tooltips y ayudas:**
   - Cualquier texto de ayuda debe estar en español
   - Ejemplo: "Este evento representa un encuentro clínico documentado"

### 5.2 Vistas Laterales (Side Panels)

**Componentes afectados:**
- Detalles de evento
- Formularios de creación/edición
- Paneles de información contextual

**Requisitos:**
1. **Títulos de sección:**
   - "Detalles del Evento" (no "Event Details")
   - "Tipo de Evento" (no "Event Type")

2. **Valores mostrados:**
   - "Tipo: Encuentro" (no "Type: Encounter")
   - "Tipo: Inicio de Medicación" (no "Type: Medication Start")

3. **Selectores en formularios:**
   ```html
   <!-- Correcto -->
   <option value="Encounter">Encuentro</option>
   <option value="MedicationStart">Inicio de Medicación</option>
   
   <!-- Incorrecto -->
   <option value="Encounter">Encounter</option>
   <option value="MedicationStart">Medication Start</option>
   ```

### 5.3 Filtros y Búsqueda

**Componentes de filtrado:**
- Dropdowns de tipo de evento
- Checkboxes de filtro
- Etiquetas de filtros activos

**Requisitos:**
1. **Opciones de filtro:**
   - "Todos los eventos" (no "All events")
   - "Solo encuentros" (no "Encounter events only")
   - "Solo medicaciones" (no "Medication events only")

2. **Etiquetas de filtros aplicados:**
   - "Filtrado por: Encuentro" (no "Filtered by: Encounter")
   - "Mostrando: Inicio de Medicación" (no "Showing: Medication Start")

3. **Placeholders:**
   - "Seleccionar tipo de evento..." (no "Select event type...")
   - "Buscar en eventos..." (no "Search events...")

### 5.4 Mensajes y Notificaciones

**Mensajes del sistema:**
- "Evento creado: Encuentro" (no "Event created: Encounter")
- "No se encontraron eventos de tipo: Inicio de Medicación" (no "No events found for type: Medication Start")
- "Filtro aplicado: Hospitalización" (no "Filter applied: Hospitalization")

**Mensajes de error:**
- "Tipo de evento inválido" (no "Invalid event type")
- "Seleccione un tipo de evento" (no "Please select an event type")

---

## 6. Fuera de Alcance

### 6.1 Internacionalización (i18n) Avanzada

Esta especificación **NO cubre:**
- Sistemas de internacionalización multi-idioma
- Cambio dinámico de idioma en tiempo de ejecución
- Soporte para múltiples idiomas simultáneos
- Localización de formatos de fecha/hora (ya cubierto en otros documentos)
- Traducción de contenido clínico (notas, descripciones de eventos)

### 6.2 Modificaciones de Estructura de Datos

Esta especificación **NO requiere:**
- Cambios en el esquema de base de datos
- Modificación de enums en Prisma (`ClinicalEventType`)
- Cambios en identificadores de API
- Modificación de contratos de Timeline Engine

### 6.3 Otros Términos del Sistema

Esta especificación **NO cubre** (pero puede servir como referencia para futuras especificaciones):
- Localización de tipos de encuentro (`EncounterType`)
- Localización de tipos de fuente (`SourceType`)
- Localización de estados de paciente, notas, medicaciones
- Localización de mensajes de error generales
- Localización de etiquetas de formularios no relacionados con eventos

### 6.4 Contenido Clínico

Esta especificación **NO aplica a:**
- Contenido de notas clínicas (subjetivo, objetivo, evaluación, plan)
- Descripciones de eventos ingresadas por el usuario
- Títulos de eventos creados manualmente
- Comentarios y anotaciones clínicas

---

## 7. Implementación Técnica

### 7.1 Punto de Mapeo Central

**Ubicación:** `src/data/patient-data.ts`

**Función existente:** `mapEventType()`

**Modificación requerida:**
```typescript
function mapEventType(eventType: ClinicalEventType): UIEventType {
  const mapping: Record<ClinicalEventType, UIEventType> = {
    Encounter: 'Encuentro',
    MedicationStart: 'Inicio de Medicación',
    MedicationChange: 'Cambio de Medicación',
    MedicationStop: 'Suspensión de Medicación',
    Hospitalization: 'Hospitalización',
    LifeEvent: 'Evento Vital',
    HistoryUpdate: 'Actualización de Historia',
    Other: 'Otro',
  };
  return mapping[eventType];
}
```

### 7.2 Actualización de Tipos UI

**Archivo:** `src/types/ui.ts`

**Modificación requerida:**
```typescript
export type EventType =
  | 'Encuentro'
  | 'Inicio de Medicación'
  | 'Cambio de Medicación'
  | 'Suspensión de Medicación'
  | 'Hospitalización'
  | 'Evento Vital'
  | 'Actualización de Historia'
  | 'Otro';
```

### 7.3 Actualización de Componentes UI

**Archivo:** `src/ui/components/TimelineEvent.tsx`

**Modificación requerida:**
- La función `getEventStyle()` debe actualizar los casos del `switch` para usar los nuevos valores en español
- El componente ya recibe `event.event_type` que será el valor mapeado en español

**Ejemplo:**
```typescript
function getEventStyle(eventType: TimelineEventType['event_type']): {
  icon: React.ReactNode;
  color: string;
} {
  switch (eventType) {
    case 'Encuentro':  // Cambiado de 'Encounter'
      return { /* ... */ };
    case 'Inicio de Medicación':  // Cambiado de 'Medication Start'
      return { /* ... */ };
    // ... resto de casos
  }
}
```

### 7.4 Validación y Testing

**Puntos de validación:**
1. **Linter/TypeScript:** Debe validar que todos los valores de `EventType` coincidan con el mapeo
2. **Tests unitarios:** Verificar que `mapEventType()` retorna valores en español
3. **Tests de integración:** Verificar que la UI muestra textos en español
4. **Revisión manual:** Confirmar que no hay strings hardcodeados en inglés en componentes UI

---

## 8. Checklist de Implementación

### 8.1 Cambios de Código Requeridos

- [ ] Actualizar función `mapEventType()` en `src/data/patient-data.ts`
- [ ] Actualizar tipo `EventType` en `src/types/ui.ts`
- [ ] Actualizar función `getEventStyle()` en `src/ui/components/TimelineEvent.tsx`
- [ ] Revisar y actualizar todos los componentes que muestran tipos de eventos
- [ ] Actualizar cualquier texto hardcodeado relacionado con tipos de eventos

### 8.2 Validación

- [ ] Verificar que la línea de tiempo muestra tipos en español
- [ ] Verificar que los filtros muestran opciones en español
- [ ] Verificar que los formularios muestran selectores en español
- [ ] Verificar que las vistas laterales muestran etiquetas en español
- [ ] Verificar que no hay mezcla de idiomas en ningún componente
- [ ] Ejecutar tests y verificar que pasan

### 8.3 Documentación

- [ ] Actualizar documentación de componentes afectados
- [ ] Documentar el mapeo canónico en comentarios de código
- [ ] Actualizar guías de desarrollo si aplica

---

## 9. Referencias

### 9.1 Documentos Relacionados

- `docs/13_timeline_engine.md` — Definición de tipos de eventos en el motor de timeline
- `docs/14_timeline_contracts.md` — Contratos de API del timeline
- `docs/03_timeline.md` — Especificación funcional del timeline
- `docs/18_patient_crud_specs.md` — Especificaciones de CRUD de pacientes (formato de referencia)

### 9.2 Archivos de Código Clave

- `src/data/patient-data.ts` — Capa de mapeo de datos
- `src/types/ui.ts` — Tipos TypeScript para UI
- `src/ui/components/TimelineEvent.tsx` — Componente de evento en timeline
- `prisma/schema.prisma` — Esquema de base de datos (enum `ClinicalEventType`)

---

## 10. Historial de Versiones

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2024 | Responsable de Consistencia Lingüística | Especificación inicial |

---

**Fin del Documento**
