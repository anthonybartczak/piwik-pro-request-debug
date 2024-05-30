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
  const [drawerContent, setDrawerContent] = useState({ title: "", description: "" });

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

  const updateDrawerContent = () => {
    drawerOpen ? setDrawerOpen(false) : setDrawerOpen(true);
    const content: { title: string, description: string } = {
      title: "Parameter details",
      description: "This drawer contains details about the parameter.",
    }
    setDrawerContent(content);
  }

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
                  onClick={() => removeParameter(parameter.name)}
                  className="text-xs bg-slate-950 transition duration-300 hover:bg-slate-800"
                >
                  ❌
                </Button>
                <Button
                  onClick={() => updateDrawerContent()}
                  className="text-xs bg-slate-950 transition duration-300 hover:bg-slate-800"
                >
                  🔍
                </Button>
              </div>
            </div>
          ))}
        </>
      )}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} shouldScaleBackground={false}>
        <DrawerContent className="bg-slate-800 border-slate-800 p-2 m-20">
          <DrawerHeader>
            <DrawerTitle>{drawerContent?.title}</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
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
