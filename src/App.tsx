import React, { useState } from 'react';
import parseQueryString from './utils/parseQueryString';
import ParameterDisplay from './components/ParameterDisplay';
import { Badge } from "./components/ui/badge"

const App: React.FC = () => {
  const [input, setInput] = useState<string>('action_name=Antoni%20Bartczak%20%7C%20Web%20Analytics%20%26%20App%20Dev&idsite=44d572e2-70d8-48dc-85c5-a33c68e36c50&rec=1&r=071186&h=1&m=39&s=5&url=https%3A%2F%2Fwww.anteriam.pl%2F&_id=ac9223a0ee34a41c&_idts=1709667088&_idvc=35&_idn=0&_viewts=1716075539&send_image=0&ts_n=jstc_tm&ts_v=2.20.1&pdf=1&qt=0&realp=0&wma=0&dir=0&fla=0&java=0&gears=0&ag=0&cookie=1&res=2328x1310&dimension2=&gt_ms=35&pv_id=ddo4Ev');
  const [parsedQueryString, setParsedQueryString] = useState<{ name: string; value: string; }[]>([]);

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
    <div className='flex flex-col my-10 mx-10 justify-center gap-y-4'>
      <form onSubmit={handleSubmit} className='flex flex-row gap-x-2'>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter Piwik PRO query string"
          className="p-3 border border-slate-800 rounded"
        />
        <button type="submit" className="bg-blue-700 text-white rounded">
          Submit
        </button>
      </form>
      <div id="badges-container" className='flex flex-row flex-wrap gap-1 justify-stretch'>
        {parsedQueryString.map((param) => (
            <Badge key={param.name} className='text-sm rounded-md hover:bg-slate-800'onClick={() => {
            const element = document.getElementById(param.name);
            element?.scrollIntoView({
              behavior: 'smooth'
            });
          }}>
              {param.name}={decodeURIComponent(param.value)}
            </Badge>
        ))}
      </div>
      <div className='flex flex-col gap-y-2'>
          <ParameterDisplay parsedQueryString={parsedQueryString} />
      </div>
    </div>
  );
};

export default App;