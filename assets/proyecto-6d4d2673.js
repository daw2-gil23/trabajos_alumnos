import { s as supabase } from "./main-193633d7.js";
class Proyecto {
  // Mapping de propiedades de la tabla perfiles
  constructor(id = null, created_at = null, nombre = null, descripcion = null, nota = null, user_id = null, enlace = null) {
    this.id = id;
    this.created_at = created_at;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.nota = nota;
    this.user_id = user_id;
    this.enlace = enlace;
  }
  // leer todos
  static async getAll() {
    const { data: proyecto, error } = await supabase.from("proyectos").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return proyecto.map(({ id, created_at, nombre, descripcion, nota, user_id, enlace }) => {
      return new Proyecto(id, created_at, nombre, descripcion, nota, user_id, enlace);
    });
  }
  // leer registro por id (método static que se puede leer desde la clase sin necesidad de crear una instancia)
  static async getById(id) {
    const { data: proyectos, error } = await supabase.from("proyectos").select("*").eq("id", id).single();
    if (error) {
      throw new Error(error.message);
    }
    return new Proyecto(proyectos.id, proyectos.created_at, proyectos.nombre, proyectos.descripcion, proyectos.nota, proyectos.user_id, proyectos.enlace);
  }
  // crear registro (método static que se puede leer desde la clase sin necesidad de crear una instancia)
  static async create(proyectoData) {
    const { error } = await supabase.from("proyectos").insert(proyectoData).select();
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }
  // actualizar
  async update() {
    const { error } = await supabase.from("proyectos").update({
      nombre: this.nombre,
      descripcion: this.descripcion,
      nota: this.nota
    }).eq("id", this.id).single();
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }
  // borrar
  static async delete(id) {
    const { error } = await supabase.from("proyectos").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }
  static async buscarAutor(id) {
    const { data, error } = await supabase.rpc("buscarautor", {
      id
    });
    if (error)
      console.error(error);
    else
      return data;
  }
}
export {
  Proyecto as P
};
