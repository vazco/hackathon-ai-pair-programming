import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pl: {
    translation: {
      title: 'Loteria Pair Programming',
      subtitle: 'Generuj losowe pary do sesji pair programming',
      gambleButton: 'Losuj!',
      generating: 'Losowanie...',
      clickToGenerate: 'Kliknij przycisk Losuj, aby wybrać losową parę',
      noUsersProvided:
        'Brak użytkowników. Dodaj parametr ?users= z zakodowaną listą użytkowników.',
      pairingHistory: 'Historia Parowań',
      completed: 'Ukończone',
      regamble: 'Losuj ponownie',
      undo: 'Cofnij',
      markCompleted: 'Oznacz jako ukończone',
      mark: 'Oznacz',
      manage: 'Zarządzaj',
      justNow: 'Przed chwilą',
      minutesAgo: '{{count}} min temu',
      hoursAgo: '{{count}} godz. temu',
      daysAgo: '{{count}} dni temu',
      toggleTheme: 'Przełącz motyw',
      failedToGenerate: 'Nie udało się wygenerować pary. Spróbuj ponownie.',
      failedToRegamble: 'Nie udało się ponownie wylosować. Spróbuj ponownie.',
      failedToMarkCompleted:
        'Nie udało się oznaczyć jako ukończone. Spróbuj ponownie.',
      failedToUndoCompletion: 'Nie udało się cofnąć. Spróbuj ponownie.',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pl',
  fallbackLng: 'pl',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
