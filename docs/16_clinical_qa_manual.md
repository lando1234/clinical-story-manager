# Manual de Verificación Clínica — Guía para el Psiquiatra

## Propósito

Este manual proporciona una lista de verificación para que el psiquiatra evalúe el funcionamiento del sistema de registros clínicos durante su práctica diaria.

Cada sección contiene pasos concretos para confirmar que las funciones esenciales operan correctamente.

El objetivo es garantizar confianza en los datos, claridad durante la consulta y facilidad de uso.

---

## Cómo Usar Este Manual

1. Realice las verificaciones en orden o seleccione la sección relevante según su necesidad.
2. Para cada paso, observe el resultado y marque si coincide con lo esperado.
3. Anote cualquier comportamiento inesperado en la columna de observaciones.
4. Los problemas identificados deben reportarse para su corrección.

**Columnas de verificación:**

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|

---

## 1. Creación y Búsqueda de Pacientes

### 1.1 Registrar un Nuevo Paciente

Esta verificación confirma que puede incorporar nuevos pacientes al registro.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Inicie el proceso de crear un nuevo paciente | Aparece un formulario para ingresar datos | | |
| Ingrese el nombre completo del paciente | El campo acepta el texto | | |
| Ingrese la fecha de nacimiento | El campo acepta una fecha válida | | |
| Ingrese información de contacto (teléfono, correo) | Los campos aceptan los datos opcionales | | |
| Ingrese contacto de emergencia (nombre, teléfono, parentesco) | Los campos aceptan los datos | | |
| Confirme la creación | El paciente aparece registrado con estado activo | | |
| Busque al paciente recién creado | El paciente aparece en los resultados de búsqueda | | |

**Verificación adicional — Detección de duplicados:**

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Intente crear otro paciente con el mismo nombre y fecha de nacimiento | Aparece una advertencia sobre posible duplicado | | |

---

### 1.2 Buscar un Paciente Existente

Esta verificación confirma que puede localizar pacientes para acceder a sus registros.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Ingrese parte del nombre del paciente | Aparecen pacientes que coinciden con el texto | | |
| Ingrese la fecha de nacimiento | El resultado se filtra correctamente | | |
| Ingrese el identificador del paciente | Aparece el paciente exacto | | |
| Seleccione un paciente de los resultados | Accede al registro clínico completo del paciente | | |
| Busque un nombre que no existe | El resultado indica que no hay coincidencias | | |

**Verificación de estados:**

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Busque pacientes activos e inactivos | Los pacientes activos aparecen primero; los inactivos están claramente diferenciados | | |

---

### 1.3 Editar Información del Paciente

Esta verificación confirma que puede actualizar datos demográficos cuando cambian.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Abra el registro de un paciente existente | Se muestran los datos actuales del paciente | | |
| Modifique el número de teléfono | El cambio se acepta | | |
| Modifique el correo electrónico | El cambio se acepta | | |
| Modifique la dirección | El cambio se acepta | | |
| Guarde los cambios | Los nuevos datos quedan registrados | | |
| Verifique que el identificador no es editable | El identificador permanece fijo | | |
| Verifique que la fecha de registro no es editable | La fecha de registro permanece fija | | |

---

### 1.4 Cambiar Estado del Paciente

Esta verificación confirma el manejo de pacientes que dejan o retoman tratamiento.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Cambie un paciente de activo a inactivo | El estado se actualiza | | |
| Verifique que el registro clínico sigue accesible | Toda la documentación permanece visible | | |
| Cambie el paciente de inactivo a activo | El estado se restaura | | |
| Verifique que puede continuar documentando | Las funciones de documentación están disponibles | | |

---

## 2. Redacción de Notas Clínicas

### 2.1 Crear una Nota de Consulta

Esta verificación confirma el flujo de documentación de encuentros clínicos.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione un paciente | Accede a su registro clínico | | |
| Inicie la creación de una nueva nota | Aparece el formulario de nota | | |
| Ingrese la fecha del encuentro | El campo acepta una fecha (no futura) | | |
| Seleccione el tipo de encuentro (Evaluación Inicial, Seguimiento, Intervención en Crisis, Revisión de Medicación, Sesión de Terapia, Consulta Telefónica, Otro) | La selección se registra | | |
| Ingrese observaciones subjetivas | El texto se registra correctamente | | |
| Ingrese hallazgos objetivos | El texto se registra correctamente | | |
| Ingrese la evaluación | El texto se registra correctamente | | |
| Ingrese el plan | El texto se registra correctamente | | |
| Guarde como borrador | La nota queda guardada pero editable | | |

---

### 2.2 Editar y Finalizar una Nota

Esta verificación confirma el ciclo completo de una nota clínica.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Abra una nota en borrador | El contenido es editable | | |
| Modifique cualquier sección | Los cambios se aceptan | | |
| Guarde los cambios en el borrador | Los cambios persisten | | |
| Finalice la nota | La nota cambia a estado finalizado | | |
| Intente modificar la nota finalizada | Los campos de contenido ya no son editables | | |
| Verifique que la nota aparece en la línea de tiempo | Un evento de encuentro aparece en la fecha correspondiente | | |

**Verificación de campos obligatorios:**

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Intente finalizar una nota sin observaciones subjetivas | Se indica que el campo es requerido | | |
| Intente finalizar una nota sin evaluación | Se indica que el campo es requerido | | |
| Intente finalizar una nota sin plan | Se indica que el campo es requerido | | |

---

### 2.3 Agregar Addenda a Notas Finalizadas

Esta verificación confirma el mecanismo de corrección sin alterar el registro original.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Abra una nota finalizada | La nota se muestra en modo lectura | | |
| Inicie la creación de un addendum | Aparece un formulario para el contenido adicional | | |
| Ingrese el contenido del addendum | El texto se acepta | | |
| Ingrese la razón del addendum | La razón se registra | | |
| Confirme el addendum | El addendum queda adjunto a la nota | | |
| Verifique que el addendum es visible junto a la nota original | Ambos textos (original y addendum) se muestran juntos | | |
| Intente modificar el addendum después de crearlo | El addendum no es editable | | |

---

### 2.4 Eliminar Borradores

Esta verificación confirma que los borradores pueden descartarse antes de finalizar.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Cree una nota en borrador | La nota existe como borrador | | |
| Solicite eliminar el borrador | Se pide confirmación | | |
| Confirme la eliminación | El borrador desaparece del registro | | |
| Verifique que la nota no aparece en la línea de tiempo | No hay rastro del borrador eliminado | | |

---

## 3. Gestión de Medicamentos

### 3.1 Registrar un Medicamento Nuevo

Esta verificación confirma el inicio de un tratamiento farmacológico.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione un paciente | Accede a su registro clínico | | |
| Inicie el registro de un nuevo medicamento | Aparece el formulario de medicamento | | |
| Ingrese el nombre del fármaco | El campo acepta el texto | | |
| Ingrese la dosis y unidad (ej. 50 mg) | Los campos aceptan los valores | | |
| Ingrese la frecuencia (ej. cada 12 horas) | El campo acepta el texto | | |
| Ingrese la vía de administración (opcional) | El campo acepta el texto | | |
| Ingrese la fecha de inicio | El campo acepta una fecha (no futura) | | |
| Ingrese la razón de prescripción | El campo acepta el texto | | |
| Confirme el registro | El medicamento aparece en la lista de medicamentos activos | | |
| Verifique la línea de tiempo | Aparece un evento de inicio de medicamento | | |

---

### 3.2 Modificar Dosis o Frecuencia

Esta verificación confirma el ajuste de tratamientos existentes.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione un medicamento activo | Se muestran los detalles actuales | | |
| Inicie un cambio de dosis | Aparece el formulario de modificación | | |
| Ingrese la nueva dosis | El campo acepta el valor | | |
| Ingrese la fecha efectiva del cambio | El campo acepta la fecha | | |
| Confirme el cambio | El medicamento actualizado aparece como activo | | |
| Verifique que el medicamento anterior aparece como discontinuado | El historial muestra la dosis previa | | |
| Verifique la línea de tiempo | Aparece un evento de cambio de medicamento | | |
| Revise el historial farmacológico completo | Se ve la progresión: dosis original → dosis nueva | | |

---

### 3.3 Discontinuar un Medicamento

Esta verificación confirma el cierre de un tratamiento.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione un medicamento activo | Se muestran los detalles | | |
| Inicie la discontinuación | Aparece el formulario correspondiente | | |
| Ingrese la fecha de fin | El campo acepta la fecha | | |
| Ingrese la razón de discontinuación | El campo acepta el texto | | |
| Confirme la discontinuación | El medicamento pasa a la lista histórica | | |
| Verifique que ya no aparece como activo | Solo figura en el historial | | |
| Verifique la línea de tiempo | Aparece un evento de fin de medicamento | | |

---

### 3.4 Visualizar Historial Farmacológico

Esta verificación confirma la trazabilidad completa de tratamientos.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Acceda al historial de medicamentos del paciente | Se muestran todos los medicamentos (activos e históricos) | | |
| Identifique medicamentos activos | Están claramente diferenciados de los históricos | | |
| Revise un medicamento con múltiples cambios de dosis | Se ve toda la evolución cronológica | | |
| Verifique las fechas de inicio y fin de cada medicamento | Las fechas son coherentes y no se superponen incorrectamente | | |
| Verifique las razones de prescripción y discontinuación | Toda la información registrada es accesible | | |

