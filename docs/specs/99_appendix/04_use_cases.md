# Sistema de Historias Clínicas Psiquiátricas — Casos de Uso y Tests Funcionales

## 1. CASOS DE USO ACTUALIZADOS

### UC-01: Crear paciente

**Descripción:** Registrar un nuevo paciente para iniciar su historia clínica longitudinal.

**Actor:** Clínico

**Preconditions:**
- El sistema está disponible.
- El clínico cuenta con los datos demográficos básicos del paciente.

**Main flow:**
1. El clínico solicita crear un paciente.
2. El clínico ingresa nombre completo y fecha de nacimiento.
3. El clínico ingresa datos de contacto y contacto de emergencia (si aplica).
4. El sistema valida los datos requeridos.
5. El sistema crea el Patient y asigna un identificador único.
6. El sistema crea un ClinicalRecord asociado.
7. El sistema crea PsychiatricHistory versión 1 vacía.
8. El sistema marca el paciente como activo.

**Validations:**
- Nombre completo: requerido y no vacío.
- Fecha de nacimiento: requerida, fecha válida, no futura.
- Teléfono/email: opcionales; si se informan, deben tener formato válido.
- Contacto de emergencia: el teléfono es requerido si se informó nombre.
- Detección de duplicado: si existe paciente con mismo nombre completo + fecha de nacimiento, el sistema debe advertir y permitir continuar o cancelar.

**Error conditions:**
- Faltan campos requeridos → se rechaza la creación.
- Fecha de nacimiento inválida o futura → se rechaza la creación.

**Postconditions:**
- El paciente queda registrado con estado activo.
- Existe ClinicalRecord asociado y PsychiatricHistory v1.
- No se generan ClinicalEvents.

---

### UC-01B: Actualizar información de paciente

**Descripción:** Modificar datos demográficos o administrativos del paciente.

**Actor:** Clínico

**Preconditions:**
- El paciente existe y está accesible.

**Main flow:**
1. El clínico solicita editar la información del paciente.
2. El clínico actualiza campos permitidos.
3. El sistema valida los cambios.
4. El sistema persiste la actualización.

**Validations:**
- Nombre completo y fecha de nacimiento siguen siendo requeridos y válidos.
- Identificador del paciente y fecha de registro no son editables.
- Estado del paciente solo admite Active o Inactive.

**Error conditions:**
- Intento de modificar campos inmutables → se rechaza el cambio.
- Datos inválidos (formato o fecha futura) → se rechaza el cambio.

**Postconditions:**
- La información del paciente queda actualizada.
- El ClinicalRecord y sus entidades clínicas no cambian.
- No se generan ClinicalEvents.

---

### UC-02: Buscar paciente

**Descripción:** Localizar pacientes existentes para acceder a su historia clínica.

**Actor:** Clínico

**Preconditions:**
- Existe al menos un paciente registrado.

**Main flow:**
1. El clínico ingresa criterios de búsqueda (nombre, fecha de nacimiento y/o identificador).
2. El sistema ejecuta la búsqueda.
3. El sistema retorna resultados coincidentes ordenados por relevancia.
4. El clínico selecciona un paciente.

**Validations:**
- Debe existir al menos un criterio no vacío.
- Si se ingresa fecha de nacimiento, debe ser fecha válida.

**Error conditions:**
- Criterios vacíos → se rechaza la búsqueda.
- Fecha inválida → se rechaza la búsqueda.

**Postconditions:**
- Se muestra lista de pacientes coincidentes, incluyendo estado activo/inactivo.
- El clínico puede acceder al ClinicalRecord del paciente seleccionado.

---

### UC-03: Crear o editar nota clínica en borrador

**Descripción:** Documentar un encuentro clínico en estado Draft.

**Actor:** Clínico

**Preconditions:**
- El paciente existe y su ClinicalRecord está accesible.

**Main flow:**
1. El clínico inicia la creación o edición de una Nota en estado Draft.
2. El clínico registra la fecha del encuentro y el tipo de encuentro.
3. El clínico registra contenido clínico (subjetivo, objetivo, evaluación, plan).
4. El sistema valida el borrador.
5. El sistema guarda la Nota en estado Draft.

**Validations:**
- encounterDate: requerido, fecha válida, no futura.
- encounterType: requerido, debe ser un tipo permitido.
- Debe existir contenido en al menos una sección clínica.

**Error conditions:**
- Fecha inválida o futura → se rechaza el guardado.
- Tipo de encuentro inválido → se rechaza el guardado.
- Todas las secciones vacías → se rechaza el guardado.

**Postconditions:**
- La Nota queda en estado Draft, editable y sin evento asociado.
- La Nota no aparece en la timeline.

