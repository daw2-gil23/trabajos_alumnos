import { Comentario } from '../../bd/comentario'
import { Perfil } from '../../bd/perfil'
import { Proyecto } from '../../bd/proyecto'
import { User } from '../../bd/user'

export default {
  template: `
<div class="container mt-5">
  <div class="row">
    <div class="col-12">
      <a href="#/proyectos" class="btn btn-outline-secondary btn-sm">< Proyectos</a>
      <h1 id="nombre_proyecto" class="w-100 text-center p-2"></h1>
      <div class="d-flex justify-content-center m-5">
       <h1 id="titulo"></h1> 
      </div>
    </div>
    <!-- DAtos proyecto -->
    <div class="col-12 col-md-4 mt-2">
      <h5> Información general: </h5>
      <p>Autor: <span id="autor_proyecto" class="text-center p-2"></span></p>
      <p>Enlace: <a id="enlace_proyecto" class="text-center p-2" target="_black">Link a mi proyecto</a></p>
      <h5>Descripción:</h5>
      <p id="descripcion_proyecto"></p>
    </div>
    <!-- Valoracion   -->
    <div class="col-12 col-md-8">
      <div class="row">
        <div class="col-12 col-xl-6 mt-2">
        <div class="d-flex justify-content-between">
          <h5>Valoración alumnos:</h5>
          <input title="Enviar nota" id="notaMedia" class=" w-25 ms-auto me-2 text-center fw-bold btn-sm mb-2" value="6.0"></input>
          <button title="Enviar nota" id="notaMedia" class="btn btn-warning text-dark fw-bold btn-sm mb-2" >Enviar nota</button>
        </div>  
        

          <div id="valoracion">
            <!-- Aqui van los criterios y las estrellas -->
          </div>
          
        </div>
        <div class="col-12 col-xl-6 mt-3 ">
          <h5>Tu valoración:</h5>
          <div id="valoracionPersonal">
            <!-- Aqui van los criterios y las estrellas -->
            
          </div> 
        </div>
      </div>
    </div>
    <!-- Comentarios -->
    <div class="col-12">
      <h3>Comentarios:</h3>
      
      <form id="formComentario">
        <div class="comentario d-flex flex-wrap align-item-top bg-dark p-3">
          
            <div class="w-100 d-flex">
              <img id="imgPerfilLogueado" src="/assets/avatar.svg" alt="us" class="border me-3 mt-1" style="width:50px;height:50px;">
              <textarea id="nuevoComentario" class="m-1 form-control h-75" placeholder="Escribe un comentario..." required></textarea>
            </div>
            
            <button id="btnEnviarComentario" type="submit" class="btn btn-success btn-small  ms-auto">Enviar comentario</button>
          
        </div>
      </form>
      

      <div id="comentarios">
        
    </div>
  </div>
</div>
    `,
  script: async (id) => {
    const proyecto = await Proyecto.getById(id)

    const titulo = document.querySelector('#titulo')
    const autor = document.querySelector('#autor_proyecto')
    const enlace = document.querySelector('#enlace_proyecto')
    const descripcion = document.querySelector('#descripcion_proyecto')

    const nombreAutor = await Proyecto.buscarAutor(proyecto.user_id)

    console.log(nombreAutor)

    titulo.innerHTML = proyecto.nombre
    enlace.innerHTML = proyecto.enlace
    descripcion.innerHTML = proyecto.descripcion
    autor.innerHTML = nombreAutor[0].nombre_usuario

    const boton = document.querySelector('#btnEnviarComentario')

    const comentarios = await Comentario.getAllByProjectId(proyecto.id)

    let divComentarios = '<div id="divComentario" class="comentario d-flex flex-wrap align-item-top bg-dark">'

    for (const comentario of comentarios) {
      console.log(comentario.user_id)
      const autor = await Perfil.getByUserId(comentario.user_id)
      console.log(autor)
      divComentarios += `
      <div class="w-100 d-flex mb-2 p-3 bg-dark">
        <div class="w-100">          
          <div class="comentario text-white"><h3>${autor.nombre} - ${comentario.comentario} </h3></div>
        </div>
      </div>
        `
    }

    divComentarios += '</div>'

    const opiniones = document.querySelector('#comentarios')
    opiniones.innerHTML = divComentarios

    boton.addEventListener('click', async function (e) {
      e.preventDefault()
      // const usuarioLogueado = await User.getUser()
      // if (usuarioLogueado) {
      //   console.log('hola')
      // } else {
      //   console.log('Adios')
      // }

      const usuarioLogueado = await User.getUser()

      if (usuarioLogueado) {
        const comentario = {
          comentario: document.querySelector('#nuevoComentario').value,
          proyecto_id: proyecto.id,
          user_id: usuarioLogueado.id
        }
        Comentario.create(comentario)
      } else {
        alert('Inicia sesion para comentar')
      }

      // Comentario.create
    })
  }
}
