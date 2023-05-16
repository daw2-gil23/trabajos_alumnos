const homeVista = {
  template: `
  <div class="vh-100 d-flex flex-column align-items-center justify-content-center">
    <img src="./imagenes/logo_vanilla.svg" class="w-25 d-block" alt="Vanilla Games">
    <h1>Vanilla Games</h1>
  </div>
  
  `,
  script: () => {
    console.log('home')
  }
}
export {
  homeVista as default
}
