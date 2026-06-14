const Spinner = ({ size = "h-5 w-5" }) => {
  return (
    <div
      className={`
        ${size}
        border-2
        border-white/30
        border-t-white
        rounded-full
        animate-spin
      `}
    />
  );
};

export default Spinner;