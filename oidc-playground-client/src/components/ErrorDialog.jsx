import React from "react";
import Modal from "react-modal";
import "./ErrorDialog.scss";

export function ErrorDialog({ isOpen = false, close }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      className="confirmation-dialog-content"
      overlayClassName="confirmation-dialog-overlay"
      ariaHideApp={false}
    >
      <section className="dialog-header error">Unexpected error</section>
      <section className="dialog-content">
        <h2>
          This is embarrassing; an unexpected error has occurred. It has been
          logged and reported. Please try again.
        </h2>
      </section>
      <section className="dialog-buttons">
        <button className="button white error" onClick={e => close(e)}>
          Close
        </button>
      </section>
    </Modal>
  );
}