---

## 4. Citas y Seguimiento

### 4.1 Registrar una Próxima Cita

Esta verificación confirma el registro de encuentros futuros.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione un paciente | Accede a su registro | | |
| Inicie el registro de una cita | Aparece el formulario de cita | | |
| Ingrese la fecha programada | El campo acepta una fecha futura | | |
| Ingrese la hora (opcional) | El campo acepta la hora | | |
| Ingrese la duración estimada (opcional) | El campo acepta el valor | | |
| Seleccione el tipo de cita | La selección se registra | | |
| Agregue notas sobre la cita (opcional) | El campo acepta el texto | | |
| Confirme el registro | La cita aparece en el registro del paciente | | |

---

### 4.2 Actualizar o Cancelar Citas

Esta verificación confirma la gestión de cambios en la agenda.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione una cita existente | Se muestran los detalles actuales | | |
| Modifique la fecha | El cambio se acepta | | |
| Modifique la hora | El cambio se acepta | | |
| Guarde los cambios | La cita actualizada se muestra | | |
| Cambie el estado a cancelada | La cita permanece visible con estado cancelado | | |

---

### 4.3 Marcar Estados de Citas

Esta verificación confirma el seguimiento del cumplimiento de citas.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Marque una cita como completada | El estado cambia a completada | | |
| Marque una cita como ausencia (no-show) | El estado cambia a ausencia | | |
| Verifique que las citas pasadas mantienen su estado | El historial de citas es accesible | | |
| Confirme que las citas no aparecen en la línea de tiempo clínica | Las citas son administrativas, no eventos clínicos | | |

---

## 5. Revisión de Historia Clínica y Línea de Tiempo

### 5.1 Navegar la Línea de Tiempo

Esta verificación confirma la visualización cronológica del historial clínico.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Acceda a la línea de tiempo del paciente | Se muestra la lista de eventos clínicos | | |
| Verifique el orden por defecto | Los eventos más recientes aparecen primero | | |
| Cambie a orden cronológico ascendente | Los eventos más antiguos aparecen primero | | |
| Identifique los diferentes tipos de eventos | Encuentros, medicamentos, hospitalizaciones, eventos vitales están diferenciados | | |
| Seleccione un evento de encuentro | Accede a la nota clínica completa | | |
| Seleccione un evento de medicamento | Accede a los detalles del medicamento | | |

---

### 5.2 Filtrar la Línea de Tiempo

Esta verificación confirma la búsqueda selectiva en el historial.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Filtre solo eventos de encuentros | Solo aparecen las consultas documentadas | | |
| Filtre solo eventos de medicamentos | Solo aparecen inicios, cambios y fines de medicamentos | | |
| Filtre solo hospitalizaciones | Solo aparecen eventos de hospitalización | | |
| Filtre solo eventos vitales | Solo aparecen los eventos de vida registrados | | |
| Filtre por rango de fechas | Solo aparecen eventos dentro del período seleccionado | | |
| Quite todos los filtros | Aparece el historial completo | | |

---

### 5.3 Buscar Dentro del Historial

Esta verificación confirma la localización de información específica.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Ingrese un término de búsqueda (ej. nombre de medicamento) | Aparecen eventos que contienen el término | | |
| Ingrese un término presente en una nota | El evento de encuentro correspondiente aparece | | |
| Navegue directamente al evento encontrado | Accede al contenido completo | | |

---

### 5.4 Verificar Integridad Temporal

Esta verificación confirma que el historial mantiene su coherencia.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Revise eventos de diferentes fechas | Cada evento muestra su fecha de ocurrencia | | |
| Verifique un evento registrado con posterioridad (backdated) | El evento aparece en su fecha clínica correcta, no en la fecha de registro | | |
| Confirme que las notas en borrador no aparecen | Solo las notas finalizadas generan eventos en la línea de tiempo | | |
| Verifique que no hay eventos con fechas futuras | Todos los eventos tienen fechas pasadas o actuales | | |

---

### 5.5 Revisar Historia Psiquiátrica

Esta verificación confirma el acceso a la información de fondo del paciente.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Acceda a la historia psiquiátrica actual | Se muestra la versión vigente | | |
| Revise las secciones disponibles (motivo de consulta, historia de enfermedad actual, antecedentes psiquiátricos, hospitalizaciones, intentos suicidas, consumo de sustancias, antecedentes familiares, historia médica, quirúrgica, alergias, historia social, desarrollo) | Cada sección es legible | | |
| Modifique una sección de la historia | Se crea una nueva versión | | |
| Verifique que la versión anterior es accesible | Puede consultar el contenido previo | | |
| Verifique la línea de tiempo | Aparece un evento de actualización de historia (excepto para la versión inicial) | | |

---

### 5.6 Registrar Eventos Manuales

Esta verificación confirma el registro de acontecimientos significativos externos.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Inicie la creación de un evento manual | Aparece el formulario | | |
| Seleccione el tipo (Hospitalización, Evento Vital, Otro) | La selección se registra | | |
| Ingrese la fecha del evento | El campo acepta una fecha (no futura) | | |
| Ingrese el título del evento | El campo acepta el texto | | |
| Ingrese la descripción (opcional) | El campo acepta el texto | | |
| Confirme el evento | El evento aparece en la línea de tiempo | | |
| Verifique que el evento no es editable después de crearlo | El contenido permanece fijo | | |

---

## 6. Verificaciones de Confiabilidad

Estas verificaciones adicionales confirman que puede confiar en la integridad del registro clínico.

### 6.1 Inmutabilidad de Documentación Finalizada

| Verificación | Resultado Esperado | ¿Correcto? | Observaciones |
|--------------|-------------------|------------|---------------|
| Las notas finalizadas no pueden modificarse | Solo es posible agregar addenda | | |
| Los addenda no pueden modificarse después de crearse | El contenido permanece fijo | | |
| Los medicamentos discontinuados no pueden editarse | Los datos históricos están protegidos | | |
| Los eventos clínicos no pueden eliminarse | El historial es permanente | | |
| Las versiones anteriores de la historia psiquiátrica son accesibles | Nada se pierde al actualizar | | |

---

### 6.2 Coherencia Temporal

| Verificación | Resultado Esperado | ¿Correcto? | Observaciones |
|--------------|-------------------|------------|---------------|
| Los eventos aparecen ordenados por fecha de ocurrencia | El orden es consistente en cada consulta | | |
| Los eventos registrados tardíamente se ubican en su fecha clínica | Un evento de hace un mes aparece hace un mes, no hoy | | |
| No existen eventos con fechas futuras | El sistema rechaza fechas futuras para eventos clínicos | | |
| Los medicamentos muestran fechas de inicio y fin coherentes | La fecha de fin nunca es anterior a la de inicio | | |

---

### 6.3 Completitud del Registro

| Verificación | Resultado Esperado | ¿Correcto? | Observaciones |
|--------------|-------------------|------------|---------------|
| Todos los medicamentos (activos e históricos) son visibles | Ningún medicamento desaparece del historial | | |
| Todas las notas finalizadas aparecen en la línea de tiempo | Cada encuentro documentado genera un evento | | |
| Los addenda siempre se muestran junto a su nota original | No hay addenda huérfanos | | |
| La historia psiquiátrica mantiene todas sus versiones | Es posible reconstruir el conocimiento en cualquier momento | | |

---

## 7. Resumen de Verificaciones Críticas

Las siguientes verificaciones son las más importantes para garantizar la confiabilidad clínica:

| Área | Verificación Crítica | Estado |
|------|---------------------|--------|
| Pacientes | Puede crear, buscar y acceder a cualquier paciente | |
| Notas | Las notas finalizadas son inmutables | |
| Notas | Los addenda preservan el registro original | |
| Medicamentos | El historial farmacológico completo es trazable | |
| Medicamentos | Los cambios de dosis crean registros separados (no sobrescriben) | |
| Línea de tiempo | Todos los eventos clínicos aparecen en orden correcto | |
| Línea de tiempo | Los eventos registrados tardíamente se ubican en su fecha clínica | |
| Historia | Las versiones anteriores de la historia psiquiátrica son accesibles | |
| Integridad | Ningún dato clínico puede eliminarse o modificarse retroactivamente | |

---

## Glosario

| Término | Significado |
|---------|-------------|
| Nota | Documentación de un encuentro clínico |
| Borrador | Nota que aún puede editarse antes de finalizarse |
| Finalizada | Nota que ya no puede modificarse, solo recibir addenda |
| Addendum | Texto adicional adjunto a una nota finalizada |
| Línea de tiempo | Vista cronológica de todos los eventos clínicos del paciente |
| Evento clínico | Cualquier acontecimiento significativo registrado (encuentro, medicamento, hospitalización, etc.) |
| Historia psiquiátrica | Información de antecedentes del paciente, versionada |
| Activo | Paciente en tratamiento actual / Medicamento vigente |
| Inactivo | Paciente que no está en tratamiento actualmente |
| Discontinuado | Medicamento que ya no se administra |

---

*Versión del documento: 1.0*  
*Estado: Borrador*  
*Idioma: Español*
