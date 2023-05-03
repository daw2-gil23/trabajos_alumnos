
export const enrutador = {

  // Objeto (diccionario) con todas las rutas y su vista asociada
  rutas: {
    home: import('../vistas/homeVista.js'),
    // Usuarios
    adminUsuarios: import('../vistas/admin/adminVista.js'),
    registro: import('../vistas/registroVista.js'),
    login: import('../vistas/loginVista.js'),
    // Proyectos
    proyectos: import('../vistas/proyectos/proyectosVistas'),
    nuevoProyecto: import('../vistas/proyectos/nuevoProyectoVista.js'),
    editarProyecto: import('../vistas/proyectos/editarProyectoVista.js'),
    detalleProyecto: import('../vistas/proyectos/detalleProyectoVista.js')
    // misProyectos: import('../vistas/proyectos/misProyectosVista.js'),
    // // Enunciados
    // enunciados: import('../vistas/enunciados/enunciadosVista.js'),
    // nuevoEnunciado: import('../vistas/enunciados/nuevoEnunciadoVista.js'),
    // editarEnunciado: import('../vistas/enunciados/editarEnunciadoVista.js'),
    // detalleEnunciado: import('../vistas/enunciados/detalleEnunciadoVista.js'),
    // misEnunciados: import('../vistas/enunciados/misEnunciadosVista.js')
    // Rubricas
    // rubricas: import('../vistas/rubricas/rubricasVista.js'),
    // nuevoRubrica: import('../vistas/rubricas/nuevoRubricaVista.js'),
    // editarRubrica: import('../vistas/rubricas/editarRubricaVista.js'),
    // detalleRubrica: import('../vistas/rubricas/detalleRubricaVista.js'),
    // misRubricas: import('../vistas/rubricas/misRubricasVista.js')
  },

  // Método que obtiene la ruta del navegador
  router: async () => {
    // Capturamos el hash # que ha cambiado en la url
    const pathCompleto = window.location.hash
    // Separamos la ruta del posible parametro que reciba
    const path = pathCompleto.split('/')[1]
    const parametro = pathCompleto.split('/')[2]

    // capturamos el componente con ese nombre de la vista
    // (Usamos las sintaxix objeto[propiedad]) porque el nombre de la propiedad lo tenemos en una variable.)
    const componenteVista = await enrutador.rutas[path]
    // Si existe la vista la podremos cargar
    if (componenteVista) {
      try {
        // Obtenemos el objeto del componente (que fué exportado como default)
        const vista = await componenteVista.default
        // inyectamos vista y ejecutamos su script
        document.querySelector('main').innerHTML = vista.template
        // A los script les pasamos el parametro que hemos extraido de la ruta. Así podemos pasar, por ejemplo, el id de un proyecto
        vista.script(parametro)
      } catch (error) {
        // Si se produce un error cargamos la vista 404
        console.log(error)
      }
    }
  },

  // Capturamos los eventos
  observadorRutas: () => {
    document.body.addEventListener('click', event => {
      // Evitamos que se cargue la página

      const link = event.target
      if (link.tagName === 'A') {
        // event.preventDefault()
        // Obtenemos la ruta del enlace sin el .html
        const href = link.getAttribute('href')
        // Añadimos la nueva ruta al historial

        // (El método pushState() permite agregar un nuevo estado a la pila del historial del navegador. Esto significa que una nueva entrada de historial se agrega a la pila y la URL del navegador se actualiza sin recargar la página.)
        window.history.pushState({ path: href }, '', href)
        // y ejecutamos el router de nuevo para que detecte los cambios con el evento popstate
        enrutador.router()
      }
    })

    // Detectamos cuando alguien navega por el historial con los botones avanzar y retroceder del navegador.
    window.addEventListener('popstate', (e) => {
      console.log('evento popstate - Te estás moviendo por el historial')
      enrutador.router()
    })
  }
}
