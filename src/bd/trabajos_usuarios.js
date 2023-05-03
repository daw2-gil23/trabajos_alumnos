// Importamos la conexión a la base de datos
import { supabase } from './supabase.js'
export class Trabajo_usuario {
  // Mapping de propiedades de la tabla perfiles
  constructor (id = null, created_at = null, trabajo_id = null, user_id = null) {
    this.id = id
    this.created_at = created_at
    this.trabajo_id = trabajo_id
    this.user_id = user_id
  }

  // leer todos
  static async getAll () {
    const { data: trabajoUsuarios, error } = await supabase
      .from('trabajos_usuarios')
      .select('*')
    if (error) {
      throw new Error(error.message)
    }
    // devuelve array de objetos
    return trabajoUsuarios.map(({ id, created_at, trabajo_id, user_id }) => {
      return new Trabajo_usuario(id, created_at, trabajo_id, user_id)
    })
  }

  // leer registro por id (método static que se puede leer desde la clase sin necesidad de crear una instancia)
  static async getById (id) {
    const { data: trabajoUsuarios, error } = await supabase
      .from('trabajos_usuarios')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      throw new Error(error.message)
    }
    // Devuelve un nuevo objeto con los datos del registro
    return new Trabajo_usuario(trabajoUsuarios.id, trabajoUsuarios.created_at, trabajoUsuarios.trabajo_id, trabajoUsuarios.user_id)
  }

  // crear registro (método static que se puede leer desde la clase sin necesidad de crear una instancia)
  static async create (trabajoUsuarios) {
    const { error } = await supabase
      .from('trabajos_usuarios')
      .insert(trabajoUsuarios)
      .select()
      // console.log('nuevo perfil ',error);
    if (error) {
      throw new Error(error.message)
    }
    return true
  }

  // actualizar
  async update () {
    const { error } = await supabase
      .from('trabajos_usuarios')
      .update({
        created_at: this.created_at,
        trabajo_id: this.trabajo_id
      })
      .eq('id', this.id)
      .single()
    if (error) {
      throw new Error(error.message)
    }
    return true
  }

  // borrar
  static async delete (id) {
    const { error } = await supabase
      .from('trabajos_usuarios')
      .delete()
      .eq('id', id)
    if (error) {
      throw new Error(error.message)
    }
    return true
  }
}
