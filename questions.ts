import { Question, SubjectArea } from '../types';

export const AREA_METADATA: Record<
  SubjectArea,
  {
    name: string;
    shortName: string;
    color: string;
    bgLight: string;
    border: string;
    badgeBg: string;
    icon: string;
    description: string;
  }
> = {
  MATEMATICAS: {
    name: 'Matemáticas',
    shortName: 'Matemáticas',
    color: 'text-blue-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
    icon: 'Calculator',
    description: 'Razonamiento cuantitativo, álgebra, geometría, estadística y probabilidad.',
  },
  LECTURA_CRITICA: {
    name: 'Lectura Crítica',
    shortName: 'Lectura Crítica',
    color: 'text-amber-600',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    icon: 'BookOpen',
    description: 'Comprensión literal, inferencial, argumentación y textos continuos/discontinuos.',
  },
  CIENCIAS_NATURALES: {
    name: 'Ciencias Naturales',
    shortName: 'Ciencias',
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    icon: 'FlaskConical',
    description: 'Biología, física, química, medio ambiente, indagación y explicación de fenómenos.',
  },
  SOCIALES_CIUDADANAS: {
    name: 'Sociales y Ciudadanas',
    shortName: 'Sociales',
    color: 'text-rose-600',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
    icon: 'Landmark',
    description: 'Constitución Política de Colombia, historia, geografía y competencias ciudadanas.',
  },
  INGLES: {
    name: 'Inglés',
    shortName: 'Inglés',
    color: 'text-purple-600',
    bgLight: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
    icon: 'Globe',
    description: 'Vocabulario, gramática, avisos, diálogos contextuales y comprensión lectora.',
  },
};

export const INITIAL_QUESTIONS: Question[] = [
  // =================================================================================================
  // 1. LECTURA CRÍTICA (Textos Continuos Filosóficos, Ensayos, Argumentación y Multiperspectivismo)
  // =================================================================================================
  {
    id: 'lec-001',
    area: 'LECTURA_CRITICA',
    tema: 'Filosofía y Argumentación Contemporánea',
    subtema: 'Identificación de la Tesis Central y Estructura Argumentativa',
    competencia: 'Reflexión y evaluación',
    dificultad: 'Avanzada',
    contexto: `La pobreza y la impotencia de la imaginación nunca se manifiestan de una manera tan clara como cuando se trata de imaginar la felicidad. Entonces no inventamos más que paraísos perdidos o futuros: islas afortunadas, patrias celestiales, sociedades sin contradicciones ni antagonismos, mundos de una beatitud uniforme donde ya no queda nada por desear, ni por conquistar, ni por transformar. Anhelamos un estado de reposo definitivo donde la incertidumbre haya quedado erradicada y la vida transcurra sin asperezas ni dolores.\n\nSin embargo, este sueño idílico encierra una amenaza secreta para el espíritu humano. En cuanto nos imaginamos liberados de todo conflicto, nos encontramos de pronto sumidos en el más insoportable tedio. Porque la verdad es que nosotros no queremos realmente esa armonía estática; lo que deseamos es la lucha, la búsqueda laboriosa, el esfuerzo contra la resistencia del mundo. Cuando una doctrina política o religiosa nos promete el paraíso en la tierra, invariablemente termina construyendo un infierno terrenal, pues para forzar a los hombres a encajar en una sociedad sin discrepancias, debe primero aniquilar toda disidencia, todo pensamiento divergente y toda individualidad.\n\nEl respeto hacia el otro solo nace de la convicción sincera de que el otro puede tener razón, o al menos de que en su diferencia radica una posibilidad de enriquecimiento mutuo. Aquel que cree poseer la verdad absoluta no dialoga: pontifica, condena o tolera con una condescendencia insultante. La verdadera democracia y la madurez ética consisten, precisamente, en aprender a convivir con el conflicto sin pretender resolverlo mediante la eliminación del adversario, reconociendo que la dificultad y la contradicción no son accidentes desdichados de la existencia, sino la condición indispensable de nuestra dignidad y de nuestra libertad.`,
    pregunta: 'A partir de la progresión argumentativa del texto anterior, ¿cuál de los siguientes enunciados expresa de forma más precisa la tesis central del autor?',
    opciones: [
      'La felicidad es un concepto inalcanzable porque los seres humanos estamos condenados biológicamente al sufrimiento y a la desesperanza existencial.',
      'La aspiración a una sociedad ideal sin conflictos engendra autoritarismo y esterilidad, pues la contradicción y la dificultad son la base indispensable de la libertad y la madurez humana.',
      'Los movimientos políticos y las doctrinas religiosas contemporáneas carecen por completo de imaginación para diseñar planes de gobierno justos y equitativos.',
      'La democracia solo puede prosperar cuando los ciudadanos renuncian a sus convicciones individuales para someterse ciegamente al consenso general de las mayorías.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'El autor (en la línea de pensamiento de Estanislao Zuleta en su célebre "Elogio de la dificultad") parte de la crítica a las utopías estáticas para demostrar que el deseo de erradicar todo conflicto conduce al tedio existencial y a la tiranía política. Su tesis medular —desarrollada en los párrafos 2 y 3— sostiene que la dignidad humana, la ética y la democracia requieren aceptar la contradicción y la dificultad como constitutivas de la vida, y no buscar suprimir al adversario bajo el pretexto de un paraíso sin tensiones.',
      aprendeEsto:
        'En los textos filosóficos densos del ICFES, la tesis rara vez es una queja superficial o un dato empírico aislado. Busca la postura propositiva final del autor: ¿frente a qué error de pensamiento nos advierte y qué alternativa ética o conceptual defiende como conclusión última?',
      errorFrecuente:
        'Marcar la opción A por una interpretación pesimista apresurada del primer párrafo, o la opción C por tomar la mención a doctrinas políticas como el tema principal, perdiendo de vista la reflexión universal sobre el conflicto y la libertad.',
      consejoIcfes:
        'Presta atención a los conectores de contraste y consecuencia («Sin embargo», «Porque la verdad es», «consisten, precisamente, en»). Marcan el momento exacto en que el autor abandona la descripción introductoria y plantea su argumento central.',
    },
  },
  {
    id: 'lec-002',
    area: 'LECTURA_CRITICA',
    tema: 'Ensayo Crítico y Opinión Pública',
    subtema: 'Inferencia de Supuestos y Falacias Retóricas',
    competencia: 'Comprensión y articulación',
    dificultad: 'Media',
    contexto: `Vivimos en la era de la saturación informativa, pero paradójicamente nunca habíamos estado tan expuestos a la indigestión cognitiva. Cada segundo se publican cientos de miles de opiniones, análisis instantáneos y titulares diseñados para activar los centros emocionales de nuestra amígdala cerebral antes de que el córtex prefrontal tenga la menor oportunidad de procesar la veracidad del mensaje.\n\nLos algoritmos de las redes sociales no fueron diseñados con un propósito pedagógico ni cívico; su métrica reina es el tiempo de permanencia en pantalla. Y nada retiene con mayor eficacia la atención humana que la indignación moral y el sesgo de confirmación. Al presentarnos de manera continua datos que refuerzan nuestras simpatías y caricaturizan los argumentos del rival, las plataformas han transformado el debate público en una contienda tribal de trincheras ideológicas, donde disentir es visto como una traición y la duda metódica como un síntoma de debilidad intelectual.\n\nCreer que el antídoto contra este fenómeno consiste simplemente en instalar filtros automatizados de verificación de hechos («fact-checking») es caer en una ingenuidad tecnocrática. La censura de contenidos dudosos no educa el criterio; únicamente traslada la sospecha. La verdadera alfabetización digital no es el dominio instrumental de una aplicación tecnológica, sino el rescate de la pausa reflexiva: la capacidad estoica de suspender el juicio, verificar las fuentes primarias y admitir con humildad socrática que sobre la mayoría de los asuntos complejos no tenemos información suficiente para emitir un veredicto definitivo.`,
    pregunta: 'Considere la relación entre los párrafos 2 y 3 del texto. ¿Cuál es el supuesto implícito fundamental sobre el que el autor fundamenta su crítica a los verificadores de hechos («fact-checking»)?',
    opciones: [
      'Que las empresas de tecnología carecen de recursos financieros suficientes para contratar analistas humanos que clasifiquen los datos.',
      'Que el problema de la desinformación no es un defecto meramente técnico que se resuelva censurando información, sino una carencia de pensamiento crítico y templanza intelectual en los propios lectores.',
      'Que la totalidad de las afirmaciones que circulan en redes sociales son verdades subjetivas que ninguna institución tiene derecho a calificar de falsas.',
      'Que los verificadores de datos siempre están financiados por partidos políticos que buscan favorecer a candidatos autoritarios.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'En el tercer párrafo, el autor califica de «ingenuidad tecnocrática» pretender solucionar el problema con fact-checking, porque este mecanismo asume erróneamente que el problema es técnico-editorial. Su supuesto subyacente es que la raíz del dilema radica en la conducta y psicología cognitiva del usuario: la falta de pausa reflexiva, el sesgo de confirmación y la incapacidad de dudar. Por tanto, ninguna herramienta externa sustituye la formación del criterio crítico autónomo.',
      aprendeEsto:
        'Un supuesto implícito es una premisa que no está escrita palabra por palabra, pero que es estrictamente necesaria para que la afirmación del autor tenga sentido lógico. Para hallarla, pregúntate: «¿Qué debe asumir como verdadero el autor para poder descalificar el fact-checking de esa manera?»',
      errorFrecuente:
        'Elegir la opción C cayendo en un relativismo radical que el texto no sostiene (el texto sí cree en fuentes primarias y en la verdad factual), o la opción D introduciendo sesgos conspirativos que no derivan de la argumentación expuesta.',
      consejoIcfes:
        'Distingue siempre entre lo que el texto dice explícitamente y lo que presupone lógicamente. Los distractores del ICFES suelen incluir opiniones extremas con las que el estudiante podría simpatizar pero que distorsionan el argumento del autor.',
    },
  },
  {
    id: 'lec-003',
    area: 'LECTURA_CRITICA',
    tema: 'Literatura Universal y Diálogo de Voces',
    subtema: 'Análisis de Perspectivas y Tono Discursivo',
    competencia: 'Identificación de contenidos locales',
    dificultad: 'Media',
    contexto: `En el juicio, el fiscal se puso de pie, ajustó su toga y miró al jurado con una serenidad calculada. «Señores del jurado: no estamos aquí únicamente para determinar si el acusado accionó el arma aquella tarde calurosa en la playa de Argel. Eso es un hecho físico incuestionable que la misma defensa no se ha atrevido a refutar. Lo que verdaderamente convoca a este tribunal es el abismo moral que habita en su pecho.\n\nRecordemos su conducta durante el entierro de su propia madre, apenas dos días antes del homicidio. Los testigos fueron unánimes: no derramó una sola lágrima, fumó con indolencia junto al féretro, tomó café con leche como si asistiera a una merienda campestre y, para colmo de infamia, al día siguiente fue al cine a ver una película cómica y se enredó en una aventura amorosa con una mecanógrafa. Un hombre capaz de enterrar a quien le dio la vida con tal frialdad de autómata es, por necesidad ontológica, el mismo monstruo que dispara cinco veces contra un ser humano indefenso. Acusar al cuerpo de este hombre es secundario; lo que la sociedad exige es la extirpación de su alma desprovista de culpa.»\n\nEl acusado miró fijamente una mota de polvo que flotaba en el rayo de sol que entraba por el ventanal de la sala. Le pareció curioso que todos hablaran de él con tanto fervor, mientras a él mismo apenas le permitían hablar. Sentía una infinita fatiga física, y por un momento pensó que, en el fondo, lo condenaban no por el hombre que yacía muerto bajo el sol de la playa, sino por no haber llorado en el entierro de su madre.`,
    pregunta: '¿Cuál es la estrategia retórica fundamental que emplea el fiscal en su alegato para persuadir al jurado de condenar al acusado?',
    opciones: [
      'Presentar un conjunto exhaustivo de pruebas balísticas y peritajes criminalísticos que demuestran la premeditación y alevosía del disparo.',
      'Desplazar el foco del delito formal hacia un juicio sobre la moralidad del acusado, equiparando su falta de convencionalismo afectivo con una culpabilidad criminal monstruosa.',
      'Demostrar que el acusado pertenecía a una organización criminal clandestina que amenazaba la seguridad de los ciudadanos de Argel.',
      'Apelar a la clemencia y la misericordia religiosa para que el jurado perdone las flaquezas humanas del homicida.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'El fragmento (inspirado en "El extranjero" de Albert Camus) muestra cómo el fiscal explícitamente minimiza el hecho físico («no estamos aquí únicamente para determinar si accionó el arma») y centra todo su peso retórico en juzgar los sentimientos y el comportamiento social del protagonista durante el duelo de su madre («no derramó una sola lágrima», «fumar junto al féretro»). Construye así un argumento ad hominem moral para convencer al jurado de que alguien sin apego emocional convencional merece ser ejecutado.',
      aprendeEsto:
        'En los textos literarios o narrativos del ICFES, analiza cómo los personajes o narradores manipulan el lenguaje para crear una impresión ética. La retórica forense a menudo recurre a la indignación moral para encubrir la ausencia o debilidad de pruebas materiales directas.',
      errorFrecuente:
        'Marcar la opción A por asumir que un fiscal en un tribunal siempre usa pruebas balísticas, sin notar que el propio texto dice: «eso es un hecho físico... lo que convoca al tribunal es el abismo moral».',
      consejoIcfes:
        'Lee prestando atención a los contrastes entre lo que ocurre en el plano exterior (el juicio formal) y el monólogo interno del protagonista (su extrañeza y fatiga ante la pantomima judicial).',
    },
  },
  {
    id: 'lec-004',
    area: 'LECTURA_CRITICA',
    tema: 'Epistemología y Filosofía de la Ciencia',
    subtema: 'Falsacionismo, Demarcación Científica e Inducción',
    competencia: 'Reflexión y evaluación',
    dificultad: 'Avanzada',
    contexto: `Un científico que formula una teoría suele creer ingenuamente que su deber primordial consiste en acumular observaciones que verifiquen y confirmen su hipótesis. Si observa mil cisnes y todos son blancos, concluye con satisfacción que «todos los cisnes son blancos». No obstante, desde el punto de vista estrictamente lógico, ninguna cantidad finita de confirmaciones empíricas, por vasta que sea, puede jamás justificar de manera concluyente un enunciado universal. Bastará el avistamiento de un único cisne negro para derrumbar para siempre la pretendida ley universal que mil cisnes blancos creyeron erigir.\n\nPor esta razón, la verdadera marca distintiva del conocimiento científico no reside en la verificabilidad, sino en la falsabilidad. Una hipótesis que aspire a explicar el mundo real debe ser vulnerable; debe prohibir taxativamente ciertos estados de cosas en la naturaleza. Si una doctrina está formulada de tal manera que cualquier fenómeno imaginable, sin importar cuán contradictorio sea, puede ser interpretado como una prueba más a su favor, esa doctrina no es una ciencia, sino un dogma secular o un mito pseudocientífico disfrazado de sabiduría.\n\nLos grandes saltos del entendimiento humano no se producen cuando nos complacemos en reafirmar nuestras certidumbres, sino cuando una teoría audaz y precisa se estrella estrepitosamente contra un hecho imprevisto. El progreso científico es una sucesión ininterrumpida de conjeturas osadas y refutaciones severas: aprendemos de nuestros errores corrigiendo modelos que creíamos definitivos, y la verdad no es una posesión estática que se atesore en un pedestal, sino un horizonte regulativo inalcanzable hacia el cual nos aproximamos únicamente eliminando la falsedad.`,
    pregunta: 'A partir de los planteamientos del texto (basados en la epistemología de Karl Popper), ¿cuál de los siguientes criterios permite distinguir de manera inequívoca una teoría auténticamente científica de una pseudociencia?',
    opciones: [
      'El número de científicos de prestigio internacional que respaldan la hipótesis en revistas académicas indexadas.',
      'La capacidad intrínseca de la teoría de especificar con precisión qué hecho observable o experimento demostraría que está equivocada.',
      'La concordancia de la teoría con las intuiciones del sentido común y las tradiciones religiosas ancestrales.',
      'La imposibilidad absoluta de que cualquier experimento futuro pueda encontrar una sola falla en sus postulados.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'El segundo párrafo expone con claridad el criterio popperiano de demarcación: «la verdadera marca distintiva del conocimiento científico no reside en la verificabilidad, sino en la falsabilidad... debe prohibir taxativamente ciertos estados de cosas en la naturaleza». Una teoría científica legítima formula predicciones arriesgadas y establece de antemano qué evidencia empírica la refutaría. Si una teoría no puede ser sometida a prueba o pretende explicarlo todo a posteriori, carece de estatus científico.',
      aprendeEsto:
        'El problema de la inducción: Mil confirmaciones no prueban una regla universal, pero una sola refutación la destruye. La ciencia avanza por conjeturas y refutaciones (falsabilidad), no por dogmas blindados.',
      errorFrecuente:
        'Marcar la opción D («imposibilidad absoluta de encontrar fallas»), cometiendo exactamente el error contra el que advierte el texto: blindar una teoría contra el error la convierte en dogma, no en ciencia.',
      consejoIcfes:
        'En preguntas sobre filosofía de la ciencia en Lectura Crítica, analiza cuidadosamente las palabras clave como "falsabilidad", "refutación", "conjetura" y "verificación". El ICFES premia el rigor lógico frente al sentido común.',
    },
  },
  {
    id: 'lec-005',
    area: 'LECTURA_CRITICA',
    tema: 'Filosofía Política y Ética Contemporánea',
    subtema: 'La Banalidad del Mal y la Renuncia al Juicio Crítico',
    competencia: 'Comprensión y articulación',
    dificultad: 'Avanzada',
    contexto: `Al observar a Adolf Eichmann comparecer ante la corte de Jerusalén en 1961, los juristas y el público internacional esperaban contemplar el rostro visceral de un monstruo diabólico, una encarnación patológica del odio satánico y de la perversión premeditada. En su lugar, el tribunal se encontró ante un burócrata gris, mediocre y aterradoramente normal. Eichmann no padecía de trastornos psiquiátricos, no manifestaba una antipatía sanguinaria hacia sus víctimas y afirmaba con serenidad metódica que jamás había albergado intenciones malévolas: él se limitaba a «cumplir con su deber», a organizar con eficiencia logística los horarios de los trenes y a obedecer con lealtad las órdenes superiores emanadas de la ley del Estado.\n\nFue precisamente esta desconcertante normalidad lo que obligó a Hannah Arendt a acuñar el concepto de «la banalidad del mal». El mal más devastador y destructivo en la historia moderna no es perpetrado necesariamente por sádicos o psicópatas ideológicos, sino por personas corrientes que renuncian a la facultad más humana de todas: el ejercicio autónomo y reflexivo del pensamiento. Cuando un individuo decide delegar su conciencia moral en las directrices de un aparato burocrático, en un partido político o en el lema de una corporación, queda despojado de la capacidad de representarse el sufrimiento del prójimo.\n\nEl pensamiento crítico no es un adorno estético para intelectuales ociosos; es una salvaguarda ética de supervivencia ciudadana. Aquel que no dialoga consigo mismo en la soledad de su conciencia pierde la facultad de distinguir entre lo legal y lo justo. La burocracia despersonalizada y el lenguaje tecnocrático actúan como un anestésico moral: transforman a seres humanos de carne y hueso en «expedientes», «cifras presupuestales» o «daños colaterales», diluyendo la responsabilidad individual en un engranaje donde nadie se siente personalmente culpable de nada.`,
    pregunta: 'En el contexto del tercer párrafo, ¿qué función cumple la distinción entre «lo legal» y «lo justo» en la argumentación de la autora?',
    opciones: [
      'Demostrar que las leyes escritas por un Estado soberano son siempre perfectas y jamás deben ser cuestionadas por los subordinados.',
      'Sostener que la mera legalidad institucional de una orden no garantiza su validez moral, por lo que el ciudadano conserva siempre el deber inalienable de examinar críticamente sus acciones.',
      'Afirmar que los jueces de un tribunal internacional carecen de legitimidad para juzgar delitos cometidos en periodos de guerra.',
      'Proponer la supresión de todos los sistemas jurídicos y códigos penales para reemplazarlos por impulsos emocionales espontáneos.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'Arendt enfatiza que obedecer ciegamente la ley formal del Estado (como argumentaba Eichmann, cuya conducta se amparaba en decretos oficiales del Tercer Reich) no exime al ser humano de su responsabilidad ética. Distinguir entre lo legal y lo justo evidencia que una norma puede ser jurídicamente válida pero éticamente criminal. El pensamiento crítico es el único que permite al individuo resistir y desobedecer la injusticia institucionalizada.',
      aprendeEsto:
        'Iusnaturalismo ético vs. Positivismo jurídico extremo: Una ley positiva injusta no destruye la obligación moral de hacer el bien. La "banalidad del mal" ocurre cuando la burocracia y la obediencia ciega reemplazan el juicio moral propio.',
      errorFrecuente:
        'Elegir la opción A por una concepción autoritaria de la ley, o la opción D llevando la crítica a la legalidad a un anarquismo irracional que el texto no propone.',
      consejoIcfes:
        'Cuando el texto contrapone dos términos ("legal" vs. "justo", "instrucción" vs. "educación", "opinión" vs. "saber"), el foco de la pregunta suele ser el valor ético o conceptual superior que el autor defiende.',
    },
  },

  // =================================================================================================
  // 2. MATEMÁTICAS (Razonamiento Cuantitativo, Modelado, Estadística, Geometría y Probabilidad)
  // =================================================================================================
  {
    id: 'mat-001',
    area: 'MATEMATICAS',
    tema: 'Matemática Financiera y Rendimiento Compuesto',
    subtema: 'Descuentos Sucesivos, Interés Compuesto y Modelado Numérico',
    competencia: 'Formulación y ejecución',
    dificultad: 'Avanzada',
    contexto: `Una cooperativa de caficultores en Antioquia dispone de un fondo común de reserva de $60.000.000 COP para adquirir un sistema de secado solar tecnificado dentro de tres años. Para maximizar estos recursos mientras se cumplen los trámites de importación, la junta directiva evalúa cuatro alternativas de inversión financiera ofrecidas por entidades bancarias reguladas por la Superintendencia Financiera de Colombia:\n\n• Alternativa 1 (Interés Simple Fijo): Tasa fija del 12% anual en interés simple, sin costo de administración ni comisiones al vencimiento del plazo.\n• Alternativa 2 (Interés Compuesto Anual Escalonado): Tasa del 8% de interés compuesto en el año 1; 10% de interés compuesto en el año 2; y 12% de interés compuesto en el año 3, capitalizando intereses al término de cada vigencia anual.\n• Alternativa 3 (Tasa Plana de Interés Simple con Comisión Fija Inicial): Tasa del 15% anual en interés simple durante los tres años, pero deduciendo una comisión administrativa única de apertura equivalente a $6.000.000 COP del capital inicial antes de empezar a liquidar los rendimientos.\n• Alternativa 4 (Descuento y Retención en la Fuente): Tasa fija del 14% anual de interés simple, pero con una retención tributaria anual inmediata del 20% aplicada exclusivamente sobre los rendimientos o ganancias generadas en cada periodo.\n\nEl tesorero de la cooperativa afirma que la Alternativa 3 es la mejor de todas porque ofrece la tasa porcentual anual más alta (15%) y que superará a la Alternativa 1 en más de $3.000.000 COP de capital final.`,
    pregunta: 'Al realizar el cálculo financiero exacto del monto final acumulado (capital más rendimientos netos) al término de los tres años, ¿cuál es la mejor alternativa de inversión y cuál es la validez de la afirmación del tesorero?',
    opciones: [
      'La mejor es la Alternativa 2 ($80.000.000 COP) y la afirmación del tesorero es completamente cierta.',
      'La mejor es la Alternativa 1 ($81.600.000 COP) y la afirmación del tesorero es falsa, ya que la Alternativa 3 genera un monto final inferior ($78.300.000 COP) debido al impacto de la comisión administrativa inicial.',
      'La mejor es la Alternativa 3 ($92.000.000 COP) y el tesorero acertó en su pronóstico financiero.',
      'La Alternativa 4 es la más rentable porque el cobro de impuestos nunca afecta la tasa nominal pactada con el banco.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'Realicemos la liquidación matemática detallada de cada opción para un capital base C = $60.000.000 a n = 3 años:\n\n1. Alternativa 1 (Interés Simple 12%):\nRendimiento total = C * i * n = 60.000.000 * 0.12 * 3 = $21.600.000.\nMonto final = 60.000.000 + 21.600.000 = $81.600.000 COP.\n\n2. Alternativa 2 (Compuesto Escalonado 8%, 10%, 12%):\nAño 1: 60.000.000 * 1.08 = $64.800.000.\nAño 2: 64.800.000 * 1.10 = $71.280.000.\nAño 3: 71.280.000 * 1.12 = $79.833.600 COP.\n\n3. Alternativa 3 (Tasa 15% con comisión de $6.000.000):\nCapital neto invertido = 60.000.000 - 6.000.000 = $54.000.000.\nRendimientos a 3 años = 54.000.000 * 0.15 * 3 = $24.300.000.\nMonto final = 54.000.000 + 24.300.000 = $78.300.000 COP.\n\n4. Alternativa 4 (14% con retención del 20% sobre intereses):\nRendimiento neto = 60.000.000 * (0.14 * 0.80) * 3 = $20.160.000.\nMonto final = $80.160.000 COP.\n\nConclusión: La Alternativa 1 es la más rentable ($81.600.000 COP) y la afirmación del tesorero es falsa.',
      aprendeEsto:
        'En el razonamiento cuantitativo de Saber 11, nunca te dejes seducir únicamente por el porcentaje más alto. Una comisión fija inicial o una retención periódica impacta drásticamente la tasa efectiva final. Siempre calcula la base sobre la que se aplica el interés.',
      errorFrecuente:
        'Calcular el 15% de la Alternativa 3 sobre los $60.000.000 originales y luego restar los 6 millones al final ($60M + 27M - 6M = 81M$), olvidando que la comisión se descuenta antes de iniciar la inversión, por lo que los intereses solo se liquidan sobre los $54.000.000 netos.',
      consejoIcfes:
        'Cuando el ICFES te presente afirmaciones de personajes ("El tesorero afirma que..."), resuelve primero las operaciones aritméticas por tu cuenta y luego califica la afirmación como verdadera o falsa con el soporte numérico hallado.',
    },
  },
  {
    id: 'mat-002',
    area: 'MATEMATICAS',
    tema: 'Estadística Descriptiva y Probabilidad Condicional',
    subtema: 'Tablas de Frecuencia Bidimensionales y Falsos Positivos',
    competencia: 'Interpretación y representación',
    dificultad: 'Avanzada',
    contexto: `Un laboratorio de salud pública en Colombia realizó una prueba epidemiológica masiva a una población de 10.000 personas en una región selvática para diagnosticar una cepa emergente de leishmaniasis. El estudio comparó los resultados de una prueba rápida de antígenos contra el estándar de oro (prueba molecular PCR confirmada en laboratorio central).\n\nLos datos consolidados de la investigación revelaron la siguiente matriz estadística:\n\n• Prevalencia real de la enfermedad: De las 10.000 personas evaluadas, exactamente 200 personas están verdaderamente infectadas según la PCR.\n• Sensibilidad de la prueba rápida: Del total de personas enfermas (200), la prueba rápida dio resultado «Positivo» en 190 pacientes, arrojando resultado «Negativo» (falso negativo) en 10 pacientes.\n• Especificidad de la prueba rápida: De las 9.800 personas verdaderamente sanas, la prueba dio resultado «Negativo» en 9.310 pacientes, pero dio resultado «Positivo» (falso positivo) en 490 personas sanas.\n\nUn habitante de la zona acude al centro de salud local, se realiza la prueba rápida y el médico de guardia le informa que su resultado salió «Positivo». El paciente entra en pánico asumiendo que tiene más de un 95% de probabilidad de estar irremediablemente enfermo.`,
    pregunta: 'Teniendo en cuenta la tabla de frecuencias de la población evaluada, ¿cuál es la probabilidad real aproximada de que este paciente esté verdaderamente infectado dado que su prueba arrojó resultado positivo?',
    opciones: [
      'Aproximadamente 95.0%, pues la sensibilidad de la prueba rápida es de 190 sobre 200.',
      'Aproximadamente 27.9%, puesto que de las 680 personas que dieron resultado positivo en total, solo 190 están verdaderamente enfermas.',
      'Exactamente 2.0%, que equivale a la prevalencia global de la infección en la población entera.',
      'Aproximadamente 50.0%, ya que ante cualquier prueba diagnóstica solo existen dos estados posibles: sano o enfermo.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'Este es el clásico problema de probabilidad condicional y Teorema de Bayes frecuentemente evaluado en el ICFES:\n\n1. ¿Cuántas personas obtuvieron un resultado «Positivo» en total en toda la población?\n   - Verdaderos Positivos (enfermos con prueba positiva) = 190\n   - Falsos Positivos (sanos con prueba positiva) = 490\n   - Total de positivos = 190 + 490 = 680 personas.\n\n2. De todas esas 680 personas que recibieron un resultado positivo, ¿cuántas están realmente enfermas?\n   - Exactamente 190 personas.\n\n3. Probabilidad condicionada:\n   P(Enfermo | Positivo) = Verdaderos Positivos / Total Positivos = 190 / 680 = 19 / 68 ≈ 0.2794 = 27.94%.\n\nPor tanto, a pesar de que la prueba tiene una alta sensibilidad (95%), debido a que la enfermedad es rara en la población (baja prevalencia del 2%), más del 70% de las personas que marcan positivo son en realidad falsos positivos sanos.',
      aprendeEsto:
        'La probabilidad de que la prueba dé positivo si estás enfermo (Sensibilidad) NO es lo mismo que la probabilidad de que estés enfermo si la prueba dio positivo (Valor Predictivo Positivo). El espacio muestral condicionado se restringe únicamente al subconjunto de los resultados positivos (680).',
      errorFrecuente:
        'Marcar la opción A (95%) confundiendo la sensibilidad de la prueba con la probabilidad real del paciente, o la opción D asumiendo que al haber dos opciones la probabilidad es del 50%.',
      consejoIcfes:
        'Construye mentalmente o en tu hoja de operaciones una cuadrícula de 2 x 2 sumando los totales por fila y por columna. La probabilidad condicional P(A | B) siempre divide los casos favorables entre el total de la condición B.',
    },
  },
  {
    id: 'mat-003',
    area: 'MATEMATICAS',
    tema: 'Geometría Espacial y Optimización',
    subtema: 'Cálculo de Volúmenes, Áreas Superficiales y Proporciones Cúbicas',
    competencia: 'Formulación y ejecución',
    dificultad: 'Media',
    contexto: `Una empresa de lácteos en Cundinamarca distribuye leche pasteurizada en envases tipo tetrabrik con forma de prisma rectangular recto cuyas dimensiones interiores son: base cuadrada de lado L = 10 cm y altura H = 20 cm. El volumen del envase es exactamente de V = 10 x 10 x 20 = 2.000 cm³ (equivalente a 2 litros de capacidad).\n\nEl departamento de diseño y sostenibilidad propone cambiar el diseño del envase por uno cúbico perfecto (arista a) que almacene exactamente el mismo volumen de 2 litros (2.000 cm³), o bien ensanchar el envase original duplicando el lado de la base cuadrada (L' = 20 cm) reduciendo la altura a la mitad (H' = 10 cm).\n\nEl gerente de producción afirma que duplicar la base y partir la altura a la mitad mantendrá exactamente la misma cantidad de cartón y aluminio requerida para fabricar la superficie exterior del envase, por lo que el costo unitario de empaque no sufrirá variación alguna.`,
    pregunta: 'Al comparar el área superficial total del envase original frente al nuevo envase de base ensanchada (L\' = 20 cm, H\' = 10 cm), ¿cuál de las siguientes conclusiones es matemáticamente correcta?',
    opciones: [
      'La afirmación del gerente es cierta, pues el área superficial exterior de ambos envases es idéntica (1.000 cm²).',
      'La afirmación del gerente es falsa; el nuevo envase ensanchado requiere 1.600 cm² de material, mientras que el envase original solo requiere 1.000 cm², aumentando el consumo de cartón en un 60%.',
      'El nuevo envase ensanchado tiene menor volumen que el original, por lo que no puede almacenar los 2 litros de leche.',
      'El área superficial de un prisma rectangular depende únicamente de su volumen y no de las proporciones de sus dimensiones geométricas.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'Calculemos el área superficial total (las 6 caras: 2 tapas cuadradas + 4 caras laterales rectangulares) para ambos recipientes:\n\n1. Envase Original (L = 10 cm, H = 20 cm):\n   - Área de las 2 bases cuadradas = 2 x (10 x 10) = 2 x 100 = 200 cm².\n   - Área de las 4 caras laterales = 4 x (10 x 20) = 4 x 200 = 800 cm².\n   - Área superficial total original = 200 + 800 = 1.000 cm².\n   - Volumen = 10 x 10 x 20 = 2.000 cm³.\n\n2. Envase Ensanchado (L\' = 20 cm, H\' = 10 cm):\n   - Área de las 2 bases cuadradas = 2 x (20 x 20) = 2 x 400 = 800 cm².\n   - Área de las 4 caras laterales = 4 x (20 x 10) = 4 x 200 = 800 cm².\n   - Área superficial total nueva = 800 + 800 = 1.600 cm².\n   - Volumen = 20 x 20 x 10 = 2.000 cm³.\n\nConclusión: Aunque ambos recipientes albergan exactamente el mismo volumen (2.000 cm³), el envase ensanchado exige 1.600 cm² frente a 1.000 cm² del original (un incremento del 60% en material). La afirmación del gerente es falsa.',
      aprendeEsto:
        'Cuerpos geométricos tridimensionales con idéntico volumen pueden tener áreas superficiales drásticamente distintas. En empaques industriales, cuanto más se aleje un prisma de proporciones compactas óptimas, mayor será el gasto de material por unidad de volumen almacenado.',
      errorFrecuente:
        'Asumir intuitivamente que si el volumen se conserva (2.000 cm³), la superficie de material debe ser la misma. Duplicar la base cuadruplica el área de las tapas (L²), lo cual dispara el área total.',
      consejoIcfes:
        'Desglosa siempre el área superficial en componentes: tapas superior e inferior (2L²) + perímetro de la base por la altura (4LH).',
    },
  },
  {
    id: 'mat-004',
    area: 'MATEMATICAS',
    tema: 'Funciones y Razón de Cambio',
    subtema: 'Vaciado de Tanques, Geometría Cónica y Análisis Gráfico de Velocidad',
    competencia: 'Interpretación y representación',
    dificultad: 'Avanzada',
    contexto: `Un tanque de almacenamiento de agua en una finca cafetera tiene la forma de un cono invertido perfecto (con el vértice apuntando directamente hacia el suelo). La altura total del cono es de H = 6 metros y el radio superior de la base es de R = 3 metros. El tanque se encuentra completamente lleno de agua en el instante inicial t = 0.\n\nPara regar un cultivo por gravedad, se abre una válvula en el orificio inferior del vértice. De acuerdo con la Ley de Torricelli y la hidrodinámica de fluidos, el caudal de salida es proporcional a la raíz cuadrada de la altura instantánea del líquido: Q(t) = k * sqrt(h(t)). A medida que el agua escapa, la altura h(t) del líquido desciende paulatinamente desde 6 metros hasta 0 metros.\n\nUn grupo de estudiantes de ingeniería monitorea con un sensor ultrasónico la rapidez con la que baja el nivel del agua (-dh/dt) en función del tiempo transcurrido.`,
    pregunta: 'Considerando que el radio de la superficie libre del agua disminuye a medida que baja el nivel (r(h) = h/2), ¿cómo se comporta la velocidad con la que baja la altura del agua (-dh/dt) durante el proceso de vaciado?',
    opciones: [
      'Permanece estrictamente constante desde el inicio hasta el final, trazando una línea horizontal en la gráfica de velocidad vs. tiempo.',
      'Aumenta continuamente a medida que el tanque se vacía, alcanzando su máxima velocidad de descenso justo antes de vaciarse por completo, porque la sección transversal del cono se estrecha hacia el vértice mucho más rápido de lo que disminuye el caudal.',
      'Disminuye linealmente hacia cero, porque la presión hidrostática en el fondo se reduce y hace que el nivel baje cada vez más despacio.',
      'Es nula al inicio, luego oscila periódicamente y finalmente se vuelve negativa cuando el tanque se llena solo.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'Apliquemos el principio de conservación de masa: Caudal Q = Área transversal * velocidad de descenso (-dh/dt).\n1. En un cono invertido, por triángulos semejantes: r/h = R/H = 3/6 = 1/2 => r = h/2.\n2. El área de la superficie circular libre del agua es A(h) = pi * r² = pi * (h/2)² = (pi/4) * h².\n3. Por Torricelli, el caudal de salida es Q = k * sqrt(h).\n4. Igualando: A(h) * (-dh/dt) = k * sqrt(h) => (-dh/dt) = [k * sqrt(h)] / [(pi/4) * h²] = C / h^(3/2).\n\nConclusión matemática: A medida que el tanque se vacía (cuando h tiende a 0), el denominador h^(3/2) se hace diminuto, lo que hace que la velocidad de descenso (-dh/dt) tienda a infinito (aumente drásticamente). Aunque sale menos volumen de agua por segundo, el cono es tan angosto en el fondo que el nivel desciende a una velocidad vertiginosa.',
      aprendeEsto:
        'Caudal volumétrico (m³/s) no es lo mismo que velocidad de descenso de la altura (m/s). En recipientes cónicos invertidos o piramidales, la reducción del área superficial compensa con creces la pérdida de presión hidrostática.',
      errorFrecuente:
        'Marcar la opción C pensando únicamente en que "a menor altura, menor caudal", olvidando que el área del cono disminuye con el cuadrado de la altura (h²), por lo que el nivel cae mucho más rápido.',
      consejoIcfes:
        'En preguntas con gráficas de llenado o vaciado de recipientes no cilíndricos (esferas, conos, embudos), recuerda siempre: a sección más estrecha, mayor rapidez de cambio de la altura.',
    },
  },
  {
    id: 'mat-005',
    area: 'MATEMATICAS',
    tema: 'Combinatoria y Principio Multiplicativo',
    subtema: 'Permutaciones con Restricciones y Probabilidad de Eventos Compuestos',
    competencia: 'Formulación y ejecución',
    dificultad: 'Avanzada',
    contexto: `Un sistema bancario de alta seguridad en Bogotá genera claves maestras temporales para autorizar transferencias internacionales. Cada clave maestra debe cumplir estrictamente con los siguientes protocolos criptográficos:\n\n1. Longitud exacta: Cada clave está compuesta por una secuencia de 5 caracteres distintos (sin repetición).\n2. Estructura de caracteres: Los primeros 3 caracteres deben ser letras mayúsculas elegidas del conjunto de las 5 vocales {A, E, I, O, U}.\n3. Bloque numérico: Los últimos 2 caracteres deben ser dígitos impares elegidos del conjunto {1, 3, 5, 7, 9}.\n4. Restricción de seguridad adicional: La clave NO puede iniciar con la vocal 'A' ni terminar con el dígito '9'.\n\nEl ingeniero de ciberseguridad debe calcular el número total de claves válidas posibles que se pueden generar bajo este protocolo para estimar la resistencia del sistema frente a ataques informáticos de fuerza bruta.`,
    pregunta: '¿Cuál es el número total de claves maestras distintas que cumplen simultáneamente con todas las condiciones y restricciones del protocolo?',
    opciones: [
      '960 claves válidas',
      '768 claves válidas',
      '1.200 claves válidas',
      '2.400 claves válidas',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'Apliquemos el Principio Multiplicativo por casillas considerando las restricciones impuestas:\n\n1. **Parte 1: Las 3 letras (posiciones 1, 2 y 3) de entre {A, E, I, O, U} (5 vocales en total):**\n   - Posición 1: No puede ser \'A\'. Quedan 4 opciones posibles {E, I, O, U}.\n   - Posición 2: Puede ser cualquier vocal de las 5, excepto la ya usada en la posición 1. Quedan (5 - 1) = 4 opciones (aquí \'A\' ya vuelve a ser válida).\n   - Posición 3: Quedan (5 - 2) = 3 opciones de vocales restantes.\n   - Total de combinaciones para las letras = 4 * 4 * 3 = 48 secuencias de letras.\n\n2. **Parte 2: Los 2 dígitos impares (posiciones 4 y 5) de entre {1, 3, 5, 7, 9} (5 dígitos impares en total):**\n   - Posición 5 (última): No puede ser \'9\'. Quedan 4 opciones posibles {1, 3, 5, 7}.\n   - Posición 4: Puede ser cualquier dígito impar excepto el ya usado en la posición 5. Quedan (5 - 1) = 4 opciones (aquí \'9\' ya vuelve a ser válido).\n   - Total de combinaciones para los dígitos = 4 * 4 = 16 pares de dígitos.\n\n3. **Total de claves maestras válidas:**\n   Total = (Combinaciones de letras) * (Combinaciones de dígitos) = 48 * 16 = 768 claves.',
      aprendeEsto:
        'En problemas de combinatoria con restricciones, ubica siempre primero las posiciones condicionadas (en este caso, la posición 1 y la posición 5). Luego completa las casillas intermedias restando los elementos ya asignados.',
      errorFrecuente:
        'Calcular sin restricciones (5*4*3 = 60 y 5*4 = 20 => 60*20 = 1.200) y simplemente restar 240 de forma imprecisa, o asumir erróneamente que la exclusión de la \'A\' aplica a las 3 posiciones de letras.',
      consejoIcfes:
        'Dibuja casillas en tu borrador: [_] [_] [_] - [_] [_]. Escribe debajo de cada una cuántas opciones reales quedan disponibles tras aplicar la condición de no repetición.',
    },
  },

  // =================================================================================================
  // 3. CIENCIAS NATURALES (Investigación Experimental, Bioquímica, Física Mecánica y Genética)
  // =================================================================================================
  {
    id: 'cie-001',
    area: 'CIENCIAS_NATURALES',
    tema: 'Cinética Enzimática y Fisiología Celular',
    subtema: 'Diseño Experimental, Hipótesis y Variables de Control',
    competencia: 'Indagación',
    dificultad: 'Avanzada',
    contexto: `Un equipo de bioquímicos en una universidad colombiana desea evaluar el efecto de la temperatura y de iones de metales pesados sobre la actividad catalítica de la enzima catalasa, la cual descompone el peróxido de hidrógeno (2H2O2 -> 2H2O + O2) protegiendo a las células hepáticas del estrés oxidativo.\n\nPara el montaje experimental, los investigadores extrajeron extracto enzimático estandarizado de hígado de bovino y diseñaron cuatro grupos de ensayo en tubos de ensayo graduados, conteniendo cada uno 10 mL de solución tamponada a pH 7.0 constante. A cada tubo se le adicionaron 5 mL de H2O2 al 3% bajo las siguientes condiciones controladas durante 3 minutos:\n\n• Tubo 1 (Control Negativo): Extracto enzimático sometido previamente a ebullición (100°C por 15 min), ensayado a 37°C. Volumen de O2 liberado medido en probeta: 0.0 mL.\n• Tubo 2 (Control Fisiológico): Extracto enzimático intacto ensayado a 37°C sin aditivos. Volumen de O2 liberado: 48.5 mL.\n• Tubo 3 (Tratamiento Térmico Bajo): Extracto enzimático intacto incubado y ensayado a 4°C en baño de hielo. Volumen de O2 liberado: 8.2 mL.\n• Tubo 4 (Tratamiento con Iones de Plomo): Extracto enzimático ensayado a 37°C al que se le añadieron 2 mL de solución de nitrato de plomo (Pb(NO3)2 a 0.1 M). Volumen de O2 liberado: 2.1 mL.\n\nPosteriormente, al Tubo 3 se le restableció la temperatura a 37°C y la producción de gas se reactivó alcanzando 47.8 mL en 3 minutos. En cambio, al intentar diluir el plomo del Tubo 4, la enzima continuó prácticamente inactiva.`,
    pregunta: 'Con base en los resultados descritos en el experimento, ¿cuál de las siguientes conclusiones bioquímicas es la más coherente respecto a los mecanismos que alteran la función de la catalasa?',
    opciones: [
      'Tanto la baja temperatura (4°C) como la ebullición (100°C) provocan la desnaturalización irreversible de la estructura terciaria de la catalasa.',
      'Los iones de plomo actúan como un inhibidor irreversible o desnaturalizante de la enzima, mientras que la baja temperatura disminuye transitoriamente la energía cinética molecular sin destruir el sitio activo.',
      'La catalasa no requiere de una estructura proteica tridimensional para catalizar la descomposición del peróxido de hidrógeno, ya que la temperatura no altera su velocidad de reacción.',
      'El pH fue la variable independiente manipulada en el experimento que determinó que el Tubo 4 no produjera oxígeno molecular.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'El experimento demuestra que a 4°C la enzima reduce su actividad (8.2 mL de gas) debido a la baja energía cinética y menor frecuencia de colisiones enzima-sustrato, pero al restablecer la temperatura a 37°C recuperó casi el 100% de su actividad (47.8 mL), lo que prueba que el frío no rompe los enlaces que mantienen la conformación activa. Por el contrario, el plomo en el Tubo 4 bloqueó la enzima de forma permanente, comportándose como un inhibidor no competitivo o agente tóxico que inutiliza irreversiblemente el sitio activo.',
      aprendeEsto:
        'Desnaturalización irreversible (calor extremo a 100°C o metales pesados que alteran puentes disulfuro) vs. Disminución de energía cinética reversible (bajas temperaturas). La ebullición rompe enlaces de hidrógeno y desdobla la proteína; el frío solo ralentiza el movimiento térmico de las moléculas.',
      errorFrecuente:
        'Elegir la opción A creyendo que el frío desnaturaliza las enzimas al igual que el calor. Si la baja temperatura desnaturalizara, no se habría reactivado al volver a 37°C.',
      consejoIcfes:
        'En preguntas experimentales del ICFES, identifica siempre los controles: el Tubo 1 demuestra que la proteína hervida no funciona; el Tubo 2 establece la línea base esperada en condiciones fisiológicas.',
    },
  },
  {
    id: 'cie-002',
    area: 'CIENCIAS_NATURALES',
    tema: 'Ecología y Dinámica de Poblaciones',
    subtema: 'Bioacumulación, Redes Tróficas y Magnificación Ecológica',
    competencia: 'Explicación de fenómenos',
    dificultad: 'Media',
    contexto: `En una cuenca hidrográfica del Pacífico colombiano se detectó un vertimiento continuo de mercurio metálico (Hg) proveniente de actividades de minería ilegal de aluvión. Las bacterias anaerobias sulfato-reductoras de los sedimentos del fondo del río transforman el mercurio inorgánico en metilmercurio (CH3Hg+), un compuesto liposoluble de altísima toxicidad que atraviesa con facilidad las membranas celulares y no es biodegradable ni excretable por los organismos vivos.\n\nUn grupo de biólogos marinos tomó muestras en cuatro niveles tróficos del ecosistema fluvial y cuantificó la concentración media de metilmercurio en los tejidos (expresada en partes por millón, ppm), registrando los siguientes datos en su informe técnico:\n\n1. Fitoplancton y microalgas fotosintéticas (Productores primarios): 0.05 ppm.\n2. Zooplancton y pequeños invertebrados filtradores (Consumidores primarios): 0.40 ppm.\n3. Peces omnívoros de porte medio (Consumidores secundarios, ej. bocachico): 2.80 ppm.\n4. Aves pescadoras de gran tamaño y nutrias de río (Consumidores terciarios / Depredadores tope): 38.50 ppm.\n\nAsimismo, se encontró que en el agua superficial del río la concentración de mercurio libre era casi imperceptible (menor a 0.001 ppm), lo cual llevó a una empresa minera a afirmar en una audiencia ambiental que el río no sufría ningún tipo de contaminación peligrosa.`,
    pregunta: 'Desde el punto de vista ecológico y toxicológico, ¿por qué el argumento de la empresa minera es científicamente erróneo para evaluar el riesgo del ecosistema?',
    opciones: [
      'Porque el metilmercurio se evapora a la atmósfera inmediatamente después de caer al río, por lo que el agua superficial nunca refleja la toxicidad del aire.',
      'Porque el fenómeno de biomagnificación trófica hace que una concentración mínima e indetectable en el agua se multiplique progresivamente en cada eslabón de la cadena alimentaria, alcanzando niveles letales en los depredadores tope.',
      'Porque los productores primarios eliminan completamente el mercurio mediante la fotosíntesis, impidiendo que llegue a los seres humanos.',
      'Porque el mercurio solo contamina los sedimentos minerales pero es completamente inocuo para los animales de sangre caliente como aves y mamíferos.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'El fenómeno descrito es la biomagnificación ecológica. Aunque la concentración en el agua sea de apenas 0.001 ppm, las microalgas la absorben sin degradarla. Cada consumidor primario ingiere miles de microalgas, cada pez consume miles de zooplancton y los depredadores tope ingieren cientos de peces. Como el metilmercurio es liposoluble y no se excreta, su concentración se magnifica exponencialmente hasta alcanzar 38.50 ppm (casi 40.000 veces la concentración del agua). Medir solo el agua superficial es una falacia metodológica que ignora la dinámica trófica.',
      aprendeEsto:
        'Bioacumulación es la acumulación de una sustancia tóxica en un individuo a lo largo de su vida. Biomagnificación es el incremento de la concentración de esa sustancia a medida que se asciende en los niveles tróficos de una red alimentaria.',
      errorFrecuente:
        'Confundir dilución física con inocuidad biológica. Muchos estudiantes asumen que si un contaminante no se detecta en el agua, el ecosistema está a salvo, olvidando el principio de transferencia trófica de xenobióticos persistentes.',
      consejoIcfes:
        'En preguntas sobre redes tróficas con sustancias tóxicas (mercurio, plomo, pesticidas organoclorados como el DDT), el eslabón más vulnerable siempre es el depredador tope (nivel trófico superior).',
    },
  },
  {
    id: 'cie-003',
    area: 'CIENCIAS_NATURALES',
    tema: 'Mecánica Clásica y Conservación de la Energía',
    subtema: 'Transformación de Energía Cinética, Potencial y Trabajo de Fricción',
    competencia: 'Uso comprensivo del conocimiento científico',
    dificultad: 'Media',
    contexto: `Un carro de pruebas de masa m = 2.0 kg parte del reposo desde la cúspide de una rampa sin rozamiento ubicada a una altura h1 = 5.0 m sobre el suelo. En ese tramo curvo descendente, la fuerza de fricción con el aire y la superficie es despreciable. Al llegar a la base horizontal (h = 0 m), el carro ingresa a un tramo rugoso de longitud L = 8.0 m, donde el coeficiente de fricción cinético entre las ruedas bloqueadas y el pavimento es uk = 0.25.\n\nInmediatamente después del tramo rugoso, el vehículo choca de frente contra un resorte horizontal ideal de constante elástica k = 400 N/m, fijado rígidamente a una pared en el otro extremo. Considere la aceleración de la gravedad como g = 10 m/s².\n\nLos ingenieros monitorean la energía mecánica del sistema a través de sensores optoelectrónicos instalados a lo largo de la pista para corroborar el Teorema del Trabajo y la Energía: E_mecánica_inicial + W_fricción = E_mecánica_final.`,
    pregunta: '¿Cuál es la compresión máxima que experimenta el resorte al detener momentáneamente el carro tras atravesar el tramo rugoso?',
    opciones: [
      '0.35 metros',
      '0.55 metros',
      '0.75 metros',
      '1.00 metro',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'Analicemos el balance energético paso a paso:\n1. Energía potencial gravitacional en la cúspide: Ep = m * g * h1 = (2.0 kg)(10 m/s²)(5.0 m) = 100 Joules.\n2. Fuerza de fricción en el tramo horizontal rugoso: fk = uk * N = uk * m * g = (0.25)(2.0)(10) = 5.0 Newtons.\n3. Trabajo disipado por la fricción: W_friccion = fk * L = (5.0 N)(8.0 m) = 40 Joules disipados en forma de calor.\n4. Energía mecánica remanente al llegar al resorte: 100 J - 40 J = 60 Joules.\n5. En la máxima compresión x, toda la energía remanente se almacena como energía potencial elástica: E_elástica = (1/2) * k * x² = 60 J => (1/2)(400)x² = 60 => 200 x² = 60 => x² = 60/200 = 0.30 => x = sqrt(0.30) ≈ 0.5477 m ≈ 0.55 m.',
      aprendeEsto:
        'Principio de conservación de la energía no conservativa: La energía mecánica inicial se transforma en trabajo disipativo contra la fricción más la energía elástica final. No intentes calcular aceleraciones con cinemática cuando las ecuaciones de energía resuelven el problema en 2 líneas.',
      errorFrecuente:
        'Olvidar restar el trabajo de la fricción (40 J) e igualar directamente los 100 J iniciales con (1/2) k x², lo cual daría x = sqrt(0.50) ≈ 0.71 m.',
      consejoIcfes:
        'En los problemas de física de Saber 11, haz siempre un inventario de entradas y pérdidas energéticas: E_inicial - Pérdidas = E_final.',
    },
  },
  {
    id: 'cie-004',
    area: 'CIENCIAS_NATURALES',
    tema: 'Química Inorgánica y Estequiometría de Gases',
    subtema: 'Reactivo Límite, Rendimiento Porcentual y Presiones Parciales',
    competencia: 'Explicación de fenómenos',
    dificultad: 'Avanzada',
    contexto: `En un reactor cerrado de volumen constante V = 10.0 Litros mantenido a una temperatura de 300 Kelvin, se introducen 2.0 moles de gas propano (C3H8) y 8.0 moles de gas oxígeno puro (O2). Se produce una chispa eléctrica que desencadena la combustión completa del hidrocarburo según la ecuación estequiométrica balanceada:\n\nC3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(g)\n\nUna vez finalizada la reacción y enfriado el sistema nuevamente a 300 Kelvin, el agua condensó por completo en fase líquida ocupando un volumen insignificante, de modo que en la fase gaseosa únicamente coexisten el dióxido de carbono producido (CO2) y el reactivo en exceso que no alcanzó a reaccionar. Considere la constante universal de los gases ideales como R = 0.082 (atm*L)/(mol*K).`,
    pregunta: '¿Cuál es el reactivo límite de la reacción y cuál es la presión parcial ejercida por el dióxido de carbono (CO2) en el reactor cerrado?',
    opciones: [
      'El reactivo límite es el C3H8 y la presión parcial de CO2 es de 14.76 atmósferas.',
      'El reactivo límite es el O2 y la presión parcial de CO2 es de 11.81 atmósferas.',
      'El reactivo límite es el O2 y la presión parcial de CO2 es de 24.60 atmósferas.',
      'No existe reactivo límite porque ambos reactivos se encontraban exactamente en proporciones estequiométricas.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'Resolvamos la estequiometría paso a paso:\n1. Proporción estequiométrica: 1 mol de C3H8 requiere 5 moles de O2.\n2. Con los 2.0 moles de C3H8 se requerirían: 2.0 * 5 = 10.0 moles de O2.\n3. Sin embargo, solo disponemos de 8.0 moles de O2. Por lo tanto, el Oxígeno (O2) es el reactivo límite, ya que se agotará primero.\n4. Moles de CO2 producidas por el reactivo límite:\n   (8.0 moles O2) * (3 moles CO2 / 5 moles O2) = 24 / 5 = 4.8 moles de CO2.\n5. Presión parcial del CO2 usando la Ley de Gases Ideales (P = n * R * T / V):\n   P(CO2) = (4.8 moles * 0.082 atm*L/(mol*K) * 300 K) / 10.0 L = 118.08 / 10 = 11.808 atm ≈ 11.81 atmósferas.',
      aprendeEsto:
        'El reactivo límite es aquel que produce la menor cantidad teórica de producto, NO necesariamente el que tiene menor número de moles iniciales. Toda la estequiometría posterior debe calcularse a partir del reactivo límite.',
      errorFrecuente:
        'Elegir la opción A asumiendo que como hay 2 moles de C3H8 y 8 moles de O2, el propano es el límite por haber menos número de moles, ignorando el coeficiente 5 de la ecuación balanceada.',
      consejoIcfes:
        'Divide siempre las moles dadas entre su coeficiente estequiométrico: Para C3H8: 2/1 = 2. Para O2: 8/5 = 1.6. El menor cociente (1.6) indica de inmediato cuál es el reactivo límite.',
    },
  },
  {
    id: 'cie-005',
    area: 'CIENCIAS_NATURALES',
    tema: 'Genética Molecular y Biología Celular',
    subtema: 'Mutaciones Puntuales, Código Genético y Electroforesis de ADN',
    competencia: 'Uso comprensivo del conocimiento científico',
    dificultad: 'Avanzada',
    contexto: `La distrofia muscular de Duchenne es una enfermedad hereditaria recesiva ligada al cromosoma X caracterizada por una degeneración muscular progresiva. Se produce por alteraciones en el gen que codifica para la distrofina, una proteína estructural gigante indispensable para conectar el citoesqueleto de actina con la matriz extracelular de las fibras musculares.\n\nEn un laboratorio de genética molecular se analizan muestras de tejido muscular de tres pacientes pediátricos y se secuencian fragmentos de ARNm maduro en el exón 19:\n\n• Sujeto Control Sano: ... UUU - GGA - UAC - CAG - AAA ... (Secuencia peptídica: Fenilalanina - Glicina - Tirosina - Glutamina - Lisina)\n• Paciente 1: ... UUU - GGA - UAG - CAG - AAA ... (Presenta una sustitución de Citosina por Guanina en el tercer codón)\n• Paciente 2: ... UUU - GAU - ACC - AGA - AA... (Presenta una deleción de un solo nucleótido de Guanina en el codón 2)\n\nConsidere la tabla del código genético universal: UAC codifica para Tirosina; mientras que UAG, UAA y UGA son codones de parada prematura (codones Stop) que provocan la terminación inmediata de la traducción proteica en los ribosomas.`,
    pregunta: 'Con base en las secuencias genéticas expuestas, ¿cuál de las siguientes afirmaciones predice con exactitud el impacto biológico sobre la proteína distrofina en los pacientes 1 y 2?',
    opciones: [
      'El Paciente 1 producirá una proteína distrofina completamente normal porque las mutaciones de un solo nucleótido nunca alteran la conformación celular.',
      'El Paciente 1 sufrirá una mutación sin sentido (nonsense) que trunca prematuramente la síntesis de la distrofina, mientras que el Paciente 2 experimentará un corrimiento del marco de lectura (frameshift) que altera todos los aminoácidos posteriores.',
      'Tanto el Paciente 1 como el Paciente 2 tendrán proteínas más largas que el sujeto control con una mayor resistencia muscular.',
      'La mutación del Paciente 2 es silenciosa porque las deleciones de nucleótidos son reparadas de inmediato por los ribosomas durante la traducción.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'Analicemos cada caso genético:\n1. En el Paciente 1, el codón original UAC (Tirosina) mutó a UAG. Como UAG es un codón de terminación o parada (Stop), la traducción se detiene bruscamente en ese punto. Esto se denomina una mutación sin sentido (nonsense mutation), produciendo una proteína trunca, incompleta y no funcional.\n2. En el Paciente 2, la eliminación de una base (deleción de G) rompe los tripletes de lectura subsecuentes (frameshift mutation). Todos los codones a partir del punto de deleción cambian de significado, modificando por completo la secuencia de aminoácidos y generando casi con certeza un codón stop errático río abajo.',
      aprendeEsto:
        'Clasificación de mutaciones puntuales:\n• Silenciosa (Synonymous): No cambia el aminoácido.\n• Con cambio de sentido (Missense): Cambia un aminoácido por otro.\n• Sin sentido (Nonsense): Genera un codón de parada (Stop) prematuro.\n• Corrimiento de lectura (Frameshift): Inserción o deleción no múltiplo de 3.',
      errorFrecuente:
        'Confundir una mutación sin sentido (que genera un codón Stop) con una mutación silenciosa (que no cambia el aminoácido). Si aparece UAG, UAA o UGA, la traducción cesa.',
      consejoIcfes:
        'En preguntas sobre genética molecular del ICFES, verifica si la mutación altera el marco de lectura en grupos de 3 bases o si introduce una señal de terminación ribosómica.',
    },
  },

  // =================================================================================================
  // 4. SOCIALES Y CIUDADANAS (Constitución Política, Conflictos, Derechos y Pensamiento Social)
  // =================================================================================================
  {
    id: 'soc-001',
    area: 'SOCIALES_CIUDADANAS',
    tema: 'Constitución Política y Derechos Colectivos',
    subtema: 'Choque de Derechos Fundamentales y Consulta Previa',
    competencia: 'Multiperspectivismo y Pensamiento social',
    dificultad: 'Avanzada',
    contexto: `En el departamento de La Guajira, el Gobierno Nacional y un consorcio internacional aprobaron la construcción de un megaparque eólico de 450 MW para acelerar la transición energética del país y reducir las emisiones de gases de efecto invernadero conforme a los compromisos del Acuerdo de París. El proyecto contempla el levantamiento de 85 aerogeneradores gigantes y una línea de transmisión de alta tensión que atraviesa territorios ancestrales pertenecientes a seis clanes de la comunidad indígena Wayúu.\n\nLos voceros del Ministerio de Minas y Energía argumentan que el proyecto reviste carácter de utilidad pública e interés social primordial, pues garantizará la seguridad energética para más de dos millones de colombianos en épocas de sequía crítica por el Fenómeno de El Niño, generando además regalías e inversiones en escuelas y acueductos para la región.\n\nPor su parte, los palabreros y autoridades tradicionales de los clanes interpusieron una Acción de Tutela solicitando la suspensión inmediata de las obras. Argumentan que el trazado de la línea eléctrica vulnera su derecho fundamental a la Consulta Previa (Convenio 169 de la OIT y Artículo 330 de la Constitución Política), pues fragmenta cementerios ancestrales y caminos sagrados por donde, según su cosmovisión, transitan los espíritus de sus ancestros (Jepirra). Los líderes indígenas afirman que los funcionarios gubernamentales realizaron talleres meramente informativos en un hotel de Riohacha sin traductores en lengua Wayuunaiki ni la presencia de las autoridades legítimas de cada territorio clanil.`,
    pregunta: 'De acuerdo con la jurisprudencia de la Corte Constitucional colombiana sobre el principio de diversidad étnica y el derecho a la Consulta Previa, ¿cuál de los siguientes análisis jurídicos y constitucionales es el más acertado para evaluar este conflicto?',
    opciones: [
      'El interés general de dos millones de ciudadanos prevalece de forma absoluta sobre cualquier interés minoritario, por lo cual el Ministerio puede ordenar el desalojo inmediato de los cementerios ancestrales sin trámite previo.',
      'La Consulta Previa es un derecho fundamental irrenunciable que no se agota con reuniones informativas; el Estado debe realizar un diálogo intercultural genuino, vinculante y libre de coacción para armonizar la transición energética con la pervivencia cultural de la comunidad.',
      'Las comunidades indígenas no tienen ningún derecho a opinar sobre megaproyectos energéticos, ya que el subsuelo y los vientos colombianos son de propiedad privada exclusiva de las empresas inversionistas extranjeras.',
      'El Estado debe suspender definitivamente y para siempre cualquier intento de desarrollo tecnológico o de energías limpias en todo el territorio nacional donde existan minorías étnicas.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'La Corte Constitucional de Colombia ha reiterado de forma uniforme (Sentencias SU-039 de 1997, T-129 de 2011, SU-123 de 2018) que la Consulta Previa es un derecho fundamental y un mecanismo de protección de la identidad cultural (Arts. 1 y 7 C.P.). No es una simple notificación unilateral o trámite administrativo; requiere buena fe, participación activa en su lengua materna y búsqueda de consentimiento previo, libre e informado, especialmente cuando se afecte la integridad territorial o espiritual de la comunidad. El interés general no autoriza el atropello de derechos fundamentales de minorías.',
      aprendeEsto:
        'En la Constitución colombiana de 1991, el principio de diversidad étnica y cultural (Art. 7) es norma superior. Cuando choca con el interés general (Art. 58), la Corte aplica el juicio de proporcionalidad, buscando armonizar ambos intereses sin sacrificar la supervivencia cultural del grupo minoritario.',
      errorFrecuente:
        'Creer que en el ordenamiento jurídico colombiano la cláusula del «interés general» es un cheque en blanco que aplasta automáticamente los derechos humanos fundamentales reconocidos en tratados internacionales (Bloque de Constitucionalidad).',
      consejoIcfes:
        'Descarta las opciones totalitarias o extremistas (como "A" que avala el desalojo forzoso arbitrario o "D" que propone paralizar el país). Las respuestas correctas en competencias ciudadanas suelen ser aquellas que promueven la deliberación democrática, la legalidad constitucional y el equilibrio de derechos.',
    },
  },
  {
    id: 'soc-002',
    area: 'SOCIALES_CIUDADANAS',
    tema: 'Mecanismos de Protección Ciudadana y Estado de Derecho',
    subtema: 'Acción Popular vs. Acción de Tutela vs. Derecho de Petición',
    competencia: 'Pensamiento social y Argumentación',
    dificultad: 'Media',
    contexto: `En un municipio intermedio del Tolima, una empresa de curtiembres vierte diariamente sulfuros, cromo hexavalente y residuos biológicos sin tratamiento directamente a la quebrada local de la cual se abastece el acueducto veredal que atiende a unas 4.500 personas.\n\nLa comunidad ha comenzado a sufrir erupciones cutáneas, olores nauseabundos permanentes y enfermedades gastrointestinales agudas. Además, un pescador artesanal de 62 años residente a 30 metros de la orilla fue hospitalizado de urgencia con falla hepática severa atribuida a intoxicación por metales pesados en el agua que consumía directamente en su vivienda rural.\n\nUn grupo de líderes comunales se reúne en la junta de acción comunal para definir qué acciones constitucionales emprender ante la justicia civil y administrativa:\n\n• Un vocero propone interponer una Acción Popular para obligar a la curtiembre a construir una planta de tratamiento y descontaminar la quebrada.\n• La hija del pescador intoxicado afirma que deben interponer de inmediato una Acción de Tutela para que la EPS y el hospital suministren atención médica integral y urgente a su padre, y para que el municipio suministre agua potable en carrotanques a su casa.\n• Un tercer ciudadano insiste en que lo único legalmente procedente es redactar un Derecho de Petición dirigido al dueño de la fábrica solicitándole que suspenda los vertimientos por voluntad propia.`,
    pregunta: 'Respecto a la idoneidad y alcance jurídico de las acciones propuestas por los ciudadanos, ¿cuál de las siguientes afirmaciones es correcta según la Constitución Política de Colombia?',
    opciones: [
      'La Acción Popular no procede en este caso porque la contaminación de un río es un asunto privado que no afecta los derechos colectivos de la comunidad.',
      'La Acción de Tutela es procedente para salvaguardar de urgencia la vida y la salud del pescador, mientras que la Acción Popular es el mecanismo idóneo para proteger el derecho colectivo al medio ambiente sano de toda la comunidad frente a la quebrada contaminada.',
      'El Derecho de Petición es el único mecanismo que tiene fuerza vinculante para imponer multas penales y encarcelar al gerente de la fábrica en un plazo de 24 horas.',
      'Los ciudadanos deben esperar obligatoriamente a que el Congreso de la República apruebe una ley específica que prohíba a esa curtiembre en particular botar desechos.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'La Constitución colombiana establece una clara diferenciación procesal: \n1) La Acción Popular (Art. 88 C.P. y Ley 472 de 1998) protege derechos e intereses colectivos (medio ambiente sano, salubridad pública y seguridad de la comunidad frente a la contaminación del río).\n2) La Acción de Tutela (Art. 86 C.P.) procede contra la vulneración inminente de derechos fundamentales individuales (la vida y la salud en conexidad del pescador hospitalizado, garantizando atención médica inmediata y agua potable de emergencia).\nAmbas herramientas son complementarias y necesarias en este caso.',
      aprendeEsto:
        '• Tutela: Derechos fundamentales individuales (vida, salud, debido proceso, libertad).\n• Acción Popular: Derechos colectivos (medio ambiente sano, espacio público, moralidad administrativa).\n• Acción de Grupo: Indemnización pecuniaria para un grupo de al menos 20 personas afectadas por un mismo daño.',
      errorFrecuente:
        'Creer que el derecho de petición sirve para ordenar medidas cautelares judiciales obligatorias. El derecho de petición solo exige una respuesta respetuosa y de fondo en los plazos legales, no sanciona judicialmente.',
      consejoIcfes:
        'Memoriza los tiempos y fines de cada mecanismo constitucional colombiano. El ICFES evalúa sistemáticamente casos donde se entrecruza un daño masivo colectivo con una urgencia médica individual.',
    },
  },
  {
    id: 'soc-003',
    area: 'SOCIALES_CIUDADANAS',
    tema: 'Historia de Colombia y Conflicto Armado',
    subtema: 'Frente Nacional y Orígenes de la Violencia Contemporánea',
    competencia: 'Pensamiento social e Interpretación de perspectivas',
    dificultad: 'Media',
    contexto: `El pacto del Frente Nacional (1958-1974), suscrito entre los líderes Alberto Lleras Camargo (Partido Liberal) y Laureano Gómez (Partido Conservador) a través de las declaraciones de Benidorm y Sitges, puso fin formal a la dictadura del general Gustavo Rojas Pinilla y al sangriento periodo conocido como «La Violencia» bipartidista que había dejado más de 200.000 muertos en los campos colombianos.\n\nEl acuerdo estipuló que durante dieciséis años la Presidencia de la República se alternaría rigurosamente cada cuatro años entre liberales y conservadores, y que todos los cargos del poder público —ministerios, gobernaciones, alcaldías, escaños en el Congreso, asambleas departamentales y juzgados de la Rama Judicial— se repartirían milimétricamente en partes iguales (paridad del 50% para cada colectividad tradicional).\n\nSi bien este mecanismo logró pacificar el enfrentamiento armado directo entre las bases populares liberales y conservadoras en regiones como Boyacá, Santander y Tolima, analistas políticos e historiadores señalan que tuvo un costo institucional profundo. El cierre total del sistema democrático bloqueó la participación legal de terceras fuerzas políticas, movimientos campesinos, organizaciones sindicales e intelectuales de izquierda.`,
    pregunta: '¿Cuál de los siguientes fenómenos sociopolíticos de la historia colombiana de la segunda mitad del siglo XX se encuentra directamente vinculado como consecuencia del cierre electoral del Frente Nacional?',
    opciones: [
      'La disolución inmediata de los partidos Liberal y Conservador y la instauración de una monarquía parlamentaria en Colombia.',
      'El surgimiento y consolidación de los primeros grupos guerrilleros de izquierda (como las FARC, el ELN y el M-19) ante la imposibilidad de canalizar la oposición por vías electorales democráticas.',
      'La firma del Tratado de Versalles y la pérdida de la soberanía sobre el canal de Panamá.',
      'La abolición definitiva de la propiedad privada y la nacionalización de todos los bancos colombianos en 1960.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'Uno de los consensos históricos más documentados sobre el conflicto armado en Colombia es que la exclusión sistemática de cualquier opción política por fuera del bipartidismo liberal-conservador durante el Frente Nacional creó un terreno fértil para la justificación de la lucha armada. Diversos sectores campesinos, obreros y universitarios, al verse privados de representación parlamentaria y ante el fraude electoral denunciado en 1970 (que dio origen al Movimiento 19 de Abril, M-19), optaron por las armas como único camino percibido para la transformación estructural del Estado.',
      aprendeEsto:
        'El Frente Nacional pacificó la violencia fratricida tradicional (azul vs. rojo), pero al institucionalizar el monopolio del poder y la alternancia cerrada, incubó la violencia insurgente ideológica de finales del siglo XX.',
      errorFrecuente:
        'Confundir periodos históricos (como la pérdida de Panamá en 1903 o la Guerra de los Mil Días) con los efectos específicos del Frente Nacional a mediados del siglo XX.',
      consejoIcfes:
        'En preguntas sobre la historia política colombiana, analiza las causas paradójicas: una medida pensada para pacificar (el pacto bipartidista) puede generar simultáneamente las condiciones de un nuevo conflicto (la insurgencia armada).',
    },
  },
  {
    id: 'soc-004',
    area: 'SOCIALES_CIUDADANAS',
    tema: 'Economía Política y Principios Constitucionales del Tributo',
    subtema: 'Impuestos Regresivos vs. Progresivos, Coeficiente de Gini y Equidad',
    competencia: 'Pensamiento social y Argumentación',
    dificultad: 'Avanzada',
    contexto: `En el marco de un debate sobre una reforma tributaria estructural en el Congreso de la República, el Ministro de Hacienda propone gravar con una tarifa general del Impuesto al Valor Agregado (IVA) del 19% a todos los alimentos de la canasta familiar básica (arroz, leche, huevos, frijol y pan), argumentando que esta medida permitiría recaudar más de $15 billones de pesos para sanear el déficit fiscal y financiar subsidios focalizados para familias vulnerables.\n\nFrente a esta iniciativa, un grupo de economistas y congresistas de oposición argumenta que la propuesta viola abiertamente el principio constitucional de progresividad tributaria consagrado en el Artículo 363 de la Constitución Política de Colombia («El sistema tributario se funda en los principios de equidad, eficiencia y progresividad»). Explican que un hogar en situación de pobreza extrema destina entre el 60% y el 70% de sus magros ingresos exclusivamente a la alimentación, mientras que un hogar de altos ingresos destina menos del 10% de sus recursos a este rubro, por lo que el impuesto castiga con mayor dureza porcentual a quienes menos tienen.`,
    pregunta: 'Desde el análisis de la economía pública y el derecho constitucional, ¿por qué gravar los alimentos básicos de la canasta familiar con un impuesto indirecto como el IVA se considera una medida marcadamente regresiva?',
    opciones: [
      'Porque el IVA es un impuesto que grava directamente las utilidades netas y el patrimonio de las grandes corporaciones financieras internacionales.',
      'Porque al cobrarse una tarifa fija idéntica a todos los compradores sin considerar su nivel de ingresos o capacidad de pago, absorbe una porción proporcionalmente mucho mayor del presupuesto de los hogares de menores ingresos.',
      'Porque los alimentos básicos en Colombia son producidos exclusivamente por el Estado y no pueden tener ningún costo monetario para la población.',
      'Porque el Congreso de la República carece por completo de facultades constitucionales para debatir o legislar en materia de impuestos nacionales.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'Un tributo es **regresivo** cuando la carga tributaria real disminuye a medida que aumenta la capacidad económica del sujeto. El IVA es un impuesto indirecto y ciego a la riqueza del comprador: un kilo de arroz paga exactamente el mismo valor de IVA sin importar si lo adquiere una persona desempleada o un multimillonario. Como el hogar vulnerable gasta la mayor parte de su salario en subsistir, el impuesto le arrebata un porcentaje enorme de su renta vital, profundizando la desigualdad económica.',
      aprendeEsto:
        '• Impuesto Progresivo: Paga un porcentaje mayor quien más ingresos tiene (ejemplo: Impuesto a la Renta de personas naturales con tarifas marginales crecientes).\n• Impuesto Regresivo: Afecta en mayor proporción relativa a los sectores de menores recursos (ejemplo: IVA indiscriminado a bienes de primera necesidad).\n• Principios del Art. 363 C.P.: Equidad, Eficiencia y Progresividad.',
      errorFrecuente:
        'Confundir la igualdad aritmética formal (todos pagan el 19%) con la equidad material tributaria. En derecho tributario, cobrar lo mismo a quienes viven en condiciones radicalmente desiguales genera una flagrante injusticia distributiva.',
      consejoIcfes:
        'En preguntas de economía de Sociales y Ciudadanas, examina siempre el impacto relativo del impuesto o de la política pública sobre la distribución del ingreso de las distintas clases sociales.',
    },
  },
  {
    id: 'soc-005',
    area: 'SOCIALES_CIUDADANAS',
    tema: 'Mecanismos de Participación Ciudadana y Democracia Participativa',
    subtema: 'Consulta Popular, Fracking, Descentralización y Uso del Suelo',
    competencia: 'Multiperspectivismo y Análisis de perspectiva',
    dificultad: 'Avanzada',
    contexto: `En un municipio andino de vocación agropecuaria y turística de Santander, una empresa petrolera estatal proyecta realizar pruebas piloto de perforación no convencional mediante fracturamiento hidráulico (*fracking*) para la extracción de hidrocarburos en lutitas profundas.\n\nPreocupados por la posible contaminación de los acuíferos subterráneos y el riesgo de sismicidad inducida en una zona de fallas geológicas activas, el Concejo Municipal y el Alcalde aprueban la convocatoria a una **Consulta Popular Municipal** (conforme al Artículo 105 de la Constitución y la Ley 134 de 1994). La pregunta formulada a la ciudadanía es: «¿Está usted de acuerdo, sí o no, con que en el territorio de nuestro municipio se ejecuten proyectos de exploración y explotación de hidrocarburos mediante técnicas no convencionales de fracking?». En la jornada de votación acude a las urnas más del 60% del censo electoral y el 96.5% de los votantes eligen la opción «NO».\n\nSin embargo, el Ministerio de Minas y la Agencia Nacional de Hidrocarburos sostienen que la Consulta Popular no es aplicable para vetar proyectos petroleros, amparándose en el Artículo 332 de la Constitución, el cual señala que «el Estado es propietario del subsuelo y de los recursos naturales no renovables», por lo que una autoridad municipal no puede atribuirse facultades exclusivas de la Nación.`,
    pregunta: 'Frente a la tensión jurídica entre la autonomía territorial municipal (Art. 287 y 311 C.P.) y la propiedad estatal del subsuelo (Art. 332 C.P.), ¿cuál ha sido la postura vinculante fijada por la Corte Constitucional (Sentencia SU-095 de 2018)?',
    opciones: [
      'Declarar que los municipios son repúblicas independientes que pueden expulsar a la policía nacional y desconocer cualquier ley aprobada por el Congreso.',
      'Determinar que las consultas populares locales no tienen la potestad de vetar unilateralmente proyectos del subsuelo nacional, pero ordenar al Gobierno y al Congreso crear mesas de concertación y concurrencia obligatoria entre la Nación y los entes territoriales.',
      'Suprimir todas las elecciones y prohibir el voto popular en Colombia para que las empresas extranjeras decidan libremente sobre la explotación del territorio.',
      'Ordenar que todos los recursos del petróleo se repartan equitativamente en efectivo a cada votante de la consulta popular al día siguiente.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'En la histórica Sentencia de Unificación SU-095 de 2018, la Corte Constitucional resolvió este choque de competencias determinando que ni la Nación puede imponer proyectos extractivos de manera unilateral desconociendo la autonomía y vocación agrícola de los municipios (Art. 287 C.P.), ni los municipios pueden mediante consulta popular vetar de forma absoluta la explotación de recursos del subsuelo que le pertenecen a toda la Nación (Art. 332 C.P.). Por ende, la Corte ordenó aplicar los principios constitucionales de **concurrencia, coordinación y subsidiariedad**, exigiendo mecanismos de concertación interinstitucional.',
      aprendeEsto:
        'Tensión constitucional clave en Colombia: Autonomía territorial (uso del suelo, Art. 313) vs. Estado unitario y propiedad del subsuelo (Art. 332). La solución jurídica nunca es anular un principio, sino aplicar fórmulas de concertación y armonización armónica.',
      errorFrecuente:
        'Creer que el resultado de una consulta popular municipal es automáticamente suficiente para expulsar a una industria regulada por la legislación minero-energética nacional sin pasar por el control de constitucionalidad del Consejo de Estado y la Corte Constitucional.',
      consejoIcfes:
        'Revisa los 7 mecanismos de participación ciudadana en Colombia (Voto, Plebiscito, Referendo, Consulta Popular, Cabildo Abierto, Iniciativa Popular Legislativa y Revocatoria del Mandato). El ICFES evalúa sus límites de competencia.',
    },
  },

  // =================================================================================================
  // 5. INGLÉS (Lecturas Extensas B1/B2, Gramática en Contexto, Conectores y Vocabulario)
  // =================================================================================================
  {
    id: 'ing-001',
    area: 'INGLES',
    tema: 'Reading Comprehension: Global Environmental Challenges',
    subtema: 'Inferring Author’s Purpose and Contextual Vocabulary',
    competencia: 'Comprensión inferencial',
    dificultad: 'Media',
    contexto: `Over the past three decades, urban agriculture has transformed from an eccentric hobby practiced by community activists into a recognized pillar of sustainable metropolitan planning across Latin America. In megacities like Bogotá, Medellín, and São Paulo, rooftop gardens and cooperative community plots are not merely producing fresh organic vegetables; they are fundamentally reshaping social cohesion and urban microclimates.\n\nTraditional industrial agriculture requires vast tracts of deforested land, intensive chemical fertilizers, and complex refrigerated transport networks that generate significant carbon footprints before produce reaches consumers. By contrast, hyperlocal food systems eliminate long-distance haulage and recycle composted urban organic waste into nutrient-rich soil. Furthermore, green roofs act as natural temperature regulators, absorbing solar radiation during scorching summer days and significantly reducing the "urban heat island" effect that plagues concrete-dense downtown districts.\n\nHowever, municipal agronomists caution against romanticizing the movement without addressing structural challenges. Contaminated soil near industrial corridors, heavy metal particulates settled from vehicular emissions, and unauthorized access to clean irrigation water pose legitimate food safety risks if left unregulated. To fulfill its true potential, municipal governments must establish formal certification standards, technical training for community growers, and equitable land-tenure frameworks that protect gardens from aggressive commercial real estate speculation.`,
    pregunta: 'According to the second and third paragraphs of the passage, what is the primary warning given by agronomists regarding the future of urban agriculture?',
    opciones: [
      'Urban agriculture has proven completely ineffective and should be replaced by traditional rural monocultures.',
      'While urban farming provides substantial ecological and social benefits, it requires strict regulatory oversight on pollutants and water safety to prevent serious health hazards.',
      'Vegetables cultivated on urban rooftops are naturally immune to all types of atmospheric contamination and vehicular emissions.',
      'Local governments should prohibit community gardens in order to construct more commercial real estate developments.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'En el tercer párrafo, los agrónomos advierten expresamente: «caution against romanticizing the movement without addressing structural challenges... Contaminated soil, heavy metal particulates, and unauthorized irrigation water pose legitimate food safety risks if left unregulated». Por ende, aunque el segundo párrafo destaca sus grandes beneficios ambientales, el éxito futuro exige regulación técnica y control de contaminantes para evitar riesgos de salud pública.',
      aprendeEsto:
        'En las lecturas de inglés del ICFES (Partes 6 y 7), presta especial atención a los conectores de contraste como «However», «Nevertheless», «On the other hand». Indican el matiz crítico donde reside la pregunta.',
      errorFrecuente:
        'Elegir opciones extremas como la A o la D, que contradicen el tono positivo y propositivo del texto.',
      consejoIcfes:
        'No necesitas traducir palabra por palabra mentalmente. Busca la palabra clave del enunciado («warning given by agronomists») y localízala en el texto («agronomists caution against...»).',
    },
  },
  {
    id: 'ing-002',
    area: 'INGLES',
    tema: 'Grammar in Context and Temporal Connectors',
    subtema: 'Conditionals, Modals and Clause Linking',
    competencia: 'Uso de estructuras gramaticales',
    dificultad: 'Media',
    contexto: `Global climate scientists have recently warned that coastal infrastructure in developing nations could face catastrophic flood risks unless urgent mitigation investments are deployed immediately. An engineering report presented at the international summit highlighted that if municipal authorities ________ built flood-prevention seawalls fifteen years ago, the recent hurricane damage in the Caribbean basin ________ significantly less severe.\n\nEconomic analysts further noted that every single dollar allocated toward preventive drainage engineering saves approximately seven dollars in post-disaster humanitarian reconstruction. Therefore, government ministries are being urged to reconsider their annual budgets before vulnerable coastlines suffer irreversible erosion.`,
    pregunta: 'Which pair of verbal forms correctly completes the conditional sentence in the second sentence of the text?',
    opciones: [
      'have / is',
      'had / would have been',
      'will have / will be',
      'would / had been',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'La oración expresa una situación hipotética en el pasado que no ocurrió (Tercer Condicional / Third Conditional):\n• Cláusula con If: Past Perfect («if municipal authorities had built flood-prevention seawalls...»)\n• Cláusula principal: Would have + past participle («the recent hurricane damage would have been significantly less severe»).\nEl Tercer Condicional se utiliza exclusivamente para lamentar o analizar consecuencias de hechos concluidos en el pasado que ya no se pueden cambiar.',
      aprendeEsto:
        'Estructura del Tercer Condicional en inglés ICFES:\nIf + Had + Past Participle, Subject + Would have + Past Participle.\nEjemplo: If I had studied, I would have passed the exam.',
      errorFrecuente:
        'Invertir las cláusulas colocando "would" dentro de la frase con "if" (*If I would have...*), lo cual es gramaticalmente incorrecto.',
      consejoIcfes:
        'Identifica el marcador temporal de pasado remoto («fifteen years ago»). Si el hecho ocurrió hace años, descarta de inmediato opciones con presente o futuro («have/is», «will have/will be»).',
    },
  },
  {
    id: 'ing-003',
    area: 'INGLES',
    tema: 'Reading Comprehension: Artificial Intelligence and Human Labor',
    subtema: 'Distinguishing Fact from Author’s Attitude',
    competencia: 'Comprensión global',
    dificultad: 'Media',
    contexto: `The rapid deployment of generative artificial intelligence across multinational corporations has sparked intense debate among sociologists and labor economists. Optimists argue that automation will liberate white-collar professionals from tedious clerical chores, allowing human creativity and critical empathy to flourish in previously unimaginable ways. According to this perspective, historical technological disruptions—from the printing press to the industrial assembly line—invariably created more specialized employment than they destroyed.\n\nConversely, skeptics highlight an unprecedented difference in the current paradigm: algorithms are no longer substituting merely physical labor, but cognitive and linguistic synthesis. When software programs can compose legal contracts, draft diagnostic summaries, and write functional computer code in fractions of a second, the displacement timeline may far outpace the capacity of educational institutions to retrain displaced workers.\n\nUltimately, technological evolution is neither inherently benevolent nor intrinsically destructive; its societal outcomes depend entirely on corporate accountability, public policy, and fair labor taxation.`,
    pregunta: 'What is the author’s primary concluding attitude regarding the impact of artificial intelligence on the future of employment?',
    opciones: [
      'Absolute pessimism, predicting the inevitable collapse of all human employment within five years.',
      'Blind optimism, guaranteeing that no employee will ever lose their job to automated software.',
      'Balanced and nuanced, emphasizing that the final outcome depends on political choices, ethical regulation, and educational adaptation rather than the technology itself.',
      'Complete indifference, considering that technology has no measurable influence on society.',
    ],
    respuestaCorrecta: 'C',
    explicacion: {
      porQue:
        'En la frase final («technology is neither inherently benevolent nor intrinsically destructive; its societal outcomes depend entirely on corporate accountability, public policy, and fair labor taxation»), el autor adopta una postura de equilibrio crítico y matizado (balanced and nuanced). No se adhiere ciegamente al optimismo ni al pánico destructivo, sino que atribuye el desenlace a las decisiones políticas y humanas.',
      aprendeEsto:
        'Las preguntas sobre actitud o tono del autor (Author’s attitude / tone) evalúan si sabes distinguir un texto polarizado de uno analítico y equilibrado. Palabras como "neither... nor" indican ponderación.',
      errorFrecuente:
        'Quedarse con la postura del primer párrafo (optimismo) o del segundo párrafo (escepticismo), sin leer la síntesis del último párrafo.',
      consejoIcfes:
        'En los textos de opinión en inglés, la posición definitiva del autor se concentra en el párrafo de cierre (concluding paragraph).',
    },
  },
  {
    id: 'ing-004',
    area: 'INGLES',
    tema: 'Cognitive Psychology and Habit Architecture',
    subtema: 'Contextual Vocabulary and Reading in Depth (Level B2)',
    competencia: 'Comprensión inferencial y léxica',
    dificultad: 'Avanzada',
    contexto: `In recent neurological investigations into behavioral modification, cognitive researchers have demonstrated that human habits are governed by an ancient evolutionary feedback loop composed of three discrete stages: the cue, the routine, and the reward. When a sensory stimulus triggers dopamine release in the basal ganglia, our prefrontal cortex essentially relinquishes conscious deliberation to conserve metabolic glucose, executing automated behavioural patterns with minimal intentional friction.\n\nCommercial software developers have ruthlessly capitalized on this neurological vulnerability. Infinite scroll mechanisms, variable intermittent notifications, and micro-rewards are deliberately engineered to foster compulsive digital consumption. Over time, users become deeply inured to constant sensory distraction, experiencing acute cognitive restlessness whenever forced to sustain uninterrupted focus on complex intellectual tasks.\n\nTo overcome this systemic fragmentation of attention, behavioral psychologists recommend deliberate environmental restructuring rather than relying purely on willpower. By systematically removing seductive digital triggers from one's workspace and substituting friction-free positive routines, individuals can gradually reclaim autonomous focus.`,
    pregunta: 'In the second paragraph of the text, what is the closest contextual meaning of the phrase "deeply inured to constant sensory distraction"?',
    opciones: [
      'Severely terrified by any electronic screen or software application.',
      'Habituated and accustomed to continuous interruption to the point of accepting it as normal behavior.',
      'Completely allergic to cellular devices and internet networks.',
      'Excited and eager to teach artificial intelligence to schoolchildren.',
    ],
    respuestaCorrecta: 'B',
    explicacion: {
      porQue:
        'En inglés formal y académico de nivel B2/C1, el adjetivo "inured" significa "acostumbrado / habituado a algo molesto o perjudicial tras una exposición prolongada" (accustomed or habituated to something undesirable). El texto describe cómo los usuarios, tras estar expuestos constantemente a notificaciones y pantallas infinitas, se vuelven insensiblemente habituados a la distracción, al punto de perder la capacidad de concentración sostenida.',
      aprendeEsto:
        'Estrategia de vocabulario en contexto (Context Clues): Si no conoces la palabra "inured", lee el resto de la frase: «users become deeply inured... experiencing acute restlessness whenever forced to focus». Indica un estado de habituación o acostumbramiento que hace insoportable el silencio y la concentración.',
      errorFrecuente:
        'Elegir la opción A («terrified») o C («allergic») asumiendo que "inured" proviene de "injury" (herida o daño físico), lo cual es una falsa etimología en este contexto.',
      consejoIcfes:
        'En la Parte 7 de Inglés, cuando te pregunten por el significado de una palabra o frase subrayada, reemplaza mentalmente cada una de las 4 opciones en el texto para verificar cuál preserva la coherencia lógica del párrafo.',
    },
  },
  {
    id: 'ing-005',
    area: 'INGLES',
    tema: 'Renewable Energy Engineering and Cohesive Discourse',
    subtema: 'Sentence Insertion, Discourse Markers and Textual Coherence',
    competencia: 'Comprensión global y cohesión textual',
    dificultad: 'Avanzada',
    contexto: `Transitioning modern energy grids from carbon-intensive fossil fuels toward resilient renewable architectures poses formidable engineering hurdles, particularly for isolated archipelagos and rural regions. Unlike conventional thermoelectric power plants whose electrical output can be dialed up or down instantaneously according to demand, photovoltaic solar panels and wind turbines are inherently intermittent. Their generation capacity fluctuates unpredictably depending on cloud coverage and fluctuating atmospheric barometric gradients.\n\nTo circumvent this volatility, international electrical consortia are pioneering massive utility-scale battery energy storage systems (BESS) based on lithium-iron-phosphate and emerging solid-state sodium chemistries. ________. By storing excess solar generation during peak midday sunlight and releasing it during evening hours, these systems ensure unbroken baseline stability across metropolitan distribution networks without firing diesel generators.\n\nFurthermore, the implementation of distributed microgrids empowers isolated communities to manage their own localized energy surpluses, dramatically enhancing resilience against catastrophic hurricanes and extreme weather shocks.`,
    pregunta: 'Which of the following sentences best fits in the blank space (marked by ________) to maintain logical coherence and cohesive progression in the second paragraph?',
    opciones: [
      'These sophisticated industrial accumulators serve as dynamic buffers that reconcile the mismatch between variable generation and consumer load peaks.',
      'Consequently, all coastal communities must immediately dismantle their electrical poles and return to whale-oil lamps.',
      'However, diesel combustion remains the only legal method to power computer servers in European capitals.',
      'Because solar panels can generate abundant electricity in pitch darkness without sunlight.',
    ],
    respuestaCorrecta: 'A',
    explicacion: {
      porQue:
        'La oración «These sophisticated industrial accumulators serve as dynamic buffers that reconcile the mismatch between variable generation and consumer load peaks» encaja a la perfección tanto anafóricamente (haciendo referencia a las "battery energy storage systems" mencionadas inmediatamente antes) como catafóricamente (conectando con la siguiente frase que explica cómo almacenan el exceso de energía del mediodía para usarlo en la noche). Preserva el tono formal, técnico e informativo del pasaje.',
      aprendeEsto:
        'En los ejercicios de inserción textual y cohesión discursiva (Partes 6 y 7 de Inglés Saber 11), busca pronombres demostrativos ("These accumulators" = "battery energy storage systems") y palabras de enlace temático ("buffers", "mismatch").',
      errorFrecuente:
        'Seleccionar opciones absurdas o incoherentes como la D (afirmar que los paneles solares producen electricidad en la oscuridad total) o la B (desmantelar postes para usar lámparas de ballena).',
      consejoIcfes:
        'Verifica siempre que la oración que insertes en el espacio en blanco se conecte con sentido natural tanto con la frase anterior como con la frase posterior.',
    },
  },
];
