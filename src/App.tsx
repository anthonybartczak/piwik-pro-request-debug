import React, { useState } from 'react';
import parseQueryString from './utils/parseQueryString';
import ScrollToTopButton from './components/ScrollToTopButton';
import ParameterDisplay from './components/ParameterDisplay';
import { Badge } from './components/ui/badge';
import { Button } from "./components/ui/button"
import { Copy } from 'lucide-react';


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
        <button type="submit" className="bg-gray-900 text-white rounded px-12">
          Submit
        </button>
      </form>
      <div id="badges-container" className="flex flex-row flex-wrap gap-1 justify-stretch">
        {parsedQueryString.map((param) => (
          <Badge
            key={param.name}
            className="text-slate-300 font-mono cursor-pointer text-sm rounded-sm bg-slate-900 hover:bg-slate-950"
            onClick={() => {
              const element = document.getElementById(param.name);
              element?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
          >
            {param.name}
          </Badge>
        ))}
      </div>
      {parsedQueryString.length > 0 && (
        <div id="modified-query-string" className='flex flex-col gap-y-2'>
          <div className='flex flex-row gap-x-2 bg-slate-900 w-fit rounded-md px-2.5 py-1 items-center'>
            <h1 className='text-sm font-mono text-gray-300'>Query string output</h1>
            <Button className='p-5 text-sm bg-slate-950 border-none hover:bg-slate-800' onClick={() => {
              const element = document.getElementById("modified-query-string-output") as HTMLInputElement;
              if (element) {
                navigator.clipboard.writeText(element.value);
              }
            }}><Copy className='h-4 w-4'/></Button>
          </div>
          <textarea id="modified-query-string-output" className='resize-none hover:resize-y font-mono scrollbar-thin min-w-max w-full min-h-fit p-3 border border-slate-800 shadow-md rounded-sm' readOnly
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
