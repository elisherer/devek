import { createGlobalStyle } from 'styled-components';
import DevekWatermark from '../assets/devek_watermark.svg';

const GlobalStyle = createGlobalStyle`

* {
  box-sizing : border-box;
}

html, body {
  margin: 0;
  padding: 0;
  background: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.foregroundColor};
}

html, body, input, textarea, keygen, select, option, button {
  font: ${({ theme }) => theme.nativeFont};
  font-weight: 360;
}

code {
  background-color: ${({ theme }) => theme.codeBackground};
}

::placeholder {
  color: ${({ theme }) => theme.inputPlaceholder};
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: ${({ theme }) => theme.scrollbarColor};
  border-radius: 4px;
}
::-webkit-scrollbar, ::-webkit-scrollbar-track {
  background-color: transparent;
}

hr {
  border: none;
  height: 1px;
  background: #bbbbbb;
}

/* generic inputs */
input[type=date], input[type=color], select {
  color: ${({ theme }) => theme.foregroundColor};
  background: ${({ theme }) => theme.inputBackground};
  border: 1px solid ${({ theme }) => theme.greyBorder};
  outline: none;
  padding: 4px;
  border-radius: 4px;
  &:focus {
    border-color: ${({ theme }) => theme.secondaryColor};
  }
}
input[type=color] {
  padding: 0 2px;
}
/* range */

input[type=range] {
  max-width: 200px;
  -webkit-appearance: none;
  margin: 0 10px;
  background: transparent;
  &:focus {
    outline: none;
  }
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: #cccccc;
}
input[type=range]::-webkit-slider-thumb {
  height: 16px;
  width: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.secondaryColor};
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -6px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #d9d9d9;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  background: #cccccc;
}
input[type=range]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 20px;
  background: ${({ theme }) => theme.secondaryColor};
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #bfbfbf;
}
input[type=range]::-ms-fill-upper {
  background: #cccccc;
}
input[type=range]::-ms-thumb {
  height: 20px;
  width: 20px;
  border-radius: 20px;
  background: ${({ theme }) => theme.secondaryColor};
  cursor: pointer;
}
input[type=range]:focus::-ms-fill-lower {
  background: #cccccc;
}
input[type=range]:focus::-ms-fill-upper {
  background: #d9d9d9;
}

button {
  background: ${({ theme }) => theme.buttonBackground};
  width: auto;
  border: none;
  cursor: pointer;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1em;
  font-weight: 400;
  transition: box-shadow 0.2s;
  outline: none;
  position: relative;
  &:hover, &:active, &:focus {
    background: ${({ theme }) => theme.buttonHoverBackground};
  }
  &[disabled] {
    background: ${({ theme }) => theme.buttonDisabled};
    color: ${({ theme }) => theme.buttonDisabledText};
    cursor: default;
  }
  /* button with class="icon" */
  &.icon {
    fill: white;
    padding: 8px;
    width: 40px;
    height: 40px;
  }
  /* button with class="tool" */
  &.tool {
    background: white;
    padding: 8px;
    border: 1px solid ${({ theme }) => theme.greyBorder};
    width: 40px;
    height: 40px;
    &:hover, &:active, &:focus {
      border-color: ${({ theme }) => theme.secondaryColor};
    }
    &[disabled] {
      border-color: #444444;
      opacity: 0.3;
    }
  }
}

kbd {
  background-color: #fafbfc;
  border: 1px solid #d1d5da;
  border-bottom-color: #c6cbd1;
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 #c6cbd1;
  color: #444455;
  display: inline-block;
  font: 11px ${({ theme }) => theme.fontMono};
  line-height: 10px;
  padding: 3px 5px;
  vertical-align: middle;
  cursor: pointer;
}

.emoji {
  font-family: "Apple Color Emoji","Segoe UI Emoji","NotoColorEmoji","Segoe UI Symbol","Android Emoji","EmojiSymbols",sans-serif;
}

#root {
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: row;

  > main {
    flex: 1;
    flex-direction: column;
    display : flex;
    position: relative;
    max-width: 100%;
    @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
      max-width: calc(100% - ${({ theme }) => theme.navWidth});
      background: url(${DevekWatermark}) 98% 98% no-repeat;
      background-size: 15vw;
    }

    > header {
      min-height: '54px';
      h1 {
        margin: 12px 0 0 56px;
        font-size: 20px;
        @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
          font-size: 22px;
          margin-left: 20px;
        }
        svg {
          display: none;
          fill: ${({ theme }) => theme.foregroundColor};
          @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
            vertical-align: middle;
            margin-right: 10px;
            padding-bottom: 6px;
            display: initial;
          }
        }
      }
    }
    > article {
      flex: 1;
      height: 100%;
      overflow: auto;
      > div {
        padding: 10px;
        width: 100%;
        background: ${({ theme }) => theme.cardBackground};
        position: relative;

        @media only screen and (min-width: ${({ theme }) => theme.screenDesktopMin}) {
          width: fit-content;
          max-width: calc(100% - 40px);
          min-width: calc(${({ theme }) => theme.screenDesktopMin} - ${({ theme }) => theme.navWidth} - 40px);
          padding: 20px;
          margin: 20px;
          box-shadow: ${({ theme }) => theme.cardShadow};
          border-radius: 10px;
        }
        @media only screen and (min-width: 1024px) {
          min-width: 768px;
        }
      }

      h1 {
        color: ${({ theme }) => theme.headerColor};
        padding: 0 0 4px;
        margin: 0 0 16px;
        font-size: 20px;
        font-weight: bold;
      }
      * + h1 {
        margin-top: 16px;
      }
      label {
        display: block;
        margin-bottom: 6px;
      }
    }
  }
}
`

export default GlobalStyle;