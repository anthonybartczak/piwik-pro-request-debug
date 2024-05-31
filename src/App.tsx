import React, { useState } from 'react';
import parseQueryString from './utils/parseQueryString';
import ScrollToTopButton from './components/ScrollToTopButton';
import ParameterDisplay from './components/ParameterDisplay';
import { Badge } from './components/ui/badge';
import { Button } from "./components/ui/button"

type ParsedQueryString = {
  name: string;
  value: string;
};

const App: React.FC = () => {

  const defaultString = (import.meta.env.VITE_IS_DEV === 'true') ? import.meta.env.VITE_DUMMY_QUERY_STRING : 'action_name=hey%20there!';

  const [input, setInput] = useState<string>(defaultString);
  const [parsedQueryString, setParsedQueryString] = useState<ParsedQueryString[]>([]);

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
    <div className="flex flex-col my-10 px-8 mx-10 justify-center gap-y-4 min-w-full">
      <ScrollToTopButton />
      <form onSubmit={handleSubmit} className="flex flex-row gap-x-2 justify-center min-w-full">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter Piwik PRO query string"
          className="p-3 border border-slate-800 rounded min-w-max w-full"
        />
        <button type="submit" className="bg-blue-700 text-white rounded px-12">
          Submit
        </button>
      </form>
      <div id="badges-container" className="flex flex-row flex-wrap gap-1 justify-stretch">
        {parsedQueryString.map((param) => (
          <Badge
            key={param.name}
            className="cursor-pointer text-sm rounded-md bg-slate-900 hover:bg-slate-800"
            onClick={() => {
              const element = document.getElementById(param.name);
              element?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
          >
            {param.name}={decodeURIComponent(param.value)}
          </Badge>
        ))}
      </div>
      {parsedQueryString.length > 0 && (
        <div id="modified-query-string" className=''>
          <div className='flex flex-row gap-x-2'>
            <h1 className='text-xl my-2'>Modified query string</h1>
            <Button className='p-2 text-sm h-auto' onClick={() => {
              const element = document.getElementById("modified-query-string-output") as HTMLInputElement;
              if (element) {
                navigator.clipboard.writeText(element.value);
              }
            }}>Copy</Button>
          </div>
          <textarea id="modified-query-string-output" className='min-w-max w-full min-h-fit p-3 border border-slate-800 rounded' readOnly
            value={parsedQueryString.map((param) => `${param.name}=${param.value}`).join('&')}>
          </textarea>
        </div>
      )}
      <div className="flex flex-col gap-y-2">
        <ParameterDisplay parsedQueryString={parsedQueryString} setParsedQueryString={setParsedQueryString} />
      </div>
    </div>
  );
};

export default App;
