import React, { useState } from "react";
import parseQueryString from "./utils/parseQueryString";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ParameterDisplay from "./components/ParameterDisplay";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Switch } from "./components/ui/switch";

import {
  Copy,
  Github,
  Info,
  Settings2,
  Linkedin,
  CircleUser,
} from "lucide-react";

type ParsedQueryString = {
  name: string;
  value: string;
};

const App: React.FC = () => {
  const defaultString =
    import.meta.env.VITE_IS_DEV === "true"
      ? import.meta.env.VITE_DUMMY_QUERY_STRING
      : "action_name=hey%20there!";

  const [input, setInput] = useState<string>(defaultString);
  const [parsedQueryString, setParsedQueryString] = useState<
    ParsedQueryString[]
  >([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedQueryString = parseQueryString(input);

    const convertedParams = parsedQueryString.map((param) => ({
      name: param.name,
      value: param.value,
    }));

    setParsedQueryString(convertedParams);
  };

  return (
    <div className="mt-10 flex min-w-full flex-col justify-center gap-y-2 px-8">
      <ScrollToTopButton />
      {parsedQueryString.length === 0 && (
        <div className="flex flex-row gap-x-2">
          <div className="flex w-3/4 flex-col gap-y-2 text-wrap rounded-sm border border-slate-700/[.65] bg-slate-900 p-4 shadow-md">
            <div className="flex flex-row items-center gap-x-1">
              <Info className="h-5 w-5" />
              <span>What is this?</span>
            </div>
            <Separator decorative className="bg-gray-800" />
            <p className="font-thin">
              Request Debugger is a simple web application designed to assist
              users in debugging and troubleshooting requests made to the Piwik
              PRO HTTP Tracking API. It provides a user-friendly interface that
              allows to easily analyze and visualize the details of API
              requests.
            </p>
          </div>
          <div className="flex w-1/4 flex-col gap-y-2 rounded-sm border border-slate-700/[.65] bg-slate-900 p-4 shadow-md">
            <div className="flex flex-row items-center gap-x-1">
              <CircleUser className="h-5 w-5" />
              <span>Contact me</span>
            </div>
            <Separator decorative className="bg-gray-800" />
            <ul className="flex flex-col gap-y-2">
              <li className="flex gap-x-2">
                <Github className="h-5 w-5" />
                <a href="https://github.com/anthonybartczak/piwik-pro-request-debug">
                  Github
                </a>
              </li>
              <li className="flex gap-x-2">
                <Linkedin className="h-5 w-5" />
                <a href="https://www.linkedin.com/in/antoni-bartczak-525187183/">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
      <div>
        <div className="flex flex-col gap-y-2 rounded-sm border border-slate-700/[.65] bg-slate-900 p-4 shadow-md">
          <div className="flex flex-row items-center gap-x-1">
            <Settings2 className="h-5 w-5" />
            <span>Settings</span>
          </div>
          <Separator decorative className="bg-gray-800" />
          <div className="flex flex-row">
            <Switch defaultChecked className="" />
            <span className="ml-2 font-thin">Save the query string</span>
          </div>
          <div className="flex flex-row">
            <Switch disabled checked={false} className="" />
            <span className="ml-2 font-thin">
              Validate parameter values (WIP)
            </span>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex min-w-full flex-row justify-center gap-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter Piwik PRO query string"
          className="w-full min-w-max rounded border border-slate-700/[.65] p-3 font-mono"
        />
        <button
          type="submit"
          className="rounded-sm border border-slate-700/[.65] bg-gray-900 px-12 text-white shadow-md transition duration-300 hover:bg-slate-600"
        >
          Submit
        </button>
      </form>
      <div
        id="badges-container"
        className="flex flex-row flex-wrap justify-stretch gap-1"
      >
        {parsedQueryString.map((param) => (
          <Badge
            key={param.name}
            className="cursor-pointer rounded-sm border border-slate-700/[.65] bg-slate-900 font-mono text-sm text-slate-300 hover:bg-slate-950"
            onClick={() => {
              const element = document.getElementById(param.name);
              element?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            {param.name}
          </Badge>
        ))}
      </div>
      {parsedQueryString.length > 0 && (
        <div id="modified-query-string" className="flex flex-col gap-y-2">
          <div className="flex w-fit flex-row items-center gap-x-2 rounded-sm border border-slate-700/[.65] bg-slate-900 py-1 pl-4 pr-2">
            <h1 className="text-sm text-gray-300">Query string output</h1>
            <Button
              className="bg-slate-950 p-5 hover:bg-slate-800"
              onClick={() => {
                const element = document.getElementById(
                  "modified-query-string-output",
                ) as HTMLInputElement;
                if (element) {
                  navigator.clipboard.writeText(element.value);
                }
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <textarea
            id="modified-query-string-output"
            className="min-h-fit w-full min-w-max resize-none rounded-sm border border-slate-700/[.65] p-3 font-mono shadow-md scrollbar-thin hover:resize-y"
            readOnly
            value={parsedQueryString
              .map((param) => `${param.name}=${param.value}`)
              .join("&")}
          ></textarea>
        </div>
      )}
      <div className="flex flex-col gap-y-2">
        <ParameterDisplay
          parsedQueryString={parsedQueryString}
          setParsedQueryString={setParsedQueryString}
        />
      </div>
    </div>
  );
};

export default App;
