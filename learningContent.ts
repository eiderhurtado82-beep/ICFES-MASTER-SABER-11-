import { LearningTopic } from '../types';

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'learn-mat-porcentajes',
    area: 'MATEMATICAS',
    titulo: 'Porcentajes y Regla de Tres',
    subtitulo: 'Descuentos sucesivos, incrementos y proporciones directas/inversas',
    icono: 'Percent',
    resumenTeorico:
      'Un porcentaje es una fracción cuyo denominador es 100. En el ICFES, el 90% de las preguntas de razonamiento cuantitativo involucran variaciones porcentuales (aumentos o disminuciones) y factores multiplicativos. Recuerda: aplicar un 15% de descuento equivale a multiplicar por (1 - 0.15) = 0.85; aplicar un 19% de IVA equivale a multiplicar por (1 + 0.19) = 1.19.',
    clavesYFormulas: [
      'Factor de descuento: Valor Final = Valor Inicial × (1 - % / 100)',
      'Factor de incremento: Valor Final = Valor Inicial × (1 + % / 100)',
      'Variación Porcentual: ((Valor Final - Valor Inicial) / Valor Inicial) × 100%',
      'Proporción directa: Si una sube, la otra sube (A1/B1 = A2/B2)',
      'Proporción inversa (ej. trabajadores vs días): A1 × B1 = A2 × B2',
    ],
    ejemploIcfes: {
      enunciado:
        'Un artículo de $80.000 COP tiene un 25% de descuento y luego un recargo del 10% por entrega a domicilio sobre el valor con descuento. ¿Cuánto se cancela finalmente?',
      opciones: [
        '$60.000 COP',
        '$66.000 COP',
        '$68.000 COP',
        '$70.000 COP',
      ],
      solucionPasoAPaso: [
        'Paso 1: Calculamos el 25% de $80.000: 80.000 × 0.25 = $20.000 de descuento.',
        'Paso 2: Valor con descuento: 80.000 - 20.000 = $60.000 COP.',
        'Paso 3: Calculamos el recargo del 10% sobre los $60.000: 60.000 × 0.10 = $6.000 COP.',
        'Paso 4: Sumamos el domicilio: 60.000 + 6.000 = $66.000 COP.',
      ],
      respuestaCorrecta: 'B ($66.000 COP)',
      porQue:
        'El recargo no se calcula sobre los $80.000 iniciales sino sobre el subtotal tras el descuento.',
    },
    erroresComunes: [
      'Restar 25% y luego sumar 10% creyendo que equivale a un descuento neto del 15%. (Falso: las bases sobre las que se calculan son distintas).',
      'Confundir porcentaje de cambio con puntos porcentuales.',
    ],
    miniQuizPreguntaId: 'mat-001',
  },
  {
    id: 'learn-lec-tesis-argumentos',
    area: 'LECTURA_CRITICA',
    titulo: 'Tesis vs Argumentos en Textos Continuos',
    subtitulo: 'Cómo identificar la postura del autor y distinguir hechos de opiniones',
    icono: 'FileText',
    resumenTeorico:
      'La **Tesis** es la idea cardinal, la postura u opinión central que el autor busca defender o demostrar a lo largo del texto. Los **Argumentos** son las razones, evidencias, datos empíricos o deducciones lógicas que sostienen esa tesis. Un error frecuente es confundir la anécdota introductoria o un contraargumento con la tesis principal.',
    clavesYFormulas: [
      'La tesis responde a: ¿De qué me quiere convencer el autor?',
      'El argumento responde a: ¿Por qué razón debo creerle al autor?',
      'Conectores de causa (premisa de argumento): porque, ya que, dado que, puesto que.',
      'Conectores de consecuencia (conclusión/tesis): por lo tanto, en consecuencia, por ende.',
      'Conectores de contraste: sin embargo, no obstante, empero, por el contrario.',
    ],
    ejemploIcfes: {
      enunciado:
        '«Aunque muchos creen que la tecnología nos aísla, los estudios demuestran que las plataformas digitales han permitido que familias divididas por la migración mantengan vínculos cotidianos afectuosos. Por consiguiente, la tecnología no destruye la comunidad, sino que redefine sus canales.» ¿Cuál es la tesis?',
      opciones: [
        'Los estudios demuestran que las plataformas digitales son usadas por migrantes.',
        'La tecnología no destruye la comunidad humana, sino que amplía y transforma sus canales de comunicación.',
        'Las familias migrantes están tristes y aisladas por la distancia.',
        'Las plataformas digitales deben ser reguladas de inmediato por los gobiernos.',
      ],
      solucionPasoAPaso: [
        'Paso 1: Observa el conector de conclusión «Por consiguiente...».',
        'Paso 2: La cláusula que le sigue («la tecnología no destruye la comunidad...») es la tesis central.',
        'Paso 3: El estudio sobre familias migrantes es el dato/argumento de soporte.',
      ],
      respuestaCorrecta: 'B',
      porQue:
        'Es la afirmación concluyente que sintetiza la posición del emisor frente a la objeción inicial.',
    },
    erroresComunes: [
      'Confundir un dato estadístico o un ejemplo secundario con la tesis general del autor.',
      'Elegir una opción que coincide con lo que el estudiante opina personalmente pero que el texto contradice.',
    ],
    miniQuizPreguntaId: 'lec-001',
  },
  {
    id: 'learn-cie-metodo-cientifico',
    area: 'CIENCIAS_NATURALES',
    titulo: 'Diseño Experimental y Variables',
    subtitulo: 'Variable independiente, dependiente y grupo de control en Indagación',
    icono: 'Atom',
    resumenTeorico:
      'En la prueba de Ciencias Naturales del ICFES, la competencia de **Indagación** evalúa si comprendes la metodología de una investigación: identificar qué factor se manipula deliberadamente (**Variable Independiente**), qué variable se mide para ver el efecto (**Variable Dependiente**) y cuáles factores deben mantenerse idénticos (**Variables Controladas**) para que el experimento sea válido.',
    clavesYFormulas: [
      'Variable Independiente (Causa): Lo que el científico cambia a propósito (ej. concentración de abono).',
      'Variable Dependiente (Efecto): Lo que se mide o registra (ej. altura de la planta en cm).',
      'Variables de Control: Lo que debe ser idéntico en todos los ensayos (luz, agua, temperatura).',
      'Grupo Control: Muestra testigo sin tratamiento para contrastar los resultados.',
      'Repetibilidad: Un solo ensayo no basta para sacar conclusiones definitivas.',
    ],
    ejemploIcfes: {
      enunciado:
        'Un investigador quiere probar si la cafeína acelera los latidos cardíacos en peces cebra. Coloca 20 peces en agua pura y 20 peces en agua con 5 mg/L de cafeína, midiendo las pulsaciones por minuto a 22°C. ¿Cuál es la variable dependiente?',
      opciones: [
        'La temperatura del agua (22°C).',
        'La frecuencia de latidos cardíacos por minuto de los peces.',
        'La concentración de cafeína agregada al agua.',
        'La especie de pez cebra utilizada en el laboratorio.',
      ],
      solucionPasoAPaso: [
        'Paso 1: ¿Qué se manipula? La concentración de cafeína (Variable Independiente).',
        'Paso 2: ¿Qué se mide como respuesta? La frecuencia de latidos cardíacos.',
        'Paso 3: Por lo tanto, la frecuencia de latidos es la Variable Dependiente.',
      ],
      respuestaCorrecta: 'B (La frecuencia de latidos cardíacos por minuto)',
      porQue:
        'Es la variable que responde y se mide en función del tratamiento químico aplicado.',
    },
    erroresComunes: [
      'Invertir la relación causa-efecto (marcar la variable independiente cuando piden la dependiente).',
      'Olvidar la necesidad de un grupo de control para descartar factores ambientales externos.',
    ],
    miniQuizPreguntaId: 'cie-001',
  },
  {
    id: 'learn-soc-constitucion',
    area: 'SOCIALES_CIUDADANAS',
    titulo: 'Constitución de 1991 y Ramas del Poder',
    subtitulo: 'Derechos fundamentales, mecanismos de protección y frenos y contrapesos',
    icono: 'ShieldCheck',
    resumenTeorico:
      'Colombia es un Estado Social de Derecho organizado en tres Ramas del Poder Público (Ejecutiva, Legislativa y Judicial) más los Órganos de Control (Procuraduría, Contraloría, Defensoría del Pueblo) y la Organización Electoral (CNE y Registraduría). El principio de frenos y contrapesos garantiza que ninguna rama concentre todo el poder.',
    clavesYFormulas: [
      'Rama Ejecutiva: Presidente, Ministros, Gobernadores y Alcaldes (Administra y ejecuta políticas).',
      'Rama Legislativa: Congreso (Senado y Cámara de Representantes) (Hace leyes y reforma la Constitución).',
      'Rama Judicial: Corte Constitucional, Corte Suprema, Consejo de Estado, Fiscalía y Jueces (Aplica la justicia).',
      'Acción de Tutela (Art. 86): Protege derechos fundamentales en peligro inminente (fallo en 10 días).',
      'Habeas Corpus (Art. 30): Protege la libertad personal ante detenciones arbitrarias (36 horas).',
    ],
    ejemploIcfes: {
      enunciado:
        'Si el Congreso de la República aprueba una ley que prohíbe a las mujeres votar en elecciones públicas, ¿qué institución tiene la función constitucional de declarar dicha ley inconstitucional e inaplicable?',
      opciones: [
        'El Ministerio del Interior',
        'La Corte Constitucional',
        'La Registraduría Nacional del Estado Civil',
        'La Policía Nacional',
      ],
      solucionPasoAPaso: [
        'Paso 1: La ley vulnera el derecho a la igualdad y la democracia participativa.',
        'Paso 2: El órgano guardián de la supremacía e integridad de la Carta Magna es la Corte Constitucional.',
        'Paso 3: Mediante el control de constitucionalidad, la Corte puede expulsar la norma del ordenamiento jurídico.',
      ],
      respuestaCorrecta: 'B (La Corte Constitucional)',
      porQue:
        'La Corte Constitucional ejerce el control jurisdiccional sobre las leyes aprobadas por el Congreso.',
    },
    erroresComunes: [
      'Creer que el Presidente de la República puede anular leyes a su antojo sin control judicial.',
      'Confundir la Procuraduría (vigilancia de servidores públicos) con la Fiscalía (investigación de delitos penales).',
    ],
    miniQuizPreguntaId: 'soc-001',
  },
  {
    id: 'learn-ing-estrategias',
    area: 'INGLES',
    titulo: 'Estrategias para las 7 Partes de la Prueba de Inglés',
    subtitulo: 'Skimming, scanning, identificación de tiempos verbales y vocabulario clave',
    icono: 'Languages',
    resumenTeorico:
      'La prueba de inglés Saber 11 evalúa los niveles A1, A2 y B1 del Marco Común Europeo mediante 7 partes: 1) Avisos y lugares, 2) Asociación de definiciones y palabras, 3) Conversaciones cotidianas, 4) Textos con huecos gramaticales (preposiciones, verbos), 5) Comprensión literal de textos informativos, 6) Comprensión inferencial y opinión del autor, 7) Textos con huecos de vocabulario avanzado.',
    clavesYFormulas: [
      'Scanning: Búsqueda rápida de palabras clave específicas (fechas, nombres, lugares) sin leer todo.',
      'Skimming: Lectura veloz de las primeras y últimas frases de cada párrafo para captar la idea global.',
      'Tiempos verbales: Present Perfect (have/has + past participle) para experiencias; Past Simple (ed/irregular) para hechos concluidos en fecha fija.',
      'Conectores de contraste indispensables: Although, However, In spite of, Whereas.',
    ],
    ejemploIcfes: {
      enunciado:
        '«She has lived in Medellín ________ five years, but yesterday she decided to move to Cali.» ¿Qué palabra completa correctamente?',
      opciones: ['since', 'for', 'during', 'from'],
      solucionPasoAPaso: [
        'Paso 1: El tiempo verbal es Present Perfect («has lived»).',
        'Paso 2: «five years» es una duración o periodo de tiempo cuantitativo.',
        'Paso 3: Se usa «for» para periodos de tiempo acumulados («for five years») y «since» para un punto de inicio específico («since 2020»).',
      ],
      respuestaCorrecta: 'B (for)',
      porQue:
        '«for» se utiliza con lapsos de duración («for 3 hours», «for 5 years»).',
    },
    erroresComunes: [
      'Usar «since» con lapsos de duración en lugar de fechas de inicio.',
      'Traducir «actually» como «actualmente» (Falso amigo: actually significa "en realidad/de hecho"; actualmente se dice "currently").',
    ],
    miniQuizPreguntaId: 'ing-003',
  },
];
