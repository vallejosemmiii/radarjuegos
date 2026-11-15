export default function StoreLogo({ storeName, size = 20 }) {
  const name = (storeName || '').toLowerCase();

  // Steam
  if (name.includes('steam')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
      </svg>
    );
  }

  // Epic Games
  if (name.includes('epic')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3.5 1.5h17v15.6L12 22.5l-8.5-5.4V1.5zm2 2v12.5l6.5 4.1 6.5-4.1V3.5h-13zm3.2 2.5h6.6v2.1h-4.2v2.1h3.6v2h-3.6v2.3h4.3v2.1H8.7V6z" />
      </svg>
    );
  }

  // GOG
  if (name.includes('gog')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3.2c3.76 0 6.8 3.04 6.8 6.8s-3.04 6.8-6.8 6.8-6.8-3.04-6.8-6.8S8.24 5.2 12 5.2zm0 2.6a4.2 4.2 0 100 8.4 4.2 4.2 0 000-8.4z" />
      </svg>
    );
  }

  // PlayStation / PSN
  if (name.includes('playstation') || name.includes('psn')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9.5 4.2v15.4l3.4 1.1V7.6c0-.6.3-1 .8-.8.6.2.7.7.7 1.3v5.4c2.2 1.1 3.9 0 3.9-2.9 0-3-1.1-4.3-4.3-5.4-1.2-.4-3-.9-4.5-1zm-1.2 11.9l-4.7 1.7c-1.4.5-1.6 1.3-.4 1.8 1.2.4 3.2.4 4.6-.1l.5-.2v-1.8l-.8.3c-.7.2-1.5.2-1.9 0-.4-.2-.2-.5.5-.7l2.2-.8v-1.2zm11.9-.6c-1.4-.4-3.3-.5-4.8-.1l-.9.3v1.8l1.6-.6c.7-.2 1.6-.2 2 0 .4.2.2.5-.5.8l-3.1 1.1v1.8l5.8-2.1c1.4-.5 1.6-1.3.4-1.8-.1-.1-.3-.2-.5-.2z" />
      </svg>
    );
  }

  // Xbox
  if (name.includes('xbox')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.102 21.033A11.947 11.947 0 0012 24a11.96 11.96 0 007.902-2.967c1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417zm11.16-14.406c2.5 2.961 7.484 10.313 6.076 12.912A11.942 11.942 0 0024 12.004a11.95 11.95 0 00-3.57-8.536s-.027-.022-.082-.042a.12.12 0 00-.072-.018c-.614-.034-2.267.233-5.014 3.219zM12 3.59S9.814 1.997 7.845 1.727c-.247-.034-.474-.022-.666.032A11.94 11.94 0 0112 .004c1.737 0 3.39.37 4.883 1.034-.19-.053-.417-.065-.664-.031C14.25 1.277 12 3.59 12 3.59zM8.738 6.627C5.992 3.64 4.338 3.374 3.724 3.408a.12.12 0 00-.072.018c-.055.02-.082.042-.082.042A11.95 11.95 0 000 12.004a11.942 11.942 0 002.662 7.535c-1.408-2.6 3.576-9.951 6.076-12.912z" />
      </svg>
    );
  }

  // Humble Store
  if (name.includes('humble')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-3.8 5.5h2.4v3.4h2.8V7.5h2.4v9h-2.4v-3.5h-2.8v3.5H8.2v-9z" />
      </svg>
    );
  }

  // GreenManGaming
  if (name.includes('greenman')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c4.84 0 8.87-3.44 9.8-8h-9.8v-3h12.8c.13.65.2 1.32.2 2 0 6.63-5.37 12-12 12S0 18.63 0 12 5.37 0 12 0c3.18 0 6.07 1.24 8.22 3.26l-2.12 2.12A8.96 8.96 0 0012 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.28 0 7.86-2.99 8.77-7H12v-3h9.95" />
      </svg>
    );
  }

  // Fanatical
  if (name.includes('fanatical')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 2S14 6.5 11 9.5C9.2 11.3 8 13.1 8 15.2 8 18.9 10.9 22 14.5 22c3.1 0 5.5-2.3 5.5-5.5 0-3.4-2.5-5.6-4.2-7.5-.4 1.5-1.3 2.3-2.3 2.3 1.4-2.8.8-6.6 0-9.3zM6.5 12.5C5.2 13.8 4.5 15.4 4.5 17c0 2.5 1.8 4.5 4.2 4.9-1.4-1.3-2.2-3.1-2.2-5.1 0-1.6.4-3 1-4.3h-1z" />
      </svg>
    );
  }

  // Prime Gaming / Amazon
  if (name.includes('prime') || name.includes('amazon')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 7l4.5 4.5L12 6l4.5 5.5L21 7l-2 11H5L3 7zm2.5 12.5h13v1.5h-13v-1.5z" />
      </svg>
    );
  }

  // Ubisoft / Uplay
  if (name.includes('ubisoft') || name.includes('uplay')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M12 6.5a5.5 5.5 0 11-4.8 8.2 3.2 3.2 0 104.5-4.3" strokeLinecap="round" />
      </svg>
    );
  }

  // EA App / Origin
  if (name.includes('ea ') || name.includes('origin')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-6.5 7h5.2l-.9 1.8H7.2l-.7 1.4h2.5l-.8 1.6H5.7l-.7 1.4h4.7L8.8 17H3.5l2-8zm8.3 0h2.1l3.3 8h-2.1l-.6-1.6h-3.1l-.7 1.6H11l2.8-8zm1.1 2.5l-.9 2.2h1.8l-.9-2.2z" />
      </svg>
    );
  }

  // Battle.net
  if (name.includes('battle')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-35 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(35 12 12)" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </svg>
    );
  }

  // Ícono genérico de tienda / mando para el resto
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 6a5 5 0 00-4.9 4.02l-1.02 5.1A3.5 3.5 0 004.51 19.5c1.18 0 2.29-.58 2.95-1.56L8.75 16h6.5l1.29 1.94a3.55 3.55 0 002.95 1.56 3.5 3.5 0 003.43-4.38l-1.02-5.1A5 5 0 0017 6H7zm1 3h1.5v1.5H11V12H9.5v1.5H8V12H6.5v-1.5H8V9zm8.25.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm-2 2a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
    </svg>
  );
}
