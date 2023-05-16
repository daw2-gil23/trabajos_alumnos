import { P as Proyecto } from "./proyecto-6d4d2673.js";
import "./main-193633d7.js";
const editarProyectoVista = {
  template: `
    <div
    class="container d-flex mt-5 justify-content-center">
    <div class="col-12">
        <a href="#/proyectos" class="btn btn-outline-secondary btn-sm">< Proyectos</a>
        <h1 class="text-center p-2">Editar Proyecto</h1>
        <form id="formProyecto" class="p-3" novalidate>
          <label class="mt-3 form-label" for="user_id">User_id: </label>    
          <input
              id="user_id" 
              type="text" 
              class="form-control text-black-50 " 
              value="" 
              disabled
              
            /> 
            <label class="mt-3 form-label" for="id">Id proyecto: </label>
            <input
              id="proyecto_id" 
              type="text" 
              class="form-control text-black-50" 
              value="" 
              disabled
            />  
  
            <label class="mt-3 form-label" for="nombre">Nombre: </label>
            <input
              id="nombreProyectoEditar" 
              type="text" 
              class="form-control" 
              value="" 
              placeholder ="Nombre del proyecto" 
              required 
            />
            <div class="invalid-feedback">El nombre no es correcto</div>
  
            <label class="mt-3 form-label" for="descripcion">Descripción: </label>
            <textarea 
              id="descripcion"
              class="form-control" 
              value="" 
              required 
              />
            </textarea>
            <div class="invalid-feedback">Este campo no es correcto</div>
  
            <label class="mt-3 form-label" for="enlace">Enlace a producción</label>
            <input
                id="enlace"
                type="enlace"
                class="form-control"
                value=""
                placeholder = "http://miproyecto.com"
                required
            />
            <div class="invalid-feedback">El link no es correcto</div>
            <button type="submit" class="mt-5 btn btn-success">
                Actualizar proyecto
            </button>
            <button type="button" onclick="history.back()" class="mt-5 btn btn-primary">
                Cancelar
            </button>
        </form>
    </div>
  </div>
      `,
  script: async (id = -1) => {
    const proyecto = await Proyecto.getById(id);
    const user_id = document.querySelector("#user_id");
    const idProyecto = document.querySelector("#proyecto_id");
    const nombreProyecto = document.querySelector("#nombreProyectoEditar");
    const descripcionProyecto = document.querySelector("#descripcion");
    const enlaceProyecto = document.querySelector("#enlace");
    user_id.value = await proyecto.user_id;
    idProyecto.value = await proyecto.id;
    nombreProyecto.value = await proyecto.nombre;
    descripcionProyecto.value = await proyecto.descripcion;
    enlaceProyecto.value = await proyecto.enlace;
    const formProyecto = document.querySelector("#formProyecto");
    formProyecto.addEventListener("submit", async function(e) {
      e.preventDefault();
      proyecto.nombre = nombreProyecto.value;
      proyecto.descripcion = descripcionProyecto.value;
      proyecto.value = enlaceProyecto.value;
      proyecto.update();
      window.location.href = "/trabajos_alumno/#/proyectos";
    });
  }
};
export {
  editarProyectoVista as default
};
