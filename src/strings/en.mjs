// English (the root page). Headlines are the approved store deck's, word for word
// (~/development/tools/inscrybe-screenshots/config/copy/en.js), with the deck's accent; every other line comes from the
// approved listing (store-release/copy/apple-us-en.json) and the app's own labels (Localizable.xcstrings). House rules
// (dossier › brand.dontSay): plain and direct, no counts or limits, no dashes, no soft or AI talk, tracks never songs,
// nothing called free or paid.
export default {
  locale: 'en',
  htmlLang: 'en',
  ogLocale: 'en_US',
  path: '',
  other: { locale: 'es', label: 'Español', short: 'ES', path: 'es/', hreflang: 'es' },

  meta: {
    title: 'Inscrybe: Subliminal Maker and Player for iPhone',
    description: 'Play the subliminals you have and make your own. Repeat counts, a sleep timer, Apple Watch control and a Studio that measures how hidden each voice is.',
    ogTitle: 'Inscrybe: play your subliminals, make your own',
    ogImageAlt: 'The Inscrybe icon’s two glass planes with a line of light passing through them',
  },

  a11y: {
    skip: 'Skip to content',
    nav: 'Main',
    home: 'Inscrybe home',
    language: 'Leer en español',
    phone: 'Inscrybe’s subliminal player playing “I Am Amazing (2x)”, its second of three plays',
  },

  nav: { player: 'Player', studio: 'Studio', privacy: 'Privacy', support: 'Support' },

  badge: {
    soon: 'Coming soon to the App Store',
    soonShort: 'Coming soon',
    live: 'Download on the App Store',
  },

  hero: {
    title: ['Play your subliminals.', 'Make your own.'],
    accent: 'your own',
    lead: 'Play the subliminals you have and make your own, each voice measured so you know how hidden it is. Loop a track as many times as you want and control it from Apple Watch.',
    devices: 'For iPhone, iPad and iPhone Duo',
    words: ['I love who I am.', 'I am a money magnet.', 'Love comes to me easily.', 'I am unstoppable.'],
  },

  sections: {
    library: {
      title: ['All your subliminals', 'in one place'],
      accent: 'one place',
      lead: 'Bring in what you already listen to: files, whole folders, ZIPs, videos and links. Folders and playlists play in the order you set.',
      facts: [
        ['Any format', 'MP3, AAC, FLAC, WAV, Opus, Ogg, WebM, MKV, WMA and more, and the audio of a video.'],
        ['Repeat a set number of times', 'Loop a track as many times as you set, then go on to the next or stop.'],
        ['Plays per entry', 'Each playlist entry can play its own number of times.'],
        ['Volume boost and speed', 'Boost quiet recordings, and play tracks slower or faster.'],
        ['Mixes', 'Several tracks at once as one, each at its own volume and side.'],
        ['Background Sound', 'Rain, ocean or a binaural beat under anything you play.'],
      ],
      alt: 'The Library in Inscrybe: folders, a Mix and tracks with their covers, “I Am Amazing (2x)” playing',
    },
    sleep: {
      title: ['Fall asleep to', 'your subliminals'],
      accent: 'asleep',
      lead: 'Set the sleep timer by minutes, or to stop at the end of a track, a folder or a playlist. It fades out at the end and leaves the night quiet: no other app’s audio starts after it.',
      facts: [
        ['Up Next', 'See the rest of the night, and change it for this time only.'],
        ['Long tracks resume', 'Pick up where you stopped.'],
      ],
      alt: 'The Sleep Timer set to stop at the end of the playlist “Before Bed”, with Up Next below',
    },
    visuals: {
      title: ['See your affirmations', 'while you listen'],
      accent: 'affirmations',
      lead: 'Visuals show your affirmations on screen while a track plays, flashed within photosensitivity limits or steady, over your cover or a slideshow of your own pictures. Save them as a video to Photos.',
      alt: 'Visuals in their Subliminal look: affirmations flashing over the player',
    },
    everywhere: {
      title: ['Control it from', 'your Apple Watch'],
      accent: 'Apple Watch',
      lead: 'Your subliminals wherever you listen: the Lock Screen, Control Center, widgets, CarPlay, Siri and Shortcuts, AirPlay, and an Apple Watch remote with complications.',
      places: ['Lock Screen', 'Control Center', 'Widgets', 'CarPlay', 'Siri and Shortcuts', 'AirPlay', 'Apple Watch'],
      alt: 'The Apple Watch app controlling “I Am Amazing (2x)” as it plays on the iPhone',
    },
    stats: {
      title: ['Keep your streak', 'going'],
      accent: 'streak',
      lead: 'Stats show your hours, a daily goal and your streak, with your week, your months and years, your records and when you listen.',
      alt: 'Stats celebrating a month’s streak, today’s goal reached and the week’s listening',
    },
    studio: {
      title: ['Layer your voice', 'with music'],
      accent: 'your voice',
      lead: 'The Studio makes subliminals the way a professional would: your voice over music, rain or a binaural beat, in layers you shape clip by clip.',
      facts: [
        ['Layers of clips', 'Each with its own start, pauses, repeats, fades, volume, side, speed and pitch.'],
        ['Built-in sounds', 'Rain, ocean, forest, fire and noise, and binaural beats from delta to gamma (headphones needed).'],
        ['Silent voice', 'Moves a voice above hearing for silent subliminals, with a check before you save.'],
        ['Save to Library', 'As AAC, WAV, MP3 or Apple Lossless. Edit the project and save again to replace it.'],
      ],
      alt: 'A subliminal project in Inscrybe’s Studio: its Voice, Music and Rain layers with their waveforms and volumes',
    },
    voice: {
      title: ['Record or speak', 'your affirmations'],
      accent: 'Record or speak',
      lead: 'Record line by line with your script on screen and a count-in, and record any line again. Or let Speak turn a written script into a voice on your device, with your own pronunciations.',
      facts: [
        ['The Affirmation Library', 'Ready-made affirmations by category, in first person, second person or with a name.'],
        ['My Recordings', 'Every take you keep, on all your devices.'],
      ],
      alt: 'Recording a script line by line, with Speak the Script behind it',
    },
    hidden: {
      title: ['Know how hidden', 'your voice is'],
      accent: 'how hidden',
      lead: 'How Hidden measures each voice against what plays over it and sets it to Buried, Hidden, Faint, Murmur or Clear in one tap. Can You Hear It? lets you check with your own ears.',
      facts: [
        ['Never left on its own', 'At Faint and lower, the voice goes quiet where the background drops away.'],
        ['Every voice on its own', 'Each voice in a project is measured on its own and set to its own stop.'],
      ],
      alt: 'How Hidden on a project’s voice, set to Hidden',
    },
    privacy: {
      title: ['Keep your subliminals', 'private'],
      accent: 'private',
      lead: 'Discreet Mode shows made-up names and covers on the Lock Screen, in CarPlay, in widgets and on Apple Watch. Hidden is a collection with its own lock, and App Lock opens Inscrybe with Face ID, Touch ID or a PIN.',
      facts: [
        ['No analytics', 'Nothing logs how you use the app. Crash reports never carry your tracks or scripts, and you can turn them off.'],
        ['iCloud sync', 'Your Library, projects and recordings on all your devices, in your own iCloud.'],
      ],
      alt: 'The same Lock Screen twice: “Become a Millionaire (2x)” playing, and as Discreet Mode shows it, “Afterglow Avenue” by Lucia Wren',
    },
  },

  chapters: {
    player: 'The Player',
    studio: 'The Studio',
  },

  download: {
    title: ['Play your subliminals.', 'Make your own.'],
    accent: 'your own',
    leadSoon: 'Inscrybe is coming to the App Store for iPhone, iPad and iPhone Duo, with CarPlay and Apple Watch.',
    leadLive: 'Inscrybe is on the App Store for iPhone, iPad and iPhone Duo, with CarPlay and Apple Watch.',
  },

  support: {
    title: 'Support',
    lead: 'Answers to what people ask most. For anything else, write to us.',
    contactTitle: 'Write to us',
    contactLead: 'Tell us what you were doing when it happened and which iPhone or iPad you use.',
    copy: 'Copy email address',
    copied: 'Email address copied',
    fromApp: 'From the app: Settings › Contact. With Include Device Information on, your message carries the details that help find a bug, never your tracks or scripts.',
    groups: [
      {
        title: 'Listening',
        items: [
          ['How do I bring my subliminals into Inscrybe?', 'In the Library, tap + and choose Import Files, Import Folder or Import from a Link. You can also open an audio file in Inscrybe from Files, AirDrop or the Share sheet. A link has to point to the file itself; streaming services aren’t supported.'],
          ['How do I repeat a track a set number of times?', 'In the player, tap Repeat, then under Repeat This Track choose a number of times or Custom…. With Then Play Next on, the next track plays after the last time; otherwise playback stops there.'],
          ['How does the sleep timer work?', 'Tap the moon in the player and choose a length in minutes, End of Track, End of Folder or End of Playlist, depending on what’s playing. The sound fades out at the end.'],
          ['Does the Apple Watch app play audio?', 'No. It’s a remote for your iPhone: it shows what’s playing, controls it and the sleep timer, and opens your Library and playlists. Your iPhone plays the audio.'],
        ],
      },
      {
        title: 'The Studio',
        items: [
          ['What does How Hidden measure?', 'How Hidden compares each voice in a project with the music and sounds over it and tells you where it sits: Clear, Murmur, Faint, Hidden or Buried. Tap a stop and the voice’s volume is set to reach it. It’s an estimate, so Can You Hear It? lets you check with your own ears.'],
          ['How do I save a project as a track?', 'In the project, tap Save to Library and choose the format. When you save it again after an edit, Inscrybe offers to replace that track, keeping its plays and its place in your Library.'],
        ],
      },
      {
        title: 'Privacy',
        items: [
          ['What does Discreet Mode change?', 'A disguised track shows a made-up name and cover in Inscrybe and outside it: on the Lock Screen, in CarPlay, in widgets, on Apple Watch, in Siri and in the names of files you share. Turn it on in Settings › Privacy › Discreet Mode, for Private Items or Everything. Show Real Names shows the real ones in Inscrybe until you leave the app.'],
          ['I forgot my App Lock PIN.', 'On the lock screen, tap Forgot PIN? and get back in with your device’s passcode or your recovery code, whichever you chose when you set up App Lock.'],
          ['What does Inscrybe collect?', 'Inscrybe has no analytics: nothing logs how you use the app. If it crashes, a report is sent without your track names, your scripts or anything about you. Turn off Share Crash Reports in Settings › Privacy to send none.'],
        ],
      },
      {
        title: 'Your account',
        items: [
          ['How do I use Inscrybe on all my devices?', 'Turn on Settings › iCloud Sync on each device signed in to the same Apple Account. Your Library, playlists, projects and recordings sync through your own iCloud, and audio downloads when it plays.'],
          ['How do I restore my subscription on a new device?', 'In Inscrybe, open Settings and tap Restore Purchases, signed in with the Apple Account you subscribed with.'],
          ['How do I change or cancel my subscription?', 'In Inscrybe, open Settings and tap Manage Subscription, or go to the Settings app, tap your name, then Subscriptions. Apple handles billing.'],
        ],
      },
    ],
  },

  footer: {
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    termsUrl: 'https://armandojimenez.dev/apps/inscrybe/terms.html',
    privacyUrl: 'https://armandojimenez.dev/apps/inscrybe/privacy-policy.html',
    copyright: '© 2026 Believe PR. All rights reserved.',
    made: 'Made by Armando Jimenez',
    madeUrl: 'https://armandojimenez.dev/',
    apple: 'Apple, the Apple logo, iPhone, iPad, Apple Watch, CarPlay and Siri are trademarks of Apple Inc.',
  },
};
