import { theme } from "../../common/common";

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  variant = "danger",
  loading = false,
}) => {

  if (!open) {
    return null;
  }

  const buttonStyle =
    variant === "danger"
      ? theme.buttons.danger
      : theme.buttons.primary;

  return (
    <div className={theme.backdrop.modal}>

      <div
        className={`
        ${theme.cards.modal}
        ${theme.animations.modal}
        w-full
        max-w-md
        `}
      >

        <h2
          className="
          text-2xl
          font-bold
          mb-4
          "
        >
          {title}
        </h2>

        <p
          className="
          text-gray-600
          mb-8
          "
        >
          {message}
        </p>

        <div
          className="
          flex
          gap-3
          "
        >

          <button
            onClick={onClose}
            className={`
            ${theme.buttons.outline}
            flex-1
            py-3
            rounded-2xl
            `}
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className={`
            ${buttonStyle}
            flex-1
            py-3
            rounded-2xl
            `}
          >
            {loading
              ? "Processing..."
              : confirmText}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmationModal;