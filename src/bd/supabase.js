import { createClient } from '@supabase/supabase-js'

// Conexión con supabase
// Estamos diciendo la url donde estara nuestra base de datos
const supabaseUrl = 'https://rlqaxmojclaftjfkcwuo.supabase.co'

// const supabaseKey = process.env.SUPABASE_KEY
// contraseña de base de datos
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWF4bW9qY2xhZnRqZmtjd3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNzY2MzQsImV4cCI6MTk5Mjc1MjYzNH0.GOUBrDRENYfYkdttQP4ugS1PyQR49a8rPhPq-E77RsY'

// conexion a la base de datos
export const supabase = createClient(supabaseUrl, supabaseKey)
