import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import docs from '../utils/docs.json';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../components/ui/drawer"

import { Search, Trash } from 'lucide-react';
import { Button } from "../components/ui/button"

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
  originalParameterName: string;
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<Parameter | null>(null);

  useEffect(() => {
    const compareParameters = () => {
      const apiParameters = docs.paths["/ppms.php"].get.parameters;
      const foundParameters = parsedQueryString.map((param: { name: string; value: string; }) => {
        let paramName = param.name;

        if (paramName.startsWith("dimension")) {
          paramName = "dimensionID";
        }

        const apiParam = apiParameters.find(apiParam => apiParam.name === paramName);

        if (apiParam) {
          return {
            ...param,
            ...apiParam,
            apiValue: param.value,
            originalParameterName: param.name,
          } as Parameter;
        }

        return null;
      }).filter((param): param is Parameter => param !== null);

      return foundParameters;
    };

    setFoundParameters(compareParameters());
  }, [parsedQueryString]);

  const truncateString = (str: string, length: number, ending = '...') => {
    if (str.length > length) {
      return str.slice(0, length - ending.length) + ending;
    }
    return str;
  };

  const removeParameter = (parameterName: string) => {
    setFoundParameters(foundParameters.filter((param) => param.name !== parameterName));
    setParsedQueryString(parsedQueryString.filter((param) => param.name !== parameterName));
  };

  const updateDrawerContent = (parameter: Parameter) => {
    setDrawerOpen(true);
    setDrawerContent(parameter);
  };

  return (
    <>
      {foundParameters.length > 0 && (
        <>
          {foundParameters.map((parameter) => (
            <div id={parameter.originalParameterName} className="relative min-w-full border parameter-block gap-y-1.5" key={parameter.name}>
              <div className="flex flex-row gap-2">
                <strong>Parameter:</strong>
                <code>{parameter.name}</code>
              </div>
              <div className="flex flex-row gap-2">
                <strong>Example:</strong>
                <code>{truncateString(parameter.example.toString(), 96)}</code>
              </div>
              <div className="flex flex-row gap-2">
                <strong>Current value:</strong>
                <code>{truncateString(parameter.apiValue.toString(), 96)}</code>
                <Button
                  onClick={() => {
                    const decodedValue = decodeURIComponent(parameter.apiValue);
                    if (decodedValue !== null) {
                      parameter.apiValue = decodedValue;
                      setFoundParameters([...foundParameters]);
                    }
                  }}
                  className="text-xs py-0.5 px-1 h-auto bg-slate-950 transition duration-300 hover:bg-slate-800"
                >
                  Decode
                </Button>
              </div>
              <Markdown>{parameter.description}</Markdown>
              <div className='absolute flex flex-col top-0 right-0 m-2 gap-y-2'>
                <Button
                  onClick={() => removeParameter(parameter.originalParameterName)}
                  className="text-xs bg-slate-950 transition duration-300 hover:bg-slate-800"
                >
                  <Trash className='h-4 w-4' />
                </Button>
                <Button
                  onClick={() => updateDrawerContent(parameter)}
                  className="text-xs bg-slate-950 transition duration-300 hover:bg-slate-800"
                >
                  <Search className='h-4 w-4'/>
                </Button>
              </div>
            </div>
          ))}
        </>
      )}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} shouldScaleBackground={false}>
        <DrawerContent className="bg-slate-800 border-slate-800 p-2 m-20">
          <DrawerHeader>
            <DrawerTitle>Parameter name: {drawerContent?.name}</DrawerTitle>
            <DrawerDescription>
            </DrawerDescription>
          </DrawerHeader>
          <Markdown className="text-gray-300 ml-4 mt-2 mb-8">{drawerContent?.description}</Markdown>
          <div className='ml-4'>
            {drawerContent && (
              <>
                <div className="mb-2">
                  <strong>Schema:</strong>
                  <pre>{JSON.stringify(drawerContent.schema, null, 2)}</pre>
                </div>
                <div className="mb-2">
                  <strong>Example: </strong>
                  <code>{drawerContent.example}</code>
                </div>
                {drawerContent.deprecated && (
                  <div className="mb-2">
                    <strong>Deprecated:</strong> Yes
                  </div>
                )}
              </>
            )}
          </div>
          <DrawerFooter>
            <Button className='absolute top-0 right-0 p-2 m-2' onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ParameterDisplay;
