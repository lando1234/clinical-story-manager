# Glosario de Terminología Estándar — Sistema de Historias Clínicas Psiquiátricas

## Overview

Este documento define la terminología estándar utilizada en todas las especificaciones del sistema. Su propósito es eliminar ambigüedades y asegurar consistencia en el uso de términos clave.

**Importante:** Este glosario debe ser consultado cuando se encuentren términos que puedan tener múltiples interpretaciones o cuando se necesite clarificar el significado exacto de un concepto.

---

## Términos Clínicos y Administrativos

### Encuentro Clínico

**Definición:** Interacción entre el clínico y el paciente que es documentada en una Nota Clínica.

**Características:**
- Es un hecho clínico que ocurre en un momento específico
- Debe ser documentado mediante una Nota Clínica
- Puede o no estar asociado a un Turno agendado
- Representa la interacción real entre clínico y paciente

**Uso en especificaciones:**
- Siempre usar "Encuentro clínico" (completo), no solo "Encuentro"
- Se refiere al hecho de la interacción, no al documento que lo registra
- Ejemplo: "El encuentro clínico ocurrió el 15 de enero de 2024"

**Relación con otros términos:**
- Un Encuentro clínico se documenta en una Nota Clínica
- Un Encuentro clínico puede generar un Evento NOTE en la timeline
- Un Encuentro clínico puede estar asociado a un Turno agendado, pero no es obligatorio

---

### Turno Agendado

**Definición:** Cita programada entre el clínico y el paciente (entidad Appointment).

**Características:**
- Es una entidad administrativa, no clínica
- Tiene una fecha programada (`scheduledDate`)
- Puede estar en el futuro (planificación) o en el pasado (ocurrió)
- NO contiene documentación clínica
- Puede tener estados: Scheduled, Completed, Cancelled, NoShow

**Uso en especificaciones:**
- Usar "Turno agendado" (completo) en títulos, definiciones principales y cuando se requiere claridad
- Puede abreviarse a "Turno" en contextos donde ya está claro que se refiere a un turno agendado
- Ejemplo: "Un Turno agendado cuya fecha ya pasó puede generar un Evento Encounter"

**Relación con otros términos:**
- Un Turno agendado puede generar un Evento Encounter cuando su fecha ya pasó
- Un Turno agendado puede estar asociado a un Encuentro clínico, pero no es obligatorio
- Un Turno agendado NO es lo mismo que un Encuentro clínico

---

## Entidades del Sistema

### Nota Clínica

**Definición:** Documento que contiene la documentación estructurada de un Encuentro clínico.

**Características:**
- Es una instancia de la entidad `Note`
- Contiene contenido clínico: subjetivo, objetivo, evaluación, plan
- Puede existir en estado Draft (borrador) o Finalized (finalizada)
- Solo las Notas finalizadas generan un Evento NOTE
- Una vez finalizada, la Nota es inmutable en su contenido

**Uso en especificaciones:**
- Siempre usar "Nota Clínica" (con mayúsculas)
- Distinguir claramente entre "Nota Clínica" (documento) y "Evento NOTE" (evento en timeline)

**Relación con otros términos:**
- Una Nota Clínica documenta un Encuentro clínico
- Una Nota Clínica finalizada genera un Evento NOTE
- Una Nota Clínica puede estar asociada a un Turno agendado, pero no es obligatorio

---

### Appointment

**Definición:** Entidad que representa un Turno agendado.

**Características:**
- Es la entidad técnica que implementa el concepto de Turno agendado
- Tiene una fecha programada (`scheduledDate`)
- Puede tener estado: Scheduled, Completed, Cancelled, NoShow
- NO contiene documentación clínica

**Uso en especificaciones:**
- Usar "Appointment" cuando se refiere a la entidad técnica
- Usar "Turno agendado" cuando se refiere al concepto clínico/administrativo
- En código y modelos de datos, usar "Appointment"
- En documentación para usuarios, usar "Turno agendado"

---

## Eventos en Timeline

### Evento NOTE

**Definición:** Evento en timeline generado por una Nota Clínica finalizada, representa que se documentó un Encuentro clínico.

**Características:**
- Es una instancia de `ClinicalEvent` con `eventType = NOTE`
- Se genera automáticamente cuando una Nota Clínica es finalizada
- Representa el hecho de que se documentó un Encuentro clínico
- Es inmutable desde el momento de su creación
- Tiene `sourceType = Note` y referencia a la Nota que lo generó

**Uso en especificaciones:**
- Siempre usar "Evento NOTE" (con mayúsculas en NOTE)
- NO usar "Evento de Encuentro" (término obsoleto)
- Distinguir claramente de "Evento Encounter"

**Relación con otros términos:**
- Un Evento NOTE se genera desde una Nota Clínica finalizada
- Un Evento NOTE representa que se documentó un Encuentro clínico
- Un Evento NOTE es diferente de un Evento Encounter

---

### Evento Encounter

**Definición:** Evento en timeline generado por un Turno agendado cuya fecha ya pasó, representa que ocurrió un turno.

**Características:**
- Es una instancia de `ClinicalEvent` con `eventType = Encounter`
- Se genera automáticamente cuando un Turno agendado tiene fecha en el pasado
- Representa el hecho de que ocurrió un Turno agendado
- Es inmutable desde el momento de su creación
- Tiene `sourceType = Appointment` y referencia al Turno que lo generó
- NO contiene contenido clínico

**Uso en especificaciones:**
- Siempre usar "Evento Encounter" (con mayúsculas en Encounter)
- Distinguir claramente de "Evento NOTE"
- Aclarar que representa un Turno agendado que ya ocurrió, no un Encuentro clínico

**Relación con otros términos:**
- Un Evento Encounter se genera desde un Turno agendado cuya fecha ya pasó
- Un Evento Encounter representa que ocurrió un Turno agendado
- Un Evento Encounter NO representa un Encuentro clínico documentado
- Un Evento Encounter es diferente de un Evento NOTE

---

## Diferencias Clave

### Encuentro Clínico vs Turno Agendado

| Aspecto | Encuentro Clínico | Turno Agendado |
|---------|-------------------|----------------|
| **Naturaleza** | Hecho clínico | Entidad administrativa |
| **Documentación** | Requiere Nota Clínica | No requiere Nota Clínica |
| **Contenido** | Tiene contenido clínico | No tiene contenido clínico |
| **Obligatoriedad** | Puede existir sin Turno | Puede existir sin Encuentro documentado |

### Evento NOTE vs Evento Encounter

| Aspecto | Evento NOTE | Evento Encounter |
|---------|-------------|------------------|
| **Origen** | Nota Clínica finalizada | Turno agendado cuya fecha pasó |
| **Representa** | Documentación de Encuentro clínico | Ocurrencia de Turno agendado |
| **Contenido clínico** | Referencia a Nota con contenido | No tiene contenido clínico |
| **Tipo de evento** | `NOTE` | `Encounter` |
| **Source Type** | `Note` | `Appointment` |

---

## Reglas de Uso

1. **Siempre usar términos completos en títulos y definiciones principales:**
   - ✅ "Encuentro clínico" (no "Encuentro")
   - ✅ "Turno agendado" (no "Turno" en definiciones principales)

2. **Puede abreviarse en contextos claros:**
   - ✅ "El turno que ya pasó" (si el contexto es claro)
   - ❌ "El turno" (si el contexto no es claro)

3. **Distinguir siempre entre Evento NOTE y Evento Encounter:**
   - ✅ "Evento NOTE" para documentación de encuentros
   - ✅ "Evento Encounter" para turnos que ocurrieron

4. **No usar términos obsoletos:**
   - ❌ "Evento de Encuentro" (usar "Evento NOTE")
   - ❌ "Encounter" para referirse a encuentros clínicos documentados

---

## Referencias

Este glosario debe ser consultado en conjunto con:
- [`01_specs.md`](01_specs.md) — Estructura general de especificaciones
- [`02_events/21_evento_encuentro_nota_clinica.md`](../02_events/21_evento_encuentro_nota_clinica.md) — Separación Evento NOTE / Nota Clínica
- [`02_events/22_nota_clinica_evento_note.md`](../02_events/22_nota_clinica_evento_note.md) — Nota Clínica y Evento NOTE
- [`02_events/23_encounter_appointment_spec.md`](../02_events/23_encounter_appointment_spec.md) — Eventos Encounter de Turnos Agendados

---

*Documento creado: 2024*  
*Última actualización: 2024*  
*Versión: 1.0*  
*Estado: Final*

