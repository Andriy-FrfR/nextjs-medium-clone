const PageLoader = () => {
  return (
    <>
      <div className="loader" />
      <style jsx>{`
        .loader {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100vh;
          max-width: 200px;
          margin: 0 auto;
        }
        .loader:before,
        .loader:after {
          content: '';
          position: absolute;
          border-radius: 50%;
          animation: pulsOut 1s ease-in-out infinite;
          filter: drop-shadow(0 0 1rem rgba(0, 0, 0, 0.75));
        }
        .loader:before {
          width: 100%;
          padding-bottom: 100%;
          box-shadow: inset 0 0 0 1rem #000;
          animation-name: pulsIn;
        }
        .loader:after {
          width: calc(100% - 2rem);
          padding-bottom: calc(100% - 2rem);
          box-shadow: 0 0 0 0 #000;
        }

        @keyframes pulsIn {
          0% {
            box-shadow: inset 0 0 0 1rem #000;
            opacity: 1;
          }
          50%,
          100% {
            box-shadow: inset 0 0 0 0 #000;
            opacity: 0;
          }
        }

        @keyframes pulsOut {
          0%,
          50% {
            box-shadow: 0 0 0 0 #000;
            opacity: 0;
          }
          100% {
            box-shadow: 0 0 0 1rem #000;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default PageLoader;
