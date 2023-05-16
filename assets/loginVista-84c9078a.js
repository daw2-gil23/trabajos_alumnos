import { U as User } from "./main-193633d7.js";
const loginVista = {
  template: `
  <div
  class="vh-100 d-flex align-items-center justify-content-center"
  style="padding-top: 100px"
>
  <div class="col-12 col-md-4">
      <h1 class="text-center p-2">Login</h1>
      <form id="login" class="p-3" novalidate>
          <label class="mt-3 form-label" for="email">Email</label>
          <input type="email" id="emailL" class="form-control" value="" required />
          <div class="invalid-feedback">Debes introducir un email valido</div>

          <label class="mt-3 form-label" for="nick">Contraseña: </label>
          <input type="password" id="passwordL" class="form-control" value="" required />
          <div class="invalid-feedback">Esta no es una contraseña correcta</div>

          <button
              id="btn_submit"
              type="submit"
              class="mt-4 btn btn-success w-100"
          >
              Enviar
          </button>
          <p class="mt-3">
              <a href="">No recuerdo mi contraseña</a>
              <br />
              <a href="registro.html">Quiero Registrarme</a>
          </p>
          <p></p>
          <hr class="mt-5" />

          <button type="button" class="mt-1 btn btn-primary w-100">
              Login con Google
          </button>
      </form>
  </div>
</div>,

  `,
  script: () => {
    const form = document.querySelector("#login");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add("was-validated");
      if (!form.checkValidity()) {
        console.log("formulario no valido");
      } else {
        try {
          const userData = {
            email: document.querySelector("#emailL").value,
            password: document.querySelector("#passwordL").value
          };
          const usuarioLogeado = await User.login(userData);
          const divUsuarioLogeado = document.querySelectorAll("#emailUsuarioLogueado");
          divUsuarioLogeado[0].innerHTML = usuarioLogeado.email;
          window.location.href = "/trabajos_alumno/#/home";
        } catch (error) {
          alert("No se ha podido iniciar sesión " + error);
        }
      }
    });
  }
};
export {
  loginVista as default
};
