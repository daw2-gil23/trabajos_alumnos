# Practica 9 sesiones 
## Descripcion del proyecto
Esta practica consiste en seguir las sesiones del profesor, el cual nos enseña hacer un proyecto completo con supabase.
### Stac tecnologico
Las tecnologias que vamos a utilizar son:
- Javascript
- Html
- CSS
- Nodejs
- etc..
### Procedimientos 
Utilizaremos la metedeologia basado en agile y scrom 
1. Crearemos las historias
2. Dividiremos las historias en tareas 
3. Agruparemos las historias en sprins 
### Recuersos
[Tutorial JS](https://lenguajejs.com/javascript/)

~~~
import path from 'path'

export default {
  //aqui le dicimos donde tiene que buscar index.html
  root: path.resolve(__dirname, 'src'), // Carpeta donde alojamos el archivo main.js
  base: './',
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
    },
  build: {
    rollupOptions: {
        /*
            Opciones de configuración de Rollup externas, serán mergeadas con la configuracion
            interna de Rollup de Vite.
        */
        //donde tiene que buscar el carpete index cuando haga el build
        input: {
            main: path.resolve(__dirname, 'src/index.html'), // Indicamos las páginas que debe analizar
        },
        output: {
            dir: path.resolve(__dirname, 'dist'), //Donde se va a crear el build de nuestra aplicacion
            format: 'es', //Formato de ES modules
        },
    },
    outDir: path.resolve(__dirname, 'dist'),
    minify: false, //( Si no se quiere minificar el build) https://vitejs.dev/config/#build-minify (aplica solo a los JS no CSS)
},
  server: {
    port: 8080,
    hot: true
  }
}
~~~