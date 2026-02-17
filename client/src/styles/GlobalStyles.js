import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  html {
    color-scheme: ${({ theme }) => theme.colorScheme};
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${({ theme }) => theme.fontFamily};
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.bg};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, select {
    font-family: inherit;
    font-size: 1rem;
  }

  @media print {
    nav, footer,
    [data-print-hide] {
      display: none !important;
    }

    main {
      padding: 0 !important;
    }

    body {
      background: #fff !important;
      color: #000 !important;
      font-size: 11pt;
      line-height: 1.4;
    }

    a {
      color: #000;
      text-decoration: none;
    }

    [data-print-section] {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    [data-print-section] h2 {
      break-after: avoid;
      page-break-after: avoid;
    }

    [data-print-row] {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;

export default GlobalStyles;
