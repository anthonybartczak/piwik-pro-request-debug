import React, { useEffect, useState } from "react";
import parseQueryString from "./utils/parseQueryString";
import parseJsonBody from "./utils/parseJsonBody";
import hasJsonStructure from "./utils/hasJsonStructure";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ParameterDisplay from "./components/ParameterDisplay";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Switch } from "./components/ui/switch";
import { useLocalStorage } from "usehooks-ts";
import type { ParsedQueryString } from "./lib/models";
import { getEventType } from "./lib/getEventType";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";

import {
  Copy,
  Github,
  Info,
  Settings2,
  Linkedin,
  CircleUser,
  BookHeart,
} from "lucide-react";

const App: React.FC = () => {
  let defaultString = "";
  const urlParams = new URLSearchParams(window.location.search);
  const share = urlParams.get("share");

  if (import.meta.env.VITE_IS_DEV === "true") {
    defaultString = import.meta.env.VITE_DUMMY_QUERY_STRING;
  }

  if (share) {
    defaultString = window.atob(share);
  }

  const [savedQueryString, setSavedQueryString] = useLocalStorage(
    "queryString",
    "",
  );
  const [settings, setSettings] = useLocalStorage("settings", {
    useSavedString: true,
  });

  const [input, setInput] = useState<string>(defaultString);
  const [parsedQueryString, setParsedQueryString] = useState<
    ParsedQueryString[]
  >([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleQuerySaveSwitch = () => {
    const value = !settings.useSavedString;

    settings.useSavedString
      ? setSavedQueryString("")
      : setSavedQueryString(input);

    setSettings({ ...settings, useSavedString: value });
  };

  
  const generateDlEvent = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "login",
      login_domain: "requests.anteriam.com"
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    const parsedQueryString = !hasJsonStructure(input)
      ? parseQueryString(input)
      : parseJsonBody(JSON.parse(input));

    const convertedParams = parsedQueryString.map((param) => ({
      name: param.name,
      value: param.value,
    }));

    // Remove the "share" query parameter after submitting the form
    // We no longer need the share URL since we either save the request or drop it
    if (params.has("share")) {
      params.delete("share");
      const newUrl = `${url.pathname}?${params.toString()}`;
      console.log(newUrl);
      window.history.replaceState({}, "", newUrl);
    }

    setParsedQueryString(convertedParams);
  };

  useEffect(() => {
    if (input === "" && savedQueryString !== "" && settings.useSavedString) {
      setInput(savedQueryString);
    }
  }, [input, savedQueryString, settings.useSavedString]);

  return (
    <div className="mt-10 flex min-w-full flex-col justify-center gap-y-2 px-8">
      <ScrollToTopButton />
      {parsedQueryString.length === 0 && (
        <>
          <div className="flex flex-row gap-x-2">
            <div className="flex w-3/4 flex-col gap-y-2 text-wrap rounded-sm border border-slate-700/[.65] bg-slate-900 p-4 shadow-md">
              <div className="flex flex-row items-center gap-x-1.5">
                <Info className="h-5 w-5" />
                <h1 className="font-mono text-lg uppercase">What is this?</h1>
              </div>
              <Separator decorative className="bg-gray-800" />
              <p className="font-thin">
                Request Debugger is a simple web application designed to assist
                users in debugging and troubleshooting requests made to the
                Piwik PRO HTTP Tracking API. It provides a user-friendly
                interface that allows to easily analyze and visualize the
                details of API requests.
              </p>
            </div>
            <div className="flex w-1/4 flex-col gap-y-2 rounded-sm border border-slate-700/[.65] bg-slate-900 p-4 shadow-md">
              <div className="flex flex-row items-center gap-x-1.5">
                <CircleUser className="h-5 w-5" />
                <h1 className="font-mono text-lg uppercase">Contact me</h1>
              </div>
              <Separator decorative className="bg-gray-800" />
              <ul className="flex flex-col gap-y-2">
                <li className="flex gap-x-2">
                  <Github className="h-5 w-5" />
                  <a
                    target="_blank"
                    href="https://github.com/anthonybartczak/piwik-pro-request-debug"
                  >
                    Github
                  </a>
                </li>
                <li className="flex gap-x-2">
                  <Linkedin className="h-5 w-5" />
                  <a
                    target="_blank"
                    href="https://www.linkedin.com/in/antoni-bartczak-525187183/"
                  >
                    LinkedIn
                  </a>
                </li>
                <li className="flex gap-x-2">
                  <BookHeart className="h-5 w-5" />
                  <a
                    onClick={() => generateDlEvent()}
                    href="https://anteriam.pl">
                    Website
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 text-wrap rounded-sm border border-slate-700/[.65] bg-slate-900 p-4 shadow-md">
            <div className="flex flex-row items-center gap-x-1.5">
              <Info className="h-5 w-5" />
              <h1 className="font-mono text-lg uppercase">
                How to get the request details?
              </h1>
            </div>
            <Separator decorative className="bg-gray-800" />
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="">
                <AccordionTrigger className="bg-slate-900 pb-3 pt-1 text-lg font-thin">
                  Using your browser's developer tools
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  <ol className="rounded-md p-2 font-thin">
                    <li>1. Go to your website or web application</li>
                    <li>
                      2. Press <code>F12</code> to open the developer tools
                    </li>
                    <li>
                      3. Go to the{" "}
                      <a href="/network.webp" target="_blank" rel="noreferrer">
                        network tab
                      </a>
                    </li>
                    <li>
                      4. In the{" "}
                      <a href="/filter.webp" target="_blank" rel="noreferrer">
                        filter field
                      </a>{" "}
                      type in <code>ppms.php</code>
                    </li>
                    <li>
                      5. If you don't see any results, try refreshing the page
                      by pressing <code>F5</code>
                    </li>
                    <li>
                      6. Once you see a request, click on it and go to the{" "}
                      <a href="/payload.webp" target="_blank" rel="noreferrer">
                        payload tab
                      </a>
                    </li>
                    <li>
                      7. Click{" "}
                      <a href="/source.webp" target="_blank" rel="noreferrer">
                        view source
                      </a>{" "}
                      and copy the result.
                    </li>
                    <li>
                      8. Go back to Piwik PRO Request Debugger, paste it into
                      the input field below and press the submit button
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="bg-slate-900 pb-3 pt-1 text-lg font-thin">
                  Using Piwik PRO Tracker Debugger
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  <ol className="rounded-md p-2 font-thin">
                    <li>
                      1. Go to your Piwik PRO account and select your website or
                      application from the list
                    </li>
                    <li>
                      2. Go to the Analytics module, switch to settings and
                      click on the tracker debugger button
                    </li>
                    <li>
                      3. Click on the{" "}
                      <a href="/request.webp" target="_blank" rel="noreferrer">
                        &lt;/&gt;
                      </a>{" "}
                      to display event details
                    </li>
                    <li>
                      4. Click{" "}
                      <a
                        href="/trackerdebugger.webp"
                        target="_blank"
                        rel="noreferrer"
                      >
                        copy to clipboard
                      </a>
                    </li>
                    <li>
                      5. Go back to Piwik PRO Request Debugger, paste it into
                      the input field below and press the submit button
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex flex-col gap-y-1.5"></div>
          </div>
        </>
      )}
      <div>
        <div className="flex flex-col gap-y-2 rounded-sm border border-slate-700/[.65] bg-slate-900 p-4 shadow-md">
          <div className="flex flex-row items-center gap-x-1.5">
            <Settings2 className="h-5 w-5" />
            <h1 className="font-mono text-lg uppercase">Settings</h1>
          </div>
          <Separator decorative className="bg-gray-800" />
          <div className="flex flex-row">
            <Switch
              onCheckedChange={handleQuerySaveSwitch}
              checked={settings.useSavedString}
              className=""
            />
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
          required={true}
          defaultValue={input}
          onChange={handleInputChange}
          placeholder="Enter the Piwik PRO request query string"
          className="w-full min-w-max rounded border border-slate-700/[.65] p-3 font-mono"
        />
        <button
          type="submit"
          className="w-1/6 rounded-sm border border-slate-700/[.65] bg-gray-900 px-12 font-mono uppercase text-white shadow-md transition duration-300 hover:bg-slate-600"
        >
          Submit
        </button>
        {parsedQueryString.length > 0 && (
          <button
            className="w-1/6 rounded-sm border border-slate-700/[.65] bg-gray-900 px-12 font-mono uppercase text-white shadow-md transition duration-300 hover:bg-slate-600"
            onClick={() => {
              const url = window.location.href.split("?")[0];
              const stringToCopy = parsedQueryString
                .map((param) => `${param.name}=${param.value}`)
                .join("&");
              const encoded = btoa(stringToCopy);
              navigator.clipboard.writeText(`${url}?share=${encoded}`);
            }}
          >
            Share
          </button>
        )}
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
          <div className="flex flex-col gap-y-2 rounded-sm border border-slate-700/[.65] bg-slate-900 p-2 shadow-md">
            <span className="ml-0.5 font-mono text-sm text-gray-600">
              Query string output
            </span>
            <Separator decorative className="bg-gray-800" />

            <div className="flex gap-x-2">
              <textarea
                id="modified-query-string-output"
                className="min-h-fit w-full min-w-max resize-none rounded-sm border p-3 shadow-md scrollbar-thin scrollbar-none"
                readOnly
                value={parsedQueryString
                  .map((param) => `${param.name}=${param.value}`)
                  .join("&")}
              ></textarea>
              <Button
                className="h-max min-w-fit rounded-md bg-slate-950 p-6 hover:bg-slate-800"
                onClick={() => {
                  const element = document.getElementById(
                    "modified-query-string-output",
                  ) as HTMLInputElement;
                  if (element) {
                    navigator.clipboard.writeText(element.value);
                  }
                }}
              >
                <Copy className="h-auto w-auto" />
              </Button>
            </div>
          </div>

          <div
            id="event-details-display"
            className="flex flex-col gap-x-2 gap-y-1.5 rounded-sm border border-slate-700/[.65] bg-slate-900 p-2 shadow-md"
          >
            <span className="ml-0.5 font-mono text-sm text-gray-600">
              Event details
            </span>
            <Separator decorative className="bg-gray-800" />
            <div>
              <div
                id="event-type-detected"
                className="min-h-fit w-fit rounded-sm bg-slate-950 p-2 font-mono text-xl shadow-sm"
              >
                Event type:{" "}
                <span className="rounded-sm bg-gray-900 p-1.5 uppercase shadow-xl">
                  {getEventType(parsedQueryString)}
                </span>
              </div>
              {/* <div
              id="event-type-detected"
              className="min-h-fit w-fit rounded-sm border border-slate-700/[.65] bg-slate-900 p-3 font-mono text-xl shadow-md"
            >
              Event Type:{" "}
              <span className="rounded-md bg-gray-800 p-1.5 uppercase shadow-xl">
                {getEventType(parsedQueryString)}
              </span>
            </div> */}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-y-2">
        <ParameterDisplay
          useSavedString={settings.useSavedString}
          setSavedQueryString={setSavedQueryString}
          savedQueryString={savedQueryString}
          parsedQueryString={parsedQueryString}
          setParsedQueryString={setParsedQueryString}
        />
      </div>
    </div>
  );
};

export default App;
