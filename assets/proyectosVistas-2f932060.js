import { P as Proyecto } from './proyecto-6d4d2673.js'
import './main-193633d7.js'
const proyectosVistas = {
  template: `
    <main style="padding-top: 100px">
    <div class="container">
        <h1>Proyectos</h1>
        <a href="/#/nuevoProyecto" id="nuevoProyecto" class="btn btn-success mt-3">Nuevo Proyecto</a>
        <a href="/#/misProyectos" id="misProyectos" class="btn btn-warning mt-3 ms-2">Mis Proyectos</a>
        <table id="tablaProyectos" class="table table-striped table-hover mt-5 align-middle">
            <thead>
                <tr>
                    <th></th>
                    <th>AUTOR</th>
                    <th>NOMBRE</th>
                    <th>DESCRIPCIÓN</th>
                    <th>ENLACE</th>
                    <th class="w-100"></th>
                </tr>
            </thead>
            <tbody>
                       
                
                
            </tbody>
        </table>
    </div>
  </main>
  
  `,
  script: async () => {
    try {
      const proyectos = await Proyecto.getAll()
      console.log('numero de proyectos en la base de datos: ', proyectos.length)
      let tabla = ''
      for (const proyecto of proyectos) {
        const nombreAutor = await Proyecto.buscarAutor(proyecto.user_id)
        tabla += `
      <tr>
        <td>
          <img src="./imagenes/proyectos/proyecto.png" width="100" alt="" data-id="${proyecto.id}" class="detalle"/>
        </td>
        <td>${nombreAutor[0].nombre_usuario}</td>
        <td>${proyecto.nombre}</td>
        <td class="w-100">${proyecto.descripcion}</td>
        <td><a href="${proyecto.enlace}" target="_black">${proyecto.enlace}</a></td>
        <td class="text-end">
          <button
            data-id="${proyecto.id}"
            type="button"
            class="btn bg-danger detalle"
          >
          <img  data-id="${proyecto.id}" class="detalle w-100" src="./imagenes/iconos/icons8-acerca-de.svg" width="20" alt="" />
          </button>
          <button
            data-id="${proyecto.id}"
            type="button"
            class="btn bg-info editar mt-1"
          >
            <img src="./imagenes/iconos/icons8-editar.svg" width="20" alt="" class="editar" data-id="${proyecto.id}"/>
          </button>

          <button
              data-id="${proyecto.id}"
              type="button"
              class="btn bg-danger borrar mt-1"
          >
            <img  data-id="${proyecto.id}" class="borrar w-100" src="./imagenes/iconos/icons8-basura-llena.svg" width="20" alt="" />
          </button>
        </td>
      </tr>
      `
      }
      const tablaProyectosBody = document.querySelector('#tablaProyectos tbody')
      if (tablaProyectosBody) { tablaProyectosBody.innerHTML = tabla }
      const tablaProyectos = document.querySelector('#tablaProyectos')
      if (tablaProyectos) {
        tablaProyectos.addEventListener('click', async (e) => {
          const id = e.target.dataset.id
          if (e.target.classList.contains('borrar')) {
            try {
              const proyectoABorrar = await Proyecto.getById(id)
              const seguro = confirm('¿Está seguro que desea borrar el proyecto? Se eliminarán todos sus comentarios y notas ' + proyectoABorrar.nombre + ', ' + proyectoABorrar.nombre)
              if (seguro) {
                await Proyecto.delete(id)
              }
              window.location.href = '/trabajos_alumno/#/proyectos'
            } catch (error) {
              alert('No se han podido borrar el proyecto' + error)
            }
          }
          if (e.target.classList.contains('editar')) {
            window.location.href = '/trabajos_alumno/#/editarProyecto/' + id
          }
          if (e.target.classList.contains('detalle')) {
            window.location.href = '/trabajos_alumno/#/detalleProyecto/' + id
          }
        })
      }
    } catch (error) {
      alert('No se han podido cargar la tabla de usuarios ' + error)
    }
  }
}
export {
  proyectosVistas as default
}
