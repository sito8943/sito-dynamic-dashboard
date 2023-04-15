import React from "react";

const Empty = (props) => {
  const { text } = props;

  return (
    <div className="w-full h-full p-error flex flex-col items-center justify-center gap-10">
      <p className="text-red-color perror text-center">{text}</p>
    </div>
  );
};

export default Empty;
