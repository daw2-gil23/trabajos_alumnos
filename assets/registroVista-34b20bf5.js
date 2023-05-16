import { U as User, P as Perfil } from "./main-193633d7.js";
const registroVista = {
  template: `
  <div class="container mt-5">
    <div class="row">
    <h1 class="text-center p-2 w-100">Registro</h1>
    <div class="col-12 col-md-4 offset-md-4">
      <form id="form_registro" class="p-3" novalidate>
        <label class="mt-3 form-label" for="nombre">Nombre: </label>
        <input
          id="nombreR" 
          type="text" 
          class="form-control" 
          value="" 
          placeholder ="Manolito" 
          required 
        />
        <div class="invalid-feedback">El nombre no es correcto</div>

        <label class="mt-3 form-label" for="apellidos">Apellidos: </label>
        <input 
          id="apellidosR"
          type="text" 
          class="form-control" 
          value="" 
          placeholder = "Gafotas Rotas" required 
          />
        <div class="invalid-feedback">Este campo no es correcto</div>

        <label class="mt-3 form-label" for="email">Email</label>
        <input
            id="emailR"
            type="email"
            class="form-control"
            value=""
            placeholder = "ychag@example.com"
            required
        />
        <div class="invalid-feedback">El email no es correcto</div>

        <label class="mt-3 form-label" for="nick">Contraseña: </label>
        <input
            id="contrasenaR"
            type="password"
            class="form-control"
            value=""
            pattern="[A-Za-z]{8,}"
            placeholder = "Contraseña"
            required
        />

        <div class="invalid-feedback">
            La contraseña debe contener 8 letras o más que deben ser mayusculas y minusculas, no se aceptan signos ni números
        </div>

        <p class="mt-3">Sube un avatar</p> 
        <input type="file" id="avatar-input">

        <button type="submit" class="mt-5 btn btn-success w-100">
            Enviar
        </button>
      </form>
    </div>
    
   
</div>
    `,
  script: () => {
    document.querySelector("#form_registro").addEventListener("submit", async function(e) {
      e.preventDefault();
      try {
        const usuario = {
          email: document.querySelector("#emailR").value,
          password: document.querySelector("#contrasenaR").value
        };
        const nuevoUser = await User.create(usuario);
        const perfilData = {
          nombre: document.querySelector("#nombreR").value,
          apellidos: document.querySelector("#apellidosR").value,
          email: document.querySelector("#emailR").value,
          rol: "registrado",
          user_id: nuevoUser.id
          // Tomamos el id que nos devuelve el registro
        };
        await Perfil.create(perfilData);
        alert("Usuario creado con éxito");
        window.location.href = "/trabajos_alumno/#/login";
      } catch (error) {
        console.log(error);
        alert("Error al crear usuario");
      }
    });
  }
};
export {
  registroVista as default
};
