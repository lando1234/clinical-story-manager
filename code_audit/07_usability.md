### Auditoría de Usabilidad – Sistema de Historias Clínicas Psiquiátricas

**Alcance:** Root (`/`), lista de pacientes, timeline clínica, notas clínicas y navegación (incluyendo comportamiento responsive), desde la perspectiva de un psiquiatra usuario final.

---

## 1. Root (`/`)

### 1.1 Enfoque visual más cercano a "dashboard" que a lista de pacientes

1. **Problema de usabilidad**  
   La vista raíz se presenta con encabezado "Vista General" y contenido principal ocupado por estadísticas (`PatientStats`) y turnos próximos (`UpcomingAppointments`), mientras que la lista de pacientes queda relegada al sidebar.

2. **Contexto donde ocurre**  
   Ruta `/` (`page.tsx`) en desktop y mobile, usando `AppShell` con `PatientSidebar` y contenido central con estadísticas.

3. **Impacto en el usuario**  
   - Aumenta la **carga cognitiva inicial**: el profesional debe inferir que el foco real del sistema es la lista de pacientes, aunque visualmente domina la vista estadística.  
   - Puede inducir un **modelo mental de "dashboard"** (visión analítica) en lugar de un modelo de "seleccionar paciente y trabajar", lo que va en contra del principio de centralidad del paciente y de que el root no es un dashboard clínico.  
   - Especialmente en primeras sesiones, puede generar **duda sobre el siguiente paso** (¿consultar métricas o ir a la lista?).

4. **Recomendación (conceptual)**  
   Reforzar conceptualmente que el root es **punto de entrada operativo centrado en la lista de pacientes**, ajustando jerarquía textual y microcopy (por ejemplo, encabezados y descripciones) para que el usuario entienda que las estadísticas son contexto secundario y que la acción principal es elegir un paciente desde el listado.

---

### 1.2 Lista de pacientes no visible por defecto en mobile

1. **Problema de usabilidad**  
   En pantallas pequeñas, la lista de pacientes está oculta dentro del sidebar off-canvas y la primera impresión del root es solo la sección "Vista General" con estadísticas.

2. **Contexto donde ocurre**  
   - Ruta `/` (`page.tsx`) en mobile, con `AppShell` usando sidebar oculto por defecto y botón hamburguesa genérico.  
   - El encabezado del sidebar "Pacientes" solo es visible luego de abrir el menú.

3. **Impacto en el usuario**  
   - Rompe el **principio de que la lista de pacientes es el elemento principal del root**, especialmente en mobile, donde el usuario ve primero un panel estadístico.  
   - Añade un **paso adicional y poco evidente** (tocar el icono de menú) para acceder a la acción principal, lo que puede retrasar el inicio del trabajo clínico.  
   - Aumenta el riesgo de que el root sea interpretado como un panel pasivo de información, reduciendo la sensación de control operativo.

4. **Recomendación (conceptual)**  
   Asegurar que en mobile el **camino evidente** tras entrar al sistema sea acceder a la lista de pacientes: por ejemplo, priorizando conceptualmente el acceso a la lista (texto, indicaciones o layout responsive) de modo que el clínico perciba de inmediato que debe abrir la lista para comenzar a trabajar.

---

### 1.3 Descubribilidad limitada del rol operativo de las estadísticas

1. **Problema de usabilidad**  
   Las secciones de estadísticas y turnos próximos no explicitan claramente que son **información operativa de apoyo** y que las acciones clínicas siempre deben pasar por la identidad del paciente.

2. **Contexto donde ocurre**  
   Contenido principal del root (`PatientStats`, `UpcomingAppointments`) sin mensajes breves que aclaren su rol limitado.

3. **Impacto en el usuario**  
   - Puede inducir a interpretar las estadísticas como **herramientas clínicas de decisión** más fuertes de lo previsto por las specs.  
   - El usuario podría buscar atajos clínicos desde estos bloques (p.ej. esperar ver resúmenes clínicos), generando **expectativas que la UI no cumple**.  
   - Aumenta la probabilidad de **confundir contexto operativo** (agenda, conteos) con contenido clínico.

4. **Recomendación (conceptual)**  
   Introducir, a nivel de messaging y labels, una **explicación concisa** de que estas secciones son de **situación operativa** (agenda próxima, volumen de pacientes) y que el trabajo clínico concreto siempre se realiza entrando al paciente desde la lista o desde el turno.

---

## 2. Lista de pacientes

### 2.1 Duplicación conceptual entre `/` y `/patients`

1. **Problema de usabilidad**  
   Existen dos vistas muy similares (root con sidebar "Pacientes" y `/patients` con el mismo sidebar y un mensaje central "Lista de Pacientes"), lo que puede percibirse como redundante.

2. **Contexto donde ocurre**  
   - Ruta `/` con `PatientSidebar` y contenido de estadísticas.  
   - Ruta `/patients` (`PatientsPage`) con el mismo sidebar y un panel vacío que solo instruye "Seleccione un paciente de la lista".

3. **Impacto en el usuario**  
   - **Aumenta la carga cognitiva** al tener que diferenciar mentalmente cuándo usar `/` versus `/patients`, pese a que ambos exponen la misma lista lateral.  
   - El contenido principal de `/patients` aporta poco valor adicional frente al sidebar, lo que puede generar sensación de "pantalla de relleno".  
   - Puede confundir el flujo: el profesional podría no saber si debe arrancar desde `/` o desde `/patients` para su trabajo diario.

4. **Recomendación (conceptual)**  
   Clarificar el **rol diferenciado** de cada vista a nivel de textos y navegación (por ejemplo, que `/` sea claramente "Inicio operativo" con contexto y `/patients` sea una vista más focalizada para operaciones administrativas sobre pacientes), minimizando la percepción de duplicación para el usuario clínico.

---

### 2.2 Falta de señalización explícita de orden y criterio de listado

1. **Problema de usabilidad**  
   El listado de pacientes no indica de forma visible el **criterio de orden** ni ofrece pistas sobre cómo se priorizan pacientes activos, recientes o con turnos próximos.

2. **Contexto donde ocurre**  
   `PatientList` dentro de `PatientSidebar`, que muestra nombre, edad y estado, pero sin indicación textual de orden (por fecha de creación, alfabético, etc.).

3. **Impacto en el usuario**  
   - Exige al clínico **deducir por ensayo** el orden del listado, lo que añade carga cognitiva innecesaria, en especial con paneles largos.  
   - Dificulta tareas como **volver rápidamente a pacientes vistos recientemente** o priorizar activos frente a inactivos, si el orden no se comunica.  
   - Puede llevar a la sensación de "lista caótica" cuando crece el volumen de pacientes.

4. **Recomendación (conceptual)**  
   Hacer explícito el **criterio de orden por defecto** (por ejemplo, indicar visualmente si el listado es alfabético o por fecha de alta) y mantenerlo consistente, de modo que el usuario pueda desarrollar un **modelo mental estable** de cómo encontrar rápidamente a cada paciente.

---

### 2.3 Edición y administración no diferenciadas visualmente del trabajo clínico

1. **Problema de usabilidad**  
   Desde el listado se accede tanto a vistas administrativas (`PatientDetailView`) como a vistas clínicas (timeline) sin una diferenciación muy clara a nivel de etiquetas o agrupación conceptual.

2. **Contexto donde ocurre**  
   - `PatientList` enlaza directamente a `/patients/{id}` (vista timeline/clinica).  
   - Desde esa vista se accede a `PatientDetailView` y edición de datos, con navegación secundaria.

3. **Impacto en el usuario**  
   - El clínico puede **confundir flujos administrativos y clínicos**, por ejemplo esperando ver la timeline al entrar en una vista puramente administrativa.  
   - Esto puede producir pequeños ciclos de navegación extra (entrar, ver que no es la vista esperada, retroceder) que, sumados, **deterioran la fluidez** del trabajo diario.  
   - El riesgo es mayor en usuarios que alternan poco entre edición administrativa y revisión clínica.

4. **Recomendación (conceptual)**  
   Reforzar en la microcopy y en los textos de botones la diferencia entre **"ver historia clínica"** y **"ver/editar datos administrativos"**, para que el usuario identifique claramente qué tipo de trabajo iniciará con cada acción.

---

## 3. Timeline clínica

### 3.1 Estado vacío poco orientado a la acción

1. **Problema de usabilidad**  
   Cuando no hay eventos, la timeline muestra un mensaje descriptivo pero no indica **qué acción concreta** debe tomar el profesional para comenzar a documentar.

2. **Contexto donde ocurre**  
   `Timeline` cuando `events.length === 0` (mensaje "La línea de tiempo de este paciente está vacía.").

3. **Impacto en el usuario**  
   - En pacientes nuevos, el clínico ve una **pantalla vacía sin CTA claro**, lo que puede generar segundos adicionales de duda sobre si debe crear una nota, un turno o medicación desde otra parte de la UI.  
   - La falta de orientación inmediata **aumenta la carga cognitiva** en el primer uso y en contextos de alta presión de tiempo.  
   - Se pierde la oportunidad de **guiar el flujo clínico recomendado** (por ejemplo, iniciar con una nota clínica o registrar medicación de base).

4. **Recomendación (conceptual)**  
   Complementar el estado vacío con una **indicación breve y neutra** del siguiente paso posible (por ejemplo, que recuerde que puede crear una nota clínica o programar una cita desde los paneles laterales), manteniendo la separación entre UI y reglas clínicas.

---

### 3.2 Distinción entre contexto del paciente y eventos dependiente del conocimiento previo

1. **Problema de usabilidad**  
   Aunque `PatientHeader` y `Timeline` siguen la separación conceptual especificada, la **diferencia visual entre "información del paciente" y "eventos" puede no ser evidente** para un usuario sin conocer las specs.

2. **Contexto donde ocurre**  
   Vistas de paciente que combinan `PatientHeader` (información fija) y `Timeline` (eventos), más paneles laterales (medicación, notas, turnos).

3. **Impacto en el usuario**  
   - El clínico puede asumir que cualquier dato visible en la parte superior forma parte de la historia inmutable, cuando en realidad son **datos administrativos que pueden cambiar**.  
   - Esto puede afectar su **confianza en la trazabilidad**, especialmente al ver campos como edad o fecha de nacimiento cerca de eventos.  
   - Aumenta la dependencia de conocimiento previo técnico (saber qué es Patient vs ClinicalRecord), lo que no debería ser necesario para un usuario clínico.

4. **Recomendación (conceptual)**  
   Introducir ligeros **indicios semánticos** (títulos, descripciones muy breves) que aclaren que el bloque superior es "Información del paciente" (contexto) y que la timeline debajo son "Eventos clínicos" inmutables, para que el usuario pueda entender esta distinción sin conocer el modelo interno.

---

## 4. Notas clínicas

### 4.1 Riesgo de pérdida de datos por cierre accidental del formulario modal

1. **Problema de usabilidad**  
   El formulario para agregar nota clínica se presenta como modal a pantalla completa, que se cierra al hacer clic sobre el fondo, sin mecanismos visibles de preservación explícita de lo escrito.

2. **Contexto donde ocurre**  
   `AddClinicalNoteForm` superpuesto cuando `isOpen` es verdadero, con cierre por `onClick` en el overlay.

3. **Impacto en el usuario**  
   - Alto riesgo de **cierre accidental** (clic fuera del cuadro, especialmente en mobile), con la percepción de pérdida de lo redactado.  
   - Dado que las notas son textos largos y clínicamente sensibles, este tipo de error es **emocionalmente costoso** y puede desincentivar el uso intensivo de la herramienta.  
   - En sesiones con interrupciones frecuentes, el profesional puede desarrollar la conducta de **documentar menos** para evitar perder texto.

4. **Recomendación (conceptual)**  
   Proteger conceptualmente el contenido del formulario frente a cierres accidentales, por ejemplo introduciendo **confirmaciones cuando hay cambios no guardados** o diseñando el cierre por fondo como una acción menos probable; mantener el comportamiento funcional pero explícitamente orientado a la prevención de pérdida de datos.

---

### 4.2 Opción "Finalizar inmediatamente" activada por defecto aumenta fricción

1. **Problema de usabilidad**  
   El formulario marca por defecto "Finalizar inmediatamente (crea evento en la línea de tiempo)", lo que exige completar campos subjetivo, evaluación y plan aun cuando el usuario podría querer simplemente dejar un borrador rápido.

2. **Contexto donde ocurre**  
   `AddClinicalNoteForm`, estado inicial de `formData.finalizeImmediately = true` con validación estricta de campos obligatorios solo en ese modo.

3. **Impacto en el usuario**  
   - Incrementa la **carga cognitiva y el esfuerzo inicial**: para notas rápidas el usuario debe desmarcar manualmente la casilla o enfrentarse a errores de validación.  
   - Va en sentido opuesto al principio de que la UI debe **facilitar tanto la entrada en tiempo real como retrospectiva**, donde los borradores parciales son frecuentes.  
   - Puede llevar a estrategias de trabajo subóptimas (p.ej. escribir texto mínimo solo para superar la validación, en lugar de usar borradores auténticos).

4. **Recomendación (conceptual)**  
   Revisar, a nivel de política de UX, cuál debería ser el **modo por defecto** para notas nuevas (borrador vs finalización inmediata) de acuerdo al uso esperado del clínico, privilegiando una opción que **minimice errores de validación innecesarios** y permita documentar de forma progresiva.

---

### 4.3 Panel de "Nota Más Reciente" muy denso en pantallas pequeñas

1. **Problema de usabilidad**  
   El panel de nota más reciente incluye tipo de encuentro, estado, fecha, evaluación y plan en un espacio compacto, lo que puede resultar visualmente cargado en mobile.

2. **Contexto donde ocurre**  
   `NotesPanel` en la columna lateral de la vista de paciente, que se apila en mobile junto con otros paneles.

3. **Impacto en el usuario**  
   - En pantallas pequeñas, la combinación de múltiples bloques (Evaluación, Plan, metadatos) puede generar **scroll frecuente** y dificulta localizar rápidamente la información clave.  
   - Existe riesgo de que el profesional confunda el **preview** con la nota completa o que no detecte fácilmente que puede ir a la timeline para ver el contexto completo.  
   - Aumenta la **carga visual** al coexistir con otros paneles (turnos, medicación) en el mismo stack.

4. **Recomendación (conceptual)**  
   Priorizar conceptualmente **qué fragmentos de la nota son críticos** para un panel de acceso rápido (por ejemplo, encabezado y una sección síntesis), manteniendo el resto como contenido accesible en la vista completa de nota/timeline, para reducir densidad en mobile sin perder información.

---

## 5. Navegación y comportamiento responsive

### 5.1 Botón de menú móvil poco asociado a "Pacientes" como eje

1. **Problema de usabilidad**  
   El acceso al sidebar de pacientes en mobile se realiza mediante un icono hamburguesa genérico, etiquetado solo como "Toggle sidebar" (aria-label), sin mención explícita al contenido clínico principal (lista de pacientes).

2. **Contexto donde ocurre**  
   `AppShell` en pantallas pequeñas, que muestra solo el icono en la esquina superior izquierda.

3. **Impacto en el usuario**  
   - Reduce la **descubribilidad** de la lista de pacientes como eje del flujo: un usuario ocupado podría no intuir que ese menú contiene la funcionalidad central.  
   - En la primera sesión, el profesional puede dedicar segundos adicionales a explorar la vista central antes de descubrir el menú, lo que introduce fricción en el arranque del flujo clínico.  
   - En contextos de estrés, cualquier ambigüedad en los controles básicos incrementa el riesgo de errores de navegación.

4. **Recomendación (conceptual)**  
   Hacer más explícita, a nivel de etiquetado y microcopy, la relación entre el **control de menú** y la **lista de pacientes** (por ejemplo, reforzando verbalmente que ahí se accede a "Pacientes"), manteniendo la misma mecánica funcional de sidebar.

---

### 5.2 Inconsistencia leve en acceso directo a "Inicio" entre vistas

1. **Problema de usabilidad**  
   En las vistas clínicas con `PatientHeader` existe un botón claro "Inicio" hacia `/`, pero en vistas administrativas como `PatientDetailView` el acceso de vuelta a Inicio no es igualmente explícito (se ofrece "Ver Línea de Tiempo" y "Editar Paciente").

2. **Contexto donde ocurre**  
   - Vistas de timeline/estado clínico: `PatientHeader` con enlace "Inicio" persistente.  
   - Vista administrativa de detalle de paciente: `PatientDetailView` sin enlace directo a Inicio.

3. **Impacto en el usuario**  
   - Introduce una **sutil inconsistencia de navegación**: el usuario debe reaprender dónde está el punto de retorno según el tipo de vista.  
   - Puede producir pequeños bucles de navegación (detalle → timeline → inicio) en lugar de un acceso directo, lo que **alarga micro-flujos frecuentes**.  
   - En sesiones largas, estas diferencias erosionan la percepción de un sistema totalmente predecible.

4. **Recomendación (conceptual)**  
   Homogeneizar la presencia de un acceso claro y consistente a **"Inicio"** en todas las vistas asociadas al paciente (clínicas y administrativas), de manera que el profesional desarrolle un **reflejo estable** para volver siempre al punto de entrada operativo.

---

### 5.3 Complejidad visual acumulada en columna lateral en mobile

1. **Problema de usabilidad**  
   La columna lateral (lista de pacientes, notas, medicación, turnos, información del paciente) se apila en mobile, generando un **stack de paneles largos** que puede resultar pesado de recorrer.

2. **Contexto donde ocurre**  
   Comportamiento responsive descrito en `26_responsive_behavior_spec.md`, implementado vía `AppShell` y paneles como `NotesPanel`, `AppointmentsPanel`, `MedicationsPanel`, etc.

3. **Impacto en el usuario**  
   - La navegación hacia elementos específicos en la columna lateral (p.ej. buscar rápidamente el panel de medicación) exige **scroll prolongado**, especialmente en pacientes con muchas notas o información.  
   - Esto compite con el objetivo explícito de que mobile sea una experiencia **orientada a consulta rápida** más que a exploración exhaustiva.  
   - En escenarios de consulta breve desde el teléfono, esta densidad puede desincentivar el uso del sistema para ciertas tareas.

4. **Recomendación (conceptual)**  
   Evaluar conceptualmente cómo **jerarquizar y compactar** los paneles laterales en mobile (por prioridad clínica y frecuencia de uso), manteniendo toda la información accesible pero reduciendo la necesidad de scroll largo para tareas habituales de consulta.

---

## 6. Síntesis general

- **Claridad del flujo**: el sistema respeta en líneas generales el flujo paciente → timeline, pero el root y el acceso en mobile pueden comunicar de forma más directa que la **primera acción esperada es seleccionar un paciente**.  
- **Carga cognitiva**: la terminología y mensajes están bien cuidados; la carga proviene más de **decisiones de énfasis visual y estados vacíos poco orientados a la acción** que de textos ambiguos.  
- **Consistencia visual y semántica**: la separación entre contexto del paciente y eventos se ajusta a las specs, pero puede hacerse más autoexplicativa sin exponer conceptos técnicos.  
- **Prevención de errores**: se ve un buen trabajo en validaciones y estados, con oportunidades claras de mejora en **prevención de pérdida de notas** y en reducir validaciones agresivas en el flujo por defecto.  
- **Responsive UX**: el comportamiento está bien alineado con las specs, pero la **descubribilidad de la lista de pacientes y la densidad de la columna lateral en mobile** son los puntos más sensibles desde la perspectiva de uso real por un clínico único.