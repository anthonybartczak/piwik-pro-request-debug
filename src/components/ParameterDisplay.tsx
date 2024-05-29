import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import docs from '../utils/docs.json';

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

type ParsedQueryString = {
  name: string;
  value: string;
};

interface ParameterDisplayProps {
  parsedQueryString: ParsedQueryString[];
  setParsedQueryString: React.Dispatch<React.SetStateAction<ParsedQueryString[]>>;
}

const ParameterDisplay: React.FC<ParameterDisplayProps> = ({ parsedQueryString, setParsedQueryString }) => {
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
    setFoundParameters(foundParameters.filter((param) => param.name !== parameterName));
    setParsedQueryString(parsedQueryString.filter((param) => param.name !== parameterName));
  };

  return (
    <>
      {foundParameters.length > 0 && (
        <>
          {foundParameters.map((parameter) => (
            <div id={parameter.name} className="relative min-w-full border rounded-md parameter-block gap-y-1.5" key={parameter.name}>
              <div className="flex flex-row gap-2">
                <strong>Parameter:</strong>
                <code>{parameter.name}</code>
              </div>
              <div className="flex flex-row gap-2">
                <strong>Example:</strong>
                <code>{parameter.example}</code>
              </div>
              <div className="flex flex-row gap-2">
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
                  className="text-xs py-0.5 px-1 bg-slate-950 transition duration-300 hover:bg-slate-800"
                >
                  Decode
                </button>
              </div>
              <Markdown>{parameter.description}</Markdown>
              <button
                onClick={() => removeParameter(parameter.name)}
                className="absolute top-0 right-0 m-2 text-xs bg-slate-950 transition duration-300 hover:bg-slate-800"
              >
                ❌
              </button>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default ParameterDisplay;
