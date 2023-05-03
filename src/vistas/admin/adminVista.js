export default {
  template: `
  <div
  class="vh-100 d-flex align-items-center justify-content-center"
  style="padding-top: 100px"
>
  <div class="col-12 col-md-4">
      <h1 class="text-center p-2">Registro</h1>
      <form id="form_registro" class="p-3" novalidate>
          <label class="mt-3 form-label" for="nombre">Nombre: </label>
          <input type="text" class="form-control" value="" placeholder ="Manolito" required />
          <div class="invalid-feedback">El nombre no es correcto</div>

          <label class="mt-3 form-label" for="apellidos">Apellidos: </label>
          <input type="text" class="form-control" value="" placeholder = "Gafotas Rotas" required />
          <div class="invalid-feedback">Este campo no es correcto</div>

          <label class="mt-3 form-label" for="email">Email</label>
          <input
              type="email"
              class="form-control"
              value=""
              placeholder = "ychag@example.com"
              required
          />
          <div class="invalid-feedback">El email no es correcto</div>

          <label class="mt-3 form-label" for="nick">Contraseña: </label>
          <input
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

          <button type="submit" class="mt-5 btn btn-success w-100">
              Enviar
          </button>
          <hr class="mt-5" />
          <button type="submit" class="mt-1 btn btn-primary w-100">
              Registrate con Google
          </button>
      </form>
  </div>
</div>
    `
}
