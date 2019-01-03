import { h } from 'hyperapp';
import { isSubmitting, handleSubmit } from 'hyperapp-forms';
import Textbox from './Textbox';
import Checkbox from './Checkbox';

import styles from './LoginForm.less';

/**
 * Sign-in action
 */
const signIn = (values, actions) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (values.username === 'test') {
      actions.login.login();
      resolve();
    }
    else {
      reject({ username: 'Not "test"!'});
    }
  }, 2000);
});

/**
 * Validate Function
 */
const validate = (form, name, values) => {

  let errors = null;

  const usernameInvalid = !/^t/.test(values.username);
  if (usernameInvalid) {
    if (!errors) errors = {};
    errors.username = 'not starting with t!';
  }

  const passwordInvalid = !values.password;
  if (passwordInvalid) {
    if (!errors) errors = {};
    errors.password = 'password is required!';
  }

  return errors; // if everything is valid, returns null
};


export default () => (state, actions) => {

  const submitting = isSubmitting(state, 'login');

  return (
    <div data-name="LoginForm">
      <form className={styles.form} onsubmit={handleSubmit(state, actions, 'login', signIn)}>

        <h2>Login to your account:</h2>

        <Textbox type="text" form="login" name="username" title="Username" disabled={submitting} validate={validate}/>
        <Textbox type="password" form="login" name="password" title="Password" disabled={submitting} validate={validate}/>
        <br />
        <br />
        <Checkbox form="login" name="rememberMe" title="Remember me" disabled={submitting}/>

        <button disabled={submitting}>Sign In</button>

        {submitting && <div data-loader />}

      </form>
    </div>
  );
}