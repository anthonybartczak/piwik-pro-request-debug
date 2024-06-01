import React, { useState } from "react";
import parseQueryString from "./utils/parseQueryString";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ParameterDisplay from "./components/ParameterDisplay";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Copy } from "lucide-react";

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
    <div className="mx-10 my-10 flex min-w-full flex-col justify-center gap-y-4 px-8">
      <ScrollToTopButton />
      <form
        onSubmit={handleSubmit}
        className="flex min-w-full flex-row justify-center gap-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter Piwik PRO query string"
          className="w-full min-w-max rounded border border-slate-800 p-3"
        />
        <button
          type="submit"
          className="rounded-sm bg-gray-900 px-12 text-white shadow-md transition duration-300 hover:bg-slate-600"
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
            className="cursor-pointer rounded-sm bg-slate-900 font-mono text-sm text-slate-300 hover:bg-slate-950"
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
          <div className="flex w-fit flex-row items-center gap-x-2 rounded-md bg-slate-900 px-2.5 py-1">
            <h1 className="font-mono text-sm text-gray-300">
              Query string output
            </h1>
            <Button
              className="border-none bg-slate-950 p-5 text-sm hover:bg-slate-800"
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
            className="min-h-fit w-full min-w-max resize-none rounded-sm border border-slate-800 p-3 font-mono shadow-md scrollbar-thin hover:resize-y"
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
