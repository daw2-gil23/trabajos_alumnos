
// Cargamos libreria de supabase
import { createClient } from '@supabase/supabase-js'

export const pruebas = {
  template: '<h1>Pruebas</h1>',
  script: async () => {
    // Conexión con supabase
    // Estamos diciendo la url donde estara nuestra base de datos
    const supabaseUrl = 'https://rlqaxmojclaftjfkcwuo.supabase.co'

    // const supabaseKey = process.env.SUPABASE_KEY
    // contraseña de base de datos
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWF4bW9qY2xhZnRqZmtjd3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNzY2MzQsImV4cCI6MTk5Mjc1MjYzNH0.GOUBrDRENYfYkdttQP4ugS1PyQR49a8rPhPq-E77RsY'

    // conexion a la base de datos
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('conexión a supabase: ' + supabase)

    const leerTodosPerfiles = async () => {
      // READ ALL ROWS
      const { data: perfiles, error } = await supabase
        .from('perfiles')
        .select('*')

      console.log(perfiles)
      return perfiles
    }

    const agregarPerfiles = async () => {
      // Insertar nuevo perfil
      // INSERT A ROW
      const { data, error } = await supabase
        .from('perfiles')
        .insert([
          { nombre: 'ejemplo' }
        ])
    }

    // con el await se detiene hasta que la funcion acabe
    // await leerTodosPerfiles()

    // await agregarPerfiles()

    // await leerTodosPerfiles()

    // proyectos detalles a partir de funcion postgresSQL
    const LeerProyectosDetalle = async () => {
      // INVOKE FUNCTION
      const { data, error } = await supabase
        .rpc('proyectosdetalle')

      if (error) console.error(error)
      else console.log(data)
      return data
    }

    const regristo = async () => {
      // USER SIGNUP
      const { data, error } = await supabase.auth.signUp({
        email: 'maria00018000@gmail.com',
        password: '123456'
      })
    }

    const login = async () => {
      // USER LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'maria00018000@gmail.com',
        password: '123456'
      })
    }

    const verUsuarioLogueado = async () => {
      // GET USER
      const { data: { user } } = await supabase.auth.getUser()
      return user
    }

    const logout = async () => {
      // USER LOGOUT
      const { error } = await supabase.auth.signOut()
      console.log(error)
    }

    // 1. Miramos usuario logueado
    console.log('Detalle usuario logueado:', await verUsuarioLogueado())

    // 2. Me logueo
    await login()

    // 3.miramos usuario logueado
    console.log('Detalle usuario logueado:', await verUsuarioLogueado())

    await logout()
  }
}
