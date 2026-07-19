import "@testing-library/jest-dom/vitest";

if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };

  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
  };

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    document
      .querySelector<HTMLDialogElement>("dialog[open]")
      ?.dispatchEvent(new Event("cancel", { cancelable: true }));
  });
}
