
// Import our custom CSS
import './scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { footer } from './componentes/footer'
import { header } from './componentes/header'
import { pruebas } from './vistas/pruebas'

document.querySelector('main').innerHTML = pruebas.template
pruebas.script()

document.querySelector('header').innerHTML = header.template
document.querySelector('footer').innerHTML = footer.template
