require("colors");
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist,
} = require("./helpers/inquirer");
const Tareas = require("./models/tareas");
const { guardarDB, leerDB } = require("./helpers/guardarArchivo");

const main = async () => {
  let opt = "";
  const tareas = new Tareas();
  const tareasDB = leerDB();

  if (tareasDB) {
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    opt = await inquirerMenu();
    switch (opt) {
      case "1": // Crear tarea
        const desc = await leerInput("Descripcion:");
        tareas.crearTarea(desc);
        break;
      case "2": // Listar tareas
        tareas.listadoCompleto();
        break;
      case "3": // Listar completadas
        tareas.listarPendientesCompletadas(true);
        break;
      case "4": //  Listar pendientes
        tareas.listarPendientesCompletadas(false);
        break;
      case "5": //  Marcar tarea como: completada | pendiente
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;
      case "6": // Borrar tareas
        const id = await listadoTareasBorrar(tareas.listadoArr);
        const ok = await confirmar("Estas seguro?");
        if (ok) {
          tareas.borrarTarea(id);
          console.log("Tarea borrada");
        }
        break;
    }
    guardarDB(tareas.listadoArr);
    if (opt !== 0) await pausa();
  } while (opt !== "0");
};

main();