---

### UC-03B: Finalizar nota clínica

**Descripción:** Convertir una Nota en Draft a estado Finalized y generar el evento NOTE.

**Actor:** Clínico

**Preconditions:**
- Existe una Nota en estado Draft para el paciente.

**Main flow:**
1. El clínico solicita finalizar la Nota.
2. El sistema valida que la Nota está en Draft.
3. El sistema valida los campos requeridos para finalización.
4. El sistema cambia el estado a Finalized y fija finalizedAt.
5. El sistema genera un ClinicalEvent de tipo NOTE con eventDate = encounterDate.

**Validations:**
- La Nota debe estar en Draft.
- encounterDate: válida y no futura.
- encounterType: válido.
- subjective, assessment y plan deben estar presentes y no vacíos.

**Error conditions:**
- Nota ya Finalized → se rechaza la operación.
- Faltan campos requeridos → se rechaza la finalización.
- encounterDate futura → se rechaza la finalización.

**Postconditions:**
- La Nota queda Finalized e inmutable.
- Se crea exactamente un evento NOTE en la timeline.
- Los Addenda pueden adjuntarse a la Nota.

---

### UC-03C: Agregar addendum a nota finalizada

**Descripción:** Corregir o complementar una Nota Finalized mediante Addendum.

**Actor:** Clínico

**Preconditions:**
- La Nota está en estado Finalized.

**Main flow:**
1. El clínico solicita crear un Addendum.
2. El clínico ingresa contenido y razón del Addendum.
3. El sistema valida los campos requeridos.
4. El sistema crea el Addendum y lo vincula a la Nota.

**Validations:**
- La Nota debe estar en estado Finalized.
- Contenido del Addendum: requerido y no vacío.
- Razón del Addendum: requerida y no vacía.

**Error conditions:**
- Nota en Draft → se rechaza la creación del Addendum.
- Contenido o razón vacíos → se rechaza la creación.

**Postconditions:**
- El Addendum queda creado e inmutable.
- La Nota original permanece sin cambios.
- El Addendum se muestra junto a la Nota, sin generar evento separado.

---

### UC-03D: Eliminar nota en borrador

**Descripción:** Eliminar una Nota en estado Draft que no debe conservarse.

**Actor:** Clínico

**Preconditions:**
- La Nota está en estado Draft.

**Main flow:**
1. El clínico solicita eliminar la Nota en Draft.
2. El sistema valida que la Nota está en Draft.
3. El sistema elimina la Nota.

**Validations:**
- Solo se pueden eliminar notas en Draft.

**Error conditions:**
- Nota Finalized → se rechaza la eliminación.

**Postconditions:**
- La Nota en Draft queda eliminada sin eventos asociados.

---

### UC-04: Registrar medicación (Medication Start)

**Descripción:** Registrar una nueva medicación activa para el paciente.

**Actor:** Clínico

**Preconditions:**
- El paciente existe y su ClinicalRecord está accesible.

**Main flow:**
1. El clínico solicita registrar una medicación nueva.
2. El clínico ingresa nombre del fármaco, dosis, unidad, frecuencia y fecha de emisión de receta.
3. El clínico ingresa comentarios opcionales.
4. El sistema valida los datos.
5. El sistema crea el Medication con estado Active.
6. El sistema genera un ClinicalEvent Medication Start con eventDate = prescriptionIssueDate.

**Validations:**
- drugName, dosage, dosageUnit, frequency y prescriptionIssueDate son requeridos.
- dosage debe ser un valor positivo.
- prescriptionIssueDate debe ser válida y no futura (para Medication Start).
- comments es opcional.

**Error conditions:**
- Campos requeridos faltantes o inválidos → se rechaza el registro.
- prescriptionIssueDate futura → se rechaza el registro.

**Postconditions:**
- Medication activo creado.
- Evento Medication Start creado y visible en la timeline en su fecha.

---

### UC-04B: Ajustar dosis o frecuencia (Medication Change)

**Descripción:** Registrar un ajuste posológico creando una nueva versión de la medicación.

**Actor:** Clínico

**Preconditions:**
- Existe una medicación activa para el paciente.

**Main flow:**
1. El clínico selecciona una medicación activa.
2. El clínico ingresa nueva dosis/unidad/frecuencia y fecha efectiva del ajuste.
3. El sistema valida los datos.
4. El sistema descontinúa la medicación original con endDate = effectiveDate - 1 día.
5. El sistema crea una nueva versión activa con prescriptionIssueDate = effectiveDate.
6. El sistema genera un ClinicalEvent Medication Change en la fecha efectiva.

**Validations:**
- La medicación seleccionada debe estar activa.
- effectiveDate debe ser válida y >= prescriptionIssueDate original.
- effectiveDate puede ser futura (evento se crea pero se oculta hasta la fecha).
- dosage debe ser positivo si se modifica.

**Error conditions:**
- Medicación no activa → se rechaza el ajuste.
- effectiveDate anterior a la prescriptionIssueDate original → se rechaza.

**Postconditions:**
- La versión previa queda Discontinued con endDate correspondiente.
- Se crea una nueva versión activa vinculada por predecessorId.
- Se crea un evento Medication Change.

---

### UC-04C: Discontinuar medicación (Medication Stop)

**Descripción:** Registrar el fin de una medicación activa.

**Actor:** Clínico

**Preconditions:**
- Existe una medicación activa para el paciente.

**Main flow:**
1. El clínico selecciona una medicación activa.
2. El clínico ingresa fecha de finalización y motivo de discontinuación.
3. El sistema valida los datos.
4. El sistema marca la medicación como Discontinued y registra endDate y motivo.
5. El sistema genera un ClinicalEvent Medication Stop con eventDate = endDate.

**Validations:**
- endDate requerida y >= prescriptionIssueDate.
- endDate no puede ser futura.
- Motivo de discontinuación requerido.

**Error conditions:**
- Medicación no activa → se rechaza la discontinuación.
- endDate inválida o futura → se rechaza.

**Postconditions:**
- La medicación queda Discontinued.
- Se crea un evento Medication Stop visible en la timeline.

---

### UC-04D: Registrar nueva emisión de receta (Medication Prescription Issued)

**Descripción:** Documentar una nueva emisión de receta para una medicación activa sin cambiar la posología.

**Actor:** Clínico

**Preconditions:**
- Existe una medicación activa para el paciente.

**Main flow:**
1. El clínico selecciona una medicación activa.
2. El clínico ingresa la fecha de emisión de la nueva receta.
3. El sistema valida los datos.
4. El sistema crea un ClinicalEvent Medication Prescription Issued para la medicación.

**Validations:**
- La medicación debe estar activa.
- La nueva fecha debe ser válida y estrictamente posterior a la prescriptionIssueDate inicial.
- La fecha puede ser futura (evento se crea pero se oculta hasta la fecha).

**Error conditions:**
- Medicación inactiva → se rechaza la emisión.
- Fecha no posterior a la inicial → se rechaza.

**Postconditions:**
- Se crea un evento Medication Prescription Issued sin modificar la medicación.

---

### UC-05: Registrar turno agendado (Appointment)

**Descripción:** Registrar un turno agendado para el paciente.

**Actor:** Clínico

**Preconditions:**
- El paciente existe.

**Main flow:**
1. El clínico registra fecha (y hora opcional) del turno.
2. El clínico selecciona el tipo de turno y agrega notas administrativas opcionales.
3. El sistema valida los datos.
4. El sistema crea el Appointment con estado Scheduled.
5. El sistema crea un ClinicalEvent Encounter asociado al Appointment.

**Validations:**
- scheduledDate requerida y válida.
- scheduledDate puede ser futura o pasada.
- appointmentType requerido.

**Error conditions:**
- Fecha inválida → se rechaza el registro.
- Tipo de turno inválido → se rechaza el registro.

**Postconditions:**
- Appointment creado en estado Scheduled.
- Encounter event creado con eventDate = scheduledDate.
- Si scheduledDate es futura, el evento se almacena pero no se muestra en la timeline hasta que la fecha pase.

---

### UC-05B: Actualizar turno agendado

**Descripción:** Reprogramar o actualizar el estado de un turno agendado.

**Actor:** Clínico

**Preconditions:**
- Existe un Appointment registrado.

**Main flow:**
1. El clínico selecciona el Appointment.
2. El clínico actualiza fecha, tipo o estado (Scheduled, Completed, Cancelled, NoShow).
3. El sistema valida los cambios.
4. El sistema persiste la actualización.
5. Si se reprograma a una fecha futura antes de la fecha original, el sistema elimina el Encounter previo y crea uno nuevo con la nueva fecha.
6. Si se cancela antes de la fecha programada, el sistema elimina el Encounter asociado.

**Validations:**
- Fecha reprogramada debe ser válida.
- Estado debe ser uno de los valores permitidos.

**Error conditions:**
- Fecha inválida → se rechaza la actualización.
- Estado inválido → se rechaza la actualización.

**Postconditions:**
- El Appointment queda actualizado con la nueva fecha/tipo/estado.
- Los Encounter events futuros se ajustan según reprogramación o cancelación.
- Los Encounter events pasados permanecen inmutables.

---

### UC-06: Ver timeline clínica del paciente

**Descripción:** Revisar la historia clínica completa en orden cronológico.

**Actor:** Clínico

**Preconditions:**
- El paciente existe y su ClinicalRecord está accesible.

**Main flow:**
1. El clínico solicita la timeline del paciente.
2. El sistema recupera todos los ClinicalEvents del paciente.
3. El sistema ordena los eventos por fecha de ocurrencia, fecha de registro y prioridad de tipo.
4. El sistema entrega la lista de eventos al clínico.
5. El clínico puede filtrar por tipo de evento o rango de fechas.
6. El clínico puede buscar texto dentro del contenido clínico asociado (notas, medicación, eventos manuales).

**Validations:**
- Operación de solo lectura (sin validaciones de entrada, salvo filtros de fecha válidos).

**Error conditions:**
- Rango de fechas inválido → se rechaza el filtro.

**Postconditions:**
- La timeline muestra eventos NOTE, Encounter (turnos), Medication Start/Change/Prescription Issued/Stop, Hospitalization, Life Event, History Update y Other.
- Los eventos con fecha futura (Encounter de turnos futuros, Medication Change o Prescription Issued futuros) permanecen ocultos hasta su fecha.
- Notas en Draft nunca aparecen en la timeline.

---

### UC-07: Registrar evento clínico manual

**Descripción:** Registrar un evento clínico no derivado de notas o medicación.

**Actor:** Clínico

**Preconditions:**
- El paciente existe y su ClinicalRecord está accesible.

**Main flow:**
1. El clínico selecciona tipo de evento manual (Hospitalization, Life Event, Other).
2. El clínico ingresa fecha, título y descripción opcional.
3. El sistema valida los datos.
4. El sistema crea el ClinicalEvent manual.

**Validations:**
- eventType debe ser uno de los tipos manuales permitidos.
- eventDate requerida, válida y no futura.
- title requerido y no vacío.

**Error conditions:**
- Fecha inválida o futura → se rechaza el registro.
- Tipo inválido → se rechaza el registro.

**Postconditions:**
- Evento manual creado e inmutable, visible en la timeline.

---

### UC-08: Actualizar historia psiquiátrica

**Descripción:** Crear una nueva versión de la PsychiatricHistory.

**Actor:** Clínico

**Preconditions:**
- Existe al menos una versión de PsychiatricHistory (v1).

**Main flow:**
1. El clínico solicita actualizar la historia psiquiátrica.
2. El clínico modifica una o más secciones.
3. El sistema valida que exista un cambio respecto de la versión actual.
4. El sistema crea una nueva versión con número incrementado.
5. El sistema marca la versión previa como superseded.
6. El sistema genera un ClinicalEvent History Update.

**Validations:**
- Debe existir al menos un campo modificado respecto de la versión actual.

**Error conditions:**
- No hay cambios → se rechaza la actualización.
- No existe versión actual → se rechaza la actualización.

**Postconditions:**
- Nueva versión creada y marcada como actual.
- Versiones anteriores permanecen accesibles e inmutables.
- Se crea un evento History Update (para versiones >= 2).

---

## 2. MATRIZ DE TESTS FUNCIONALES

### UC-01: Crear paciente
- **UC-01-T01** — Crea paciente con datos mínimos válidos y confirma ClinicalRecord + PsychiatricHistory v1 (happy path).
- **UC-01-T02** — Rechaza fecha de nacimiento futura (validation).
- **UC-01-T03** — Rechaza nombre vacío (validation).
- **UC-01-T04** — Detecta posible duplicado y permite continuar bajo advertencia (validation).

### UC-01B: Actualizar información de paciente
- **UC-01B-T01** — Actualiza datos de contacto válidos sin afectar registros clínicos (happy path).
- **UC-01B-T02** — Marca paciente como Inactive y mantiene accesibilidad del ClinicalRecord (happy path).
- **UC-01B-T03** — Rechaza intento de modificar identificador o fecha de registro (error).
- **UC-01B-T04** — Rechaza fecha de nacimiento futura al editar (validation).

### UC-02: Buscar paciente
- **UC-02-T01** — Busca por nombre parcial y retorna coincidencias ordenadas (happy path).
- **UC-02-T02** — Busca por fecha de nacimiento válida (happy path).
- **UC-02-T03** — Rechaza búsqueda con criterio vacío (validation).
- **UC-02-T04** — Rechaza formato de fecha inválida (validation).

