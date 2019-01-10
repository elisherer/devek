import { h } from 'hyperapp';
import cc from 'classcat';
import Card from '../Card';
import { getInput } from '../../actions/text';
import { Redirect, Link } from '@hyperapp/router';
import styles from './PageText.less';
import textFunctions from './text';

function stripFormattingOnPaste(e) {
  const cbData = (e.originalEvent && e.originalEvent.clipboardData) || e.clipboardData;
  if (cbData && cbData.getData) {
    e.preventDefault();
    const text = cbData.getData('text/plain');
    window.document.execCommand('insertText', false, text);
  }
}

export default ({ location, match }) => (state, actions) => {
  const handleChange = e => {
    actions.text.set(e.target.innerText);
  };
  const input = getInput(state);

  const ctf = location.pathname.substring(match.path.length + 1);
  let output, error = null;
  try {
    output = ctf ? textFunctions[ctf].func(input) : null;
  }
  catch (e) {
    error = e.message;
  }

  if (match.isExact) {
    return <Redirect to="/text/uppercase"/>;
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span>Case</span>
        <span>URL</span>
        <span>HTML</span>
        <span>Base64</span>
        <span>Base36</span>
      </nav>
      <nav className={cc([styles.nav, styles.radio])}>
        {Object.keys(textFunctions).map(tf => {
          const current = location.pathname,
            href = '/text/' + tf;
          const active = current === href || current.startsWith(href + '/');
          return (
            <Link key={tf}
                  className={active ? styles.active : undefined}
                  to={href}>
              {textFunctions[tf].button}
            </Link>
          );
        })}
      </nav>

      <Card title={"Text > " + textFunctions[ctf].title}>
        <label>Input:</label>
        <section className={styles.textarea}>
          <pre contentEditable oninput={handleChange} onpaste={stripFormattingOnPaste}/>
        </section>
        <div className={styles.input_info}>
          <sup>Length: {input.length}</sup>
        </div>

        <label>Output:</label>
        <section className={cc([styles.textarea, styles.readonly])}>
          <pre className={cc({[styles.error]: error})} innerText={error || output} />
        </section>
        <div className={styles.input_info}>
          <sup innerHTML={!error && output.length > 0 ? "Length: " + output.length : "&nbsp;"} />
        </div>
      </Card>

  </div>
  );
}