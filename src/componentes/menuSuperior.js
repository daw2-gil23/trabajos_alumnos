export const menuSuperior = {
  template: `
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul id="menuSuperior" class="navbar-nav">
          <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
          </li>
          
        </ul>
      </div>
    `,
  script: (perfilLogueado) => {
    const items = {
      anonimo: `
        <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/recursos">Recursos</a>
        </li>
        `,
      registrado: `
        <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/recursos">Recursos</a>
        </li>
        <li><hr /></li>
        <li class="nav-item">
          <a class="nav-link" href="#/adminUsuarios">Admin</a>
        </li>
        `,
      alumno: `
        <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/recursos">Recursos</a>
        </li>
        <li><hr /></li>
        <li class="nav-item">
          <a class="nav-link" href="#/adminUsuarios">Admin</a>
        </li>
        `,
      profesor: `
        <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/recursos">Recursos</a>
        </li>
        <li><hr /></li>
        <li class="nav-item">
          <a class="nav-link" href="#/adminUsuarios">Admin</a>
        </li>
        `,
      admin: `
        <li class="nav-item">
          <a class="nav-link" href="#/proyectos">Proyectos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/recursos">Recursos</a>
        </li>
        <li><hr /></li>
        <li class="nav-item">
          <a class="nav-link" href="#/adminUsuarios">Admin</a>
        </li>
        `
    }
    if (perfilLogueado !== 'anonimo') {
      const rol = perfilLogueado.rol
      // Insertamos los items del menú según el rol
      document.querySelector('#menuSuperior').innerHTML = items[rol]
    } else {
      document.querySelector('#menuSuperior').innerHTML = items.anonimo
    }
  }
}
