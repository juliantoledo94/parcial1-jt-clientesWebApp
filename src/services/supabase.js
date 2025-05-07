// La carpeta "services" la vamos a usar para guardar los distintos servicios. Un servicio es una biblioteca que ofrece
// funciones para interactuar con alguna funcionalidad.
// Este servicio va a simplemente proveer la instancia del cliente de Supabase para que otros la puedan utilizar.
import { createClient } from '@supabase/supabase-js';

// Reemplacen estos por sus claves.
const SUPABASE_URL = "https://vscaoucmqdukbaltofxe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzY2FvdWNtcWR1a2JhbHRvZnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzM3MzQsImV4cCI6MjA2MDc0OTczNH0.vQtWzcj7nf19IRt-hptEV7N_F9gJHgXEJG6HdKnimKk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;