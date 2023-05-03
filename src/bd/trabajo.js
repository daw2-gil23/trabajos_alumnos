// Importamos la conexión a la base de datos
import { supabase } from './supabase.js'
export class Trabajo {
  // Mapping de propiedades de la tabla perfiles
  constructor (id = null, created_at = null, nombre = null, definicion = null, uf = null, ra = null, fecha_inicio = null, fecha_final = null, modulo = null) {
    this.id = id
    this.created_at = created_at
    this.nombre = nombre
    this.definicion = definicion
    this.uf = uf
    this.ra = ra
    this.fecha_inicio = fecha_inicio
    this.fecha_final = fecha_final
    this.modulo = modulo
  }

  // leer todos
  static async getAll () {
    const { data: trabajos, error } = await supabase
      .from('trabajos')
      .select('*')
    if (error) {
      throw new Error(error.message)
    }
    // devuelve array de objetos
    return trabajos.map(({ id, created_at, nombre, definicion, uf, ra, fecha_inicio, fecha_final, modulo }) => {
      return new Trabajo(id, created_at, nombre, definicion, uf, ra, fecha_inicio, fecha_final, modulo)
    })
  }

  // leer registro por id (método static que se puede leer desde la clase sin necesidad de crear una instancia)
  static async getById (id) {
    const { data: trabajos, error } = await supabase
      .from('trabajos')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      throw new Error(error.message)
    }
    // Devuelve un nuevo objeto con los datos del registro
    return new Trabajo(trabajos.id, trabajos.created_at, trabajos.nombre, trabajos.definicion, trabajos.uf, trabajos.ra, trabajos.fecha_inicio, trabajos.fecha_final, trabajos.modulo)
  }

  // crear registro (método static que se puede leer desde la clase sin necesidad de crear una instancia)
  static async create (trabajoData) {
    const { error } = await supabase
      .from('trabajos')
      .insert(trabajoData)
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
      .from('trabajos')
      .update({
        nombre: this.nombre,
        definicion: this.definicion,
        uf: this.uf,
        ra: this.ra,
        fecha_inicio: this.fecha_inicio,
        fecha_final: this.fecha_final,
        modulo: this.modulo
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
      .from('trabajos')
      .delete()
      .eq('id', id)
    if (error) {
      throw new Error(error.message)
    }
    return true
  }
}
