import { Perfil } from '../bd/perfil'
import { User } from '../bd/user'
import { formEditarPerfil } from './formEditarPerfil'
import { menuSuperior } from './menuSuperior'
import { menuUsuario } from './menuUsuario'

export const header = {
  template: `
  
<!-- Navbar  -->
<nav class="navbar navbar-expand-sm bg-light fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand d-flex align-items-center" href="#/home">
      <img
        src="/imagenes/logo_vanilla.svg"
        alt="Logo"
        width="30"
        height="30"
        class="d-inline-block align-text-top me-2"
      />
      <span class=""></span>
      Vanilla Games
    </a>
    
    <button
      class="navbar-toggler ms-auto
      "
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNavDropdown"
      aria-controls="navbarNavDropdown"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
    <span class="navbar-toggler-icon"></span>
    </button>
    <!-- Menú superior -->
    ${menuSuperior.template}
    <!-- Menu usuario -->
    ${menuUsuario.template}
  </div>
</nav>

//Modals
${formEditarPerfil.template}
  `,
  script: async () => {
    formEditarPerfil.script()
    try {
      // Capturamos los datos del usuario logueado
      const usuarioLogueado = await User.getUser()
      if (usuarioLogueado) {
        const perfilLogueado = await Perfil.getByUserId(usuarioLogueado.id)
        // cargamos el menú superior y usuario para su rol
        menuSuperior.script(perfilLogueado)
        menuUsuario.script(perfilLogueado)
      } else {
        menuSuperior.script('anonimo')
        menuUsuario.script('anonimo')
      }
    } catch (error) {
      // alert('No he podido cargar el usuario logueado')
    }
  }
}