### UC-03: Crear o editar nota clínica en borrador
- **UC-03-T01** — Guarda nota en Draft con encounterDate válida y contenido mínimo (happy path).
- **UC-03-T02** — Rechaza encounterDate futura (validation).
- **UC-03-T03** — Rechaza guardado si todas las secciones están vacías (validation).

### UC-03B: Finalizar nota clínica
- **UC-03B-T01** — Finaliza nota Draft válida y genera evento NOTE (happy path).
- **UC-03B-T02** — Rechaza finalización si subjective está vacío (validation).
- **UC-03B-T03** — Rechaza finalización si assessment está vacío (validation).
- **UC-03B-T04** — Rechaza finalización si plan está vacío (validation).
- **UC-03B-T05** — Rechaza finalización si encounterDate es futura (validation).

### UC-03C: Agregar addendum a nota finalizada
- **UC-03C-T01** — Crea Addendum válido y lo vincula a la Nota (happy path).
- **UC-03C-T02** — Rechaza Addendum en Nota Draft (error).
- **UC-03C-T03** — Rechaza Addendum con contenido vacío o razón vacía (validation).

### UC-03D: Eliminar nota en borrador
- **UC-03D-T01** — Elimina nota Draft y confirma ausencia en ClinicalRecord (happy path).
- **UC-03D-T02** — Rechaza eliminación de Nota Finalized (error).

### UC-04: Registrar medicación (Medication Start)
- **UC-04-T01** — Crea medicación activa y evento Medication Start (happy path).
- **UC-04-T02** — Rechaza prescriptionIssueDate futura (validation).
- **UC-04-T03** — Rechaza dosis no positiva (validation).

### UC-04B: Ajustar dosis o frecuencia (Medication Change)
- **UC-04B-T01** — Ajusta dosis y crea nueva versión + evento Medication Change (happy path).
- **UC-04B-T02** — Permite effectiveDate futura y oculta evento hasta la fecha (happy path).
- **UC-04B-T03** — Rechaza effectiveDate anterior a prescriptionIssueDate original (validation).
- **UC-04B-T04** — Rechaza ajuste sobre medicación inactiva (error).

### UC-04C: Discontinuar medicación (Medication Stop)
- **UC-04C-T01** — Discontinúa medicación activa y crea evento Medication Stop (happy path).
- **UC-04C-T02** — Rechaza endDate anterior a prescriptionIssueDate (validation).
- **UC-04C-T03** — Rechaza endDate futura (validation).

### UC-04D: Registrar nueva emisión de receta (Medication Prescription Issued)
- **UC-04D-T01** — Registra nueva emisión para medicación activa sin cambiarla (happy path).
- **UC-04D-T02** — Permite fecha futura y oculta evento hasta la fecha (happy path).
- **UC-04D-T03** — Rechaza fecha igual o anterior a la prescriptionIssueDate inicial (validation).
- **UC-04D-T04** — Rechaza emisión para medicación inactiva (error).

### UC-05: Registrar turno agendado (Appointment)
- **UC-05-T01** — Registra turno futuro y crea Encounter oculto hasta la fecha (happy path).
- **UC-05-T02** — Registra turno pasado y Encounter aparece en timeline (happy path).
- **UC-05-T03** — Rechaza fecha inválida (validation).

### UC-05B: Actualizar turno agendado
- **UC-05B-T01** — Reprograma turno futuro y reemplaza Encounter por nueva fecha (happy path).
- **UC-05B-T02** — Cancela turno futuro y elimina Encounter asociado (happy path).
- **UC-05B-T03** — Cambia estado a NoShow/Completed y mantiene Encounter si la fecha ya pasó (happy path).
- **UC-05B-T04** — Rechaza fecha o estado inválidos (validation).

### UC-06: Ver timeline clínica del paciente
- **UC-06-T01** — Lista eventos ordenados por fecha y prioridad de tipo (happy path).
- **UC-06-T02** — Excluye notas Draft y eventos con fecha futura (validation).
- **UC-06-T03** — Filtra por tipo de evento y rango de fechas válido (happy path).
- **UC-06-T04** — Rechaza rango de fechas inválido (validation).

### UC-07: Registrar evento clínico manual
- **UC-07-T01** — Crea evento manual Hospitalization/Life Event/Other válido (happy path).
- **UC-07-T02** — Rechaza fecha futura (validation).
- **UC-07-T03** — Rechaza tipo inválido (validation).

### UC-08: Actualizar historia psiquiátrica
- **UC-08-T01** — Crea nueva versión con cambios y genera History Update (happy path).
- **UC-08-T02** — Rechaza actualización sin cambios respecto a versión actual (validation).
- **UC-08-T03** — Rechaza actualización si no existe versión actual (error).
