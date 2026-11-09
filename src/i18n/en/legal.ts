/** Privacy — describes what the app actually does (keep in sync with de/legal.ts!). */
export const privacyStrings = {
  title: 'Privacy',
  intro:
    'Heirloom Garden runs entirely on your device. There is no user account and no game server.',
  sections: [
    {
      heading: 'What is stored',
      body: 'Your progress, Grandma’s notebook, settings (e.g. sound on/off, language) and the install notice are stored only in your browser’s local storage (localStorage). This data never leaves your device.',
    },
    {
      heading: 'No tracking',
      body: 'No analytics, advertising or tracking services are used, and no cookies are set. Fonts and graphics ship with the app and are not loaded from third parties.',
    },
    {
      heading: 'Playtest log',
      body: 'During the test phase, the first time you start the installed app you are asked whether the playtest log may run (preselected, you can untick it). Otherwise it is off and can be switched on in the menu. Everything is collected on your device only: which game actions you take and when, sessions, play time and one progress snapshot per day. You can switch the log off, export it or delete it at any time. Nothing is transmitted automatically.',
    },
    {
      heading: 'Hosting',
      body: 'The web version is served via GitHub Pages. When you load it, GitHub processes technically necessary connection data (e.g. your IP address) in server logs. Details: GitHub Privacy Statement.',
    },
    {
      heading: 'Deleting',
      body: 'You can remove all data at any time by clearing the website data in your browser or by uninstalling the installed app.',
    },
  ],
}
