// Spanish (/es/), one page for every Spanish speaker, like the store deck's one Spanish set: the deck's headlines word for
// word (~/development/tools/inscrybe-screenshots/config/copy/es.js), the approved listing's sentences
// (store-release/copy/apple-mx-es.json) and the app's own Spanish labels (Localizable.xcstrings: Nivel de voz, Generar
// voz, Modo discreto, Temporizador, A continuación…). Tú, as the app speaks. Forms both Mexico and Spain read the same.
export default {
  locale: 'es',
  htmlLang: 'es',
  ogLocale: 'es_MX',
  path: 'es/',
  other: { locale: 'en', label: 'English', short: 'EN', path: '', hreflang: 'en' },

  meta: {
    title: 'Inscrybe: crear subliminales y reproducirlos en iPhone y Android',
    description: 'Reproduce tus subliminales y crea los tuyos. Repeticiones, temporizador, Apple Watch y Wear OS, y un Estudio que mide qué tan oculta está cada voz.',
    ogTitle: 'Inscrybe: reproduce tus subliminales, crea los tuyos',
    ogImageAlt: 'Los dos planos de cristal del icono de Inscrybe con una línea de luz que los atraviesa',
  },

  a11y: {
    skip: 'Ir al contenido',
    nav: 'Principal',
    home: 'Inicio de Inscrybe',
    language: 'Read in English',
    phone: 'El reproductor de subliminales de Inscrybe con «Soy increíble (2x)», en su segunda de tres reproducciones',
  },

  nav: { player: 'Reproductor', studio: 'Estudio', privacy: 'Privacidad', support: 'Ayuda' },

  badge: {
    soon: 'Próximamente en el App Store',
    soonShort: 'Próximamente',
    live: 'Descárgalo en el App Store',
    playSoon: 'Próximamente en Google Play',
    playLive: 'Descargar en Google Play',
  },

  hero: {
    title: ['Reproduce tus subliminales.', 'Crea los tuyos.'],
    accent: 'los tuyos',
    lead: 'Reproduce tus subliminales y crea tus propios audios midiendo qué tan oculta está cada voz. Repite una pista las veces que quieras y contrólala desde el Apple Watch o un reloj Wear OS.',
    devices: 'Para iPhone, iPad, iPhone Duo y Android',
    words: ['Me amo tal como soy.', 'Soy un imán para el dinero.', 'El amor llega fácilmente a mi vida.', 'Nada me detiene.'],
  },

  sections: {
    library: {
      title: ['Todos tus subliminales', 'en un solo lugar'],
      accent: 'un solo lugar',
      lead: 'Importa lo que ya escuchas: archivos, carpetas completas, ZIP, videos y enlaces. Las carpetas y las listas de reproducción suenan en el orden que decidas.',
      facts: [
        ['Cualquier formato', 'MP3, AAC, FLAC, WAV, Opus, Ogg, WebM, MKV, WMA y más, y el audio de un video.'],
        ['Repite las veces que elijas', 'Pon una pista en bucle las veces que quieras y luego pasa a la siguiente o detente.'],
        ['Reproducciones por pista', 'En una lista, cada pista puede sonar las veces que elijas.'],
        ['Volumen y velocidad', 'Sube el volumen de las grabaciones que suenan bajo, y escúchalas más lento o más rápido.'],
        ['Mezclas', 'Varias pistas a la vez como una sola, cada una con su volumen y su lado.'],
        ['Sonido de fondo', 'Lluvia, mar o un tono binaural debajo de lo que escuches.'],
      ],
      alt: 'La Biblioteca de Inscrybe: carpetas, una mezcla y pistas con sus portadas, con «Soy increíble (2x)» sonando',
    },
    sleep: {
      title: ['Duerme escuchando', 'tus subliminales'],
      accent: 'Duerme',
      lead: 'Pon el temporizador por minutos o para que se detenga al terminar la pista, la carpeta o la lista. Al final el sonido se desvanece y la noche queda en silencio: no empieza el audio de otra app.',
      facts: [
        ['A continuación', 'Mira lo que queda de la noche y cámbialo solo por esta vez.'],
        ['Las pistas largas se reanudan', 'Siguen donde las dejaste.'],
      ],
      alt: 'El temporizador para detenerse al terminar la lista «Antes de dormir», con A continuación debajo',
    },
    visuals: {
      title: ['Mira tus afirmaciones', 'mientras escuchas'],
      accent: 'afirmaciones',
      lead: 'Los Visuales muestran tus afirmaciones en pantalla mientras suena una pista, en destellos dentro de los límites de fotosensibilidad o fijas, sobre tu portada o una presentación con tus fotos. Guárdalos como video en Fotos o en tu galería.',
      alt: 'Los Visuales en su estilo Subliminal: afirmaciones que destellan sobre el reproductor',
    },
    everywhere: {
      title: ['Contrólalo desde', 'tu Apple Watch'],
      accent: 'Apple Watch',
      lead: 'Tus subliminales donde escuches: la pantalla bloqueada, el Centro de control, los widgets, CarPlay, Siri y Atajos, AirPlay, y un control remoto en el Apple Watch con complicaciones. En Android: la pantalla de bloqueo, los widgets, la Configuración rápida, Android Auto y un control remoto en Wear OS con una tarjeta y complicaciones.',
      places: ['Pantalla bloqueada', 'Centro de control', 'Widgets', 'CarPlay', 'Siri y Atajos', 'AirPlay', 'Apple Watch'],
      alt: 'La app del Apple Watch controlando «Soy increíble (2x)» mientras suena en el iPhone',
    },
    stats: {
      title: ['Mantén viva', 'tu racha'],
      accent: 'racha',
      lead: 'Las Estadísticas muestran tus horas, una meta diaria y tu racha, con tu semana, tus meses y años, tus récords y cuándo escuchas.',
      alt: 'Las Estadísticas celebrando un mes de racha, la meta de hoy cumplida y lo escuchado en la semana',
    },
    studio: {
      title: ['Combina tu voz', 'con música'],
      accent: 'tu voz',
      lead: 'Con el Estudio creas subliminales como lo haría un profesional: tu voz sobre música, lluvia o un tono binaural, en capas que ajustas clip por clip.',
      facts: [
        ['Capas de clips', 'Cada uno con su inicio, pausas, repeticiones, desvanecimientos, volumen, lado, velocidad y tono.'],
        ['Sonidos integrados', 'Lluvia, mar, bosque, fuego y ruido, y tonos binaurales de delta a gamma (con audífonos o auriculares).'],
        ['Voz silenciosa', 'Sube una voz por encima de lo audible para subliminales silenciosos, con una comprobación antes de guardar.'],
        ['Guardar en la biblioteca', 'Como AAC, WAV o MP3, o Apple Lossless en dispositivos Apple. Edita el proyecto y guárdalo otra vez para reemplazarlo.'],
      ],
      alt: 'Un proyecto del Estudio de Inscrybe para crear subliminales: sus capas de voz, música y lluvia con sus ondas y volúmenes',
    },
    voice: {
      title: ['Graba o da voz', 'a tus afirmaciones'],
      accent: 'Graba o da voz',
      lead: 'Graba línea por línea con tu guion en pantalla y una cuenta regresiva, y vuelve a grabar cualquier línea. O usa Generar voz para leer en voz alta un guion escrito con las voces de tu dispositivo y tus pronunciaciones.',
      facts: [
        ['La Biblioteca de afirmaciones', 'Afirmaciones listas por categoría, en primera persona, en segunda o con un nombre.'],
        ['Mis grabaciones', 'Cada toma que guardas, lista para agregarla a cualquier proyecto.'],
      ],
      alt: 'Grabando un guion línea por línea, con Generar voz a partir del guion detrás',
    },
    hidden: {
      title: ['Tu voz, tan oculta', 'como quieras'],
      accent: 'tan oculta',
      lead: 'Nivel de voz mide cada voz contra lo que suena encima y la ajusta con un solo toque: Enterrada, Oculta, Tenue, Murmullo o Nítida. Con ¿Puedes oírlo? lo compruebas con tus oídos.',
      facts: [
        ['Nunca queda sola', 'En Tenue y en niveles más bajos, la voz se silencia cuando desaparece el sonido de fondo.'],
        ['Cada voz con su nivel', 'Cada voz de un proyecto se mide por separado y tiene su propio nivel.'],
      ],
      alt: 'Nivel de voz aplicado a la voz de un proyecto, en Oculta',
    },
    privacy: {
      title: ['Mantén en privado', 'tus subliminales'],
      accent: 'en privado',
      lead: 'El Modo discreto muestra nombres y portadas inventados en la pantalla bloqueada, en CarPlay y Android Auto, en los widgets y en tu reloj. Ocultos es una colección con su propio bloqueo, y el Bloqueo de la app abre Inscrybe con Face ID, Touch ID, tu huella o tu rostro, o un PIN.',
      facts: [
        ['Sin analíticas', 'Nada registra cómo usas la app. Los informes de errores nunca incluyen tus pistas ni tus guiones, y puedes desactivarlos.'],
        ['Sincronización y copias', 'En dispositivos Apple, tu biblioteca, tus proyectos y tus grabaciones se sincronizan en tu propio iCloud. En Android, Copia de seguridad y restauración guarda una copia donde elijas.'],
      ],
      alt: 'La misma pantalla bloqueada dos veces: «Mentalidad millonaria (2x)» sonando, y como la muestra el Modo discreto, «Avenida del resplandor que queda» de Lucia Wren',
    },
  },

  chapters: {
    player: 'El Reproductor',
    studio: 'El Estudio',
  },

  download: {
    title: ['Reproduce tus subliminales.', 'Crea los tuyos.'],
    accent: 'los tuyos',
    leadSoon: 'Inscrybe llega pronto al App Store para iPhone, iPad y iPhone Duo, con CarPlay y Apple Watch.',
    leadLive: 'Inscrybe ya está en el App Store para iPhone, iPad y iPhone Duo, con CarPlay y Apple Watch.',
    playSoon: 'En Android, llega pronto a Google Play, con Android Auto y Wear OS.',
    playLive: 'En Android, ya está en Google Play, con Android Auto y Wear OS.',
  },

  support: {
    title: 'Ayuda',
    lead: 'Respuestas a lo que más nos preguntan. Para cualquier otra cosa, escríbenos.',
    contactTitle: 'Escríbenos',
    contactLead: 'Cuéntanos qué estabas haciendo cuando pasó y qué teléfono o tableta usas.',
    copy: 'Copiar correo',
    copied: 'Correo copiado',
    fromApp: 'Desde la app: Configuración › Contacto. Con Incluir información del dispositivo activado, tu mensaje lleva los datos que ayudan a encontrar un error, nunca tus pistas ni tus guiones.',
    groups: [
      {
        title: 'Escuchar',
        items: [
          ['¿Cómo agrego mis subliminales a Inscrybe?', 'En la Biblioteca, toca + y elige Importar archivos, Importar carpeta o Importar desde un enlace. También puedes abrir un archivo de audio en Inscrybe desde Archivos, AirDrop o el menú Compartir, o en Android desde Archivos o Compartir. El enlace tiene que llevar directo al archivo; no se admiten servicios de streaming.'],
          ['¿Cómo repito una pista un número de veces?', 'En el reproductor, toca Repetir y, en Repetir esta pista, elige cuántas veces o Personalizado…. Con Luego reproducir a continuación activado, después de la última vez suena la siguiente pista; si no, la reproducción se detiene ahí.'],
          ['¿Cómo funciona el temporizador?', 'Toca la luna en el reproductor y elige una duración en minutos, Al terminar la pista, Al terminar la carpeta o Al terminar la lista de reproducción, según lo que esté sonando. Al final, el sonido se desvanece.'],
          ['¿La app del reloj reproduce audio?', 'No. En el Apple Watch y en un reloj Wear OS es un control remoto de tu teléfono: muestra lo que suena, controla la reproducción y el temporizador, y abre tu biblioteca y tus listas. El audio suena en tu teléfono.'],
        ],
      },
      {
        title: 'El Estudio',
        items: [
          ['¿Qué mide Nivel de voz?', 'Nivel de voz compara cada voz de un proyecto con la música y los sonidos que suenan encima y te dice dónde está: Nítida, Murmullo, Tenue, Oculta o Enterrada. Toca un nivel y el volumen de la voz se ajusta para llegar a él. Es una estimación, así que con ¿Puedes oírlo? lo compruebas con tus oídos.'],
          ['¿Cómo guardo un proyecto como pista?', 'En el proyecto, toca Guardar en la biblioteca y elige el formato. Si lo guardas otra vez después de editarlo, Inscrybe te ofrece reemplazar esa pista y conservar sus reproducciones y su lugar en tu biblioteca.'],
        ],
      },
      {
        title: 'Privacidad',
        items: [
          ['¿Qué cambia el Modo discreto?', 'Una pista disfrazada muestra un nombre y una portada inventados en Inscrybe y fuera de ella: en la pantalla bloqueada, en CarPlay y Android Auto, en los widgets, en tu reloj, en Siri y en los nombres de los archivos que compartes. Actívalo en Configuración › Privacidad › Modo discreto, para Elementos privados o Todo. Mostrar nombres reales muestra los reales dentro de Inscrybe hasta que sales de la app.'],
          ['Olvidé el PIN del Bloqueo de la app.', 'En la pantalla de bloqueo, toca ¿Olvidaste el PIN? y vuelve a entrar con el código de acceso o el bloqueo de pantalla de tu dispositivo, o con tu código de recuperación, según lo que elegiste al activar el Bloqueo de la app.'],
          ['¿Qué datos recopila Inscrybe?', 'Inscrybe no tiene analíticas: nada registra cómo usas la app. Si se cierra inesperadamente, se envía un informe sin los nombres de tus pistas, tus guiones ni información sobre ti. Desactiva Compartir informes de errores en Configuración › Privacidad para no enviar ninguno.'],
        ],
      },
      {
        title: 'Tu cuenta',
        items: [
          ['¿Cómo uso Inscrybe en todos mis dispositivos?', 'Activa Configuración › Sincronización con iCloud en cada dispositivo con la misma cuenta de Apple. Tu biblioteca, tus listas, tus proyectos y tus grabaciones se sincronizan en tu propio iCloud, y el audio se descarga cuando suena. En Android, lleva tu biblioteca a un teléfono nuevo con Configuración › Copia de seguridad y restauración.'],
          ['¿Cómo restauro mi suscripción en un dispositivo nuevo?', 'En Inscrybe, abre Configuración y toca Restaurar compras, con la cuenta de Apple o de Google con la que te suscribiste.'],
          ['¿Cómo cambio o cancelo mi suscripción?', 'En Inscrybe, abre Configuración y toca Administrar suscripción, o ve a la app Configuración, toca tu nombre y luego Suscripciones. En Android, abre Google Play, toca tu foto de perfil y luego Pagos y suscripciones. Apple y Google Play se encargan de los cobros.'],
        ],
      },
    ],
  },

  footer: {
    terms: 'Términos de servicio',
    privacy: 'Política de privacidad',
    termsUrl: 'https://armandojimenez.dev/apps/inscrybe/terms-es.html',
    privacyUrl: 'https://armandojimenez.dev/apps/inscrybe/privacy-policy-es.html',
    copyright: '© 2026 Believe PR. Todos los derechos reservados.',
    made: 'Hecho por Armando Jimenez',
    madeUrl: 'https://armandojimenez.dev/es/',
    apple: 'Apple, el logotipo de Apple, iPhone, iPad, Apple Watch, CarPlay y Siri son marcas comerciales de Apple Inc.',
    google: 'Google Play, el logotipo de Google Play, Android, Android Auto y Wear OS son marcas comerciales de Google LLC.',
  },
};
