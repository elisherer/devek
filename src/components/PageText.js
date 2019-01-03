import { h } from 'hyperapp';
import { getInput } from '../actions/text';
import { Redirect } from '@hyperapp/router';
import Badge from './Badge';
import styles from './PageText.less'

const spanEl = document.createElement('span');
const areaEl = document.createElement('textarea');

const textFunctions = {
  lowercase: { title: 'lowercase', func: input => input.toLowerCase() },
  uppercase: { title: 'UPPERCASE', func: input => input.toUpperCase() },
  urlencode: { title: 'URL Encode', func: input => encodeURIComponent(input)  },
  urldecode: { title: 'URL Decode', func: input => decodeURIComponent(input)  },
  htmlencode: { title: 'HTML Encode', func: input => { spanEl.textContent = input; return spanEl.innerHTML; }},
  htmldecode: { title: 'HTML Decode', func: input => { areaEl.innerHTML = input; return areaEl.value; }},
  base64encode: { title: 'Base64 Encode', func: input => btoa(input) },
  base64decode: { title: 'Base64 Decode', func: input => atob(input) },
  base36encode: { title: 'Base36 Encode', func: input => parseInt(input, 36) },
  base36decode: { title: 'Base36 Decode', func: input => parseInt(input).toString(36) },
};

Object.keys(textFunctions).forEach(tf => {
  textFunctions[tf].goto = Redirect({ to: '/text/' + tf });
});

export default ({ location, match }) => (state, actions) => {
  const handleChange = e => actions.text.set(e.target.innerText);
  const input = getInput(state);

  const ctf = location.pathname.substring(match.path.length + 1);
  let output, error = null;
  try {
    output = ctf ? textFunctions[ctf].func(input) : null;
  }
  catch (e) {
    error = e.message;
  }

  return (
    <div>
      <h1>Text</h1>
      <section className={styles.input_wrap }>
        <pre contentEditable
               oninput={handleChange}
        />
        <div className={styles.input_info}>
          <sub>Length: {input.length}</sub>
        </div>
      </section>
      <section>
        {Object.keys(textFunctions).map(tf => (
          <Badge active={ctf === tf}
            onclick={() => textFunctions[tf].goto(state, actions)}>
            {textFunctions[tf].title}
          </Badge>
        ))}
      </section>
      <h3>Output</h3>
      {!match.isExact && (
      <section className={styles.input_wrap}>
        <pre className={error && styles.error}>{error || output}</pre>
        {!error && (<div className={styles.input_info}>
          <sub>Length: {output.length}</sub>
        </div>)}
      </section>
      )}
    </div>
  );
}