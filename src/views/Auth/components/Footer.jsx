import React from "react";

export default function Footer(props) {
  return (
    <footer className="fixed bottom-0 left-0 py-2 bg-light-background dark:bg-dark-background flex items-center justify-center w-full">
      <span>Inmersoft &copy; {new Date().getFullYear()}</span>
    </footer>
  );
}
