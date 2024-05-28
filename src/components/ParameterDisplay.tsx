import Markdown from 'react-markdown';
import docs from '../utils/docs.json';
import { useState, useEffect } from 'react';

type Parameter = {
  name: string;
  in: string;
  description: string;
  schema: Schema;
  example: string | number | string[];
  deprecated?: boolean;
  required?: boolean;
  apiValue: string;
};

type Schema = {
  type: string;
  format?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  enum?: (string | number)[];
  default?: string | number;
  oneOf?: Schema[];
};

type ParsedQueryString = {
  name: string;
  value: string;
};

function ParameterDisplay({ parsedQueryString }: { parsedQueryString: ParsedQueryString[] }) {
  const [foundParameters, setFoundParameters] = useState<Parameter[]>([]);

  useEffect(() => {
    console.log("Rendering ParameterDisplay...");
    const compareParameters = () => {
      const apiParameters = docs.paths["/ppms.php"].get.parameters;
      const foundParameters = parsedQueryString.filter((param: { name: string; }) =>
        apiParameters.some(apiParam => apiParam.name === param.name)
      ).map((param: { name: string; value: string; }) => {
        const apiParam = apiParameters.find(apiParam => apiParam.name === param.name);
        return {
          ...param,
          ...apiParam,
          apiValue: param.value
        } as Parameter;
      });

      return foundParameters;
    };

    setFoundParameters(compareParameters());
  }, [parsedQueryString]);


  const removeParameter = (parameterName: string) => {
    setFoundParameters(foundParameters.filter((param: Parameter) => param.name !== parameterName));
  }

  return (
    foundParameters.length > 0 && (
      <>
      {foundParameters.map((parameter: Parameter) => (
        <div id={parameter.name} className="relative border rounded-md parameter-block gap-y-1.5" key={parameter.name}>
          <div className='flex flex-row gap-2'>
            <strong>Parameter:</strong>
            <code>{parameter.name}</code>
          </div>
          <div className='flex flex-row gap-2'>
            <strong>Example:</strong>
            <code>{parameter.example}</code>
          </div>
          <div className='flex flex-row gap-2'>
            <strong>Current value:</strong>
            <code>{parameter.apiValue}</code>
            <button
              onClick={() => {
                const decodedValue = decodeURIComponent(parameter.apiValue);
                if (decodedValue !== null) {
                  parameter.apiValue = decodedValue;
                  setFoundParameters([...foundParameters]);
                }
              }}
              className="text-xs py-0.5 px-1 bg-slate-950 transition duration-300 hover:bg-slate-800">
              Decode
            </button>
          </div>
          <Markdown>{parameter.description}</Markdown>
          <button
            onClick={() => removeParameter(parameter.name)}
            className="absolute top-0 right-0 m-2 text-xs bg-slate-950 transition duration-300 hover:bg-slate-800">
            ❌
          </button>
        </div>
      ))}
    </>
    )
  );
}

export default ParameterDisplay;
