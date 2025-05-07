// La carpeta "services" la vamos a usar para guardar los distintos servicios. Un servicio es una biblioteca que ofrece
// funciones para interactuar con alguna funcionalidad.
// Este servicio va a simplemente proveer la instancia del cliente de Supabase para que otros la puedan utilizar.
import { createClient } from '@supabase/supabase-js';

// Reemplacen estos por sus claves.
const SUPABASE_URL = "https://ishyyrthrjiwvcshisvp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzaHl5cnRocmppd3Zjc2hpc3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNTQ3NTksImV4cCI6MjA1OTczMDc1OX0.XnUwFMwgDqrlh88nLxTlWr-04WS7ylUvCsBEhnjNNQQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;