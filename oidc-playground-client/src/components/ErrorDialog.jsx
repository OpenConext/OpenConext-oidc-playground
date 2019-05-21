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
      <section className="dialog-header error">Error</section>
      <section className="dialog-content">
        <h2>Things broke.</h2>
      </section>
      <section className="dialog-buttons">
        <button className="button white error" onClick={e => close(e)}>
          OK
        </button>
      </section>
    </Modal>
  );
}
