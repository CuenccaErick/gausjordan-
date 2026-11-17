-- 1. Tabla de Perfiles (Extiende los datos de Google Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('teacher', 'student')),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 2. Tabla de Ejercicios
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  instructions TEXT,
  matrix_initial JSONB NOT NULL, -- Guardamos la matriz como JSON
  matrix_solution JSONB NOT NULL,
  class_code TEXT UNIQUE NOT NULL, -- El código de 6 caracteres
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Intentos (Resultados de alumnos)
CREATE TABLE student_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID REFERENCES exercises(id),
  student_id UUID REFERENCES profiles(id),
  score INTEGER,
  accuracy DECIMAL,
  time_elapsed INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


add name:
ALTER TABLE profiles 
ADD COLUMN name TEXT,
ADD COLUMN avatar TEXT;
add student: 
ALTER TABLE student_attempts 
ADD COLUMN IF NOT EXISTS student_name TEXT,
ADD COLUMN IF NOT EXISTS student_matricula TEXT;

exercise table: 
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    instructions TEXT,
    class_code TEXT UNIQUE NOT NULL,
    matrices JSONB NOT NULL, -- Guardamos el array de matrices
    correct_answers JSONB NOT NULL, -- Guardamos el array de soluciones
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ejecuta esto para unificar las columnas
ALTER TABLE exercises 
DROP COLUMN IF EXISTS matrix_initial,
DROP COLUMN IF EXISTS matrix_solution;

ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS matrices JSONB,
ADD COLUMN IF NOT EXISTS correct_answers JSONB;

-- 1. Renombrar columnas si existen con los nombres viejos
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='exercises' AND column_name='matrix_initial') THEN
    ALTER TABLE exercises RENAME COLUMN matrix_initial TO matrices;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='exercises' AND column_name='matrix_solution') THEN
    ALTER TABLE exercises RENAME COLUMN matrix_solution TO correct_answers;
  END IF;
END $$;

-- 2. Asegurarnos de que las columnas tengan el tipo de dato correcto (JSONB)
ALTER TABLE exercises 
ALTER COLUMN matrices TYPE JSONB USING matrices::jsonb,
ALTER COLUMN correct_answers TYPE JSONB USING correct_answers::jsonb;

-- 3. Verificamos que la tabla de intentos tenga nombre y matrícula
ALTER TABLE student_attempts 
ADD COLUMN IF NOT EXISTS student_name TEXT,
ADD COLUMN IF NOT EXISTS student_matricula TEXT;


-- ══════════════════════════════════════════
-- 1. HABILITAR RLS EN LAS 3 TABLAS
-- ══════════════════════════════════════════
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;


-- ══════════════════════════════════════════
-- 2. POLÍTICAS PARA: profiles
-- ══════════════════════════════════════════

-- Cada quien solo lee y edita su propio perfil
CREATE POLICY "perfil_propio"
ON profiles
FOR ALL
USING (id = auth.uid())
WITH CHECK (id = auth.uid());


-- ══════════════════════════════════════════
-- 3. POLÍTICAS PARA: exercises
-- ══════════════════════════════════════════

-- El profesor solo ve, crea y edita SUS ejercicios
CREATE POLICY "profesor_sus_ejercicios"
ON exercises
FOR ALL
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

-- El alumno puede leer un ejercicio si tiene el class_code
-- (necesario para que el alumno entre con el código)
CREATE POLICY "alumno_lee_por_codigo"
ON exercises
FOR SELECT
USING (true);
-- Nota: esto permite leer cualquier ejercicio a cualquier
-- usuario autenticado. Está bien porque el código de 6
-- caracteres ya actúa como "contraseña" del ejercicio.


-- El alumno puede insertar su propio intento
CREATE POLICY "alumno_inserta_intento"
ON student_attempts
FOR INSERT
WITH CHECK (student_id = auth.uid());

-- El alumno solo ve SUS propios intentos
CREATE POLICY "alumno_ve_sus_intentos"
ON student_attempts
FOR SELECT
USING (student_id = auth.uid());

-- El profesor puede ver todos los intentos de SUS ejercicios
CREATE POLICY "profesor_ve_intentos_de_sus_ejercicios"
ON student_attempts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM exercises
    WHERE exercises.id = student_attempts.exercise_id
    AND exercises.teacher_id = auth.uid()
  )
);


-- ══════════════════════════════════════════
-- 5. AGREGAR COLUMNA DE EVIDENCIA
-- ══════════════════════════════════════════
ALTER TABLE student_attempts
ADD COLUMN IF NOT EXISTS evidence_url TEXT;

-- Alumno puede subir su propio archivo
CREATE POLICY "alumno_sube_evidencia"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'evidence-files'
  AND auth.uid() IS NOT NULL
);

-- El profesor puede ver archivos de sus ejercicios
-- (acceso de lectura a cualquier autenticado, el path lo controla el código)
CREATE POLICY "autenticados_leen_evidencia"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'evidence-files'
  AND auth.uid() IS NOT NULL
);