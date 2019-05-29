import {h, app} from 'hyperapp';

import styles from './Modal.less';

const Modal = (props, children) => (state) => {
  const {
    key,
    className,
    overlayClassName,
    contentClassName,
    onRequestClose,
    onOverlayClick,
    title,
    hideTitle
  } = props;

  const view = () => (
    <div class={(className || "") + " " + styles.modal} role="dialog" aria-labelledby="modal__title" aria-describedby="modal__content">
      {!hideTitle && <div id="modal__title" class={styles.title}>{title}</div>}
      {onRequestClose && <i class={`${styles.close}`} onclick={onRequestClose} title="Close" />}
      <div id="modal__content" class={(contentClassName || "") + " " + styles.content}>
        {children}
      </div>
    </div>
  );

  return (
    <div
      key={key || 'portal'}
      oncreate={element => {
        const overlay = document.createElement('div');
        overlay.className = styles.overlay + (overlayClassName ? ' ' + overlayClassName : '');
        if (onOverlayClick) {
          overlay.onclick = e => e.target === overlay && onOverlayClick();
        }
        const portal = {
          state,
          actions: { update: () => ({}) },
          view,
          container: document.body.appendChild(overlay)
        };
        portal.app = app(
          portal.state,
          portal.actions,
          () => portal.view,
          portal.container
        );
        element.portal = portal;
      }}
      onupdate={element => {
        const portal = element.portal;
        portal.view = view;
        portal.app.update();
      }}
      ondestroy={element => {
        const portal = element.portal;
        portal.view = () => null;
        portal.app.update();
        portal.container.parentNode.removeChild(portal.container);
        element.portal = null;
      }}
    />
  );
};

export default Modal;