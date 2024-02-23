import React from "react";
import { DevTools } from "../../../shared/utils/Global-Utils";

const InfinityScroll = () => {
  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden">
      <ul className="infinity flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
        {DevTools.map((tool) => {
          return (
            <li key={tool.id} className="mx-8 cursor-pointer">
              <img
                className={`w-14 h-14 grayscale object-fill hover:grayscale-0 ${tool?.className}`}
                src={tool.icon}
                alt={tool.name}
                title={tool.name}
              />
            </li>
          );
        })}
      </ul>
      <ul
        className="infinity flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true"
      >
        {DevTools.map((tool) => {
          return (
            <li key={tool.id} className="mx-8 cursor-pointer">
              <img
                className={`w-14 h-14 grayscale object-fill hover:grayscale-0 ${tool?.className}`}
                src={tool.icon}
                alt={tool.name}
                title={tool.name}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default InfinityScroll;
