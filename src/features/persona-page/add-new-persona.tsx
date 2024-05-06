"use client";

import { useSession } from "next-auth/react";
import { FC, useState, ChangeEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ServerActionResponse } from "../common/server-action-response";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LoadingIndicator } from "../ui/loading";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
  addOrUpdatePersona,
  personaStore,
  usePersonaState,
} from "./persona-store";

interface Props {}

export const AddNewPersona: FC<Props> = (props) => {
  const initialState: ServerActionResponse | undefined = undefined;

  const { isOpened, persona } = usePersonaState();

  const [formState, formAction] = useFormState(
    addOrUpdatePersona,
    initialState
  );

  const { data } = useSession();

  const PublicSwitch = () => {
    if (data === undefined || data === null) return null;

    if (data?.user?.isAdmin || data?.user?.isTeacher) {
      return (
        <div className="flex items-center space-x-2">
          <Switch name="isPublished" defaultChecked={persona.isPublished} />
          <Label htmlFor="description">Publish</Label>
        </div>
      );
    }
  };

  const [topP, setTopP] = useState<number>(persona.topP || 0);
  const [temperature, setTemperature] = useState<number>(persona.topP || 0);

  const handleSliderChangeTopP = (event: ChangeEvent<HTMLInputElement>) => {
    setTopP(Number(event.target.value));
  };

  const handleSliderChangeTemperature = (event: ChangeEvent<HTMLInputElement>) => {
    setTemperature(Number(event.target.value));
  };

  const [model, setModel] = useState<string>(persona.model || 'gpt-4-turbo'); // Default value

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setModel(event.target.value);
  };

  return (
    <Sheet
      open={isOpened}
      onOpenChange={(value) => {
        personaStore.updateOpened(value);
      }}
    >
      <SheetContent className="min-w-[480px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Persona</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="flex-1 flex flex-col">
          <ScrollArea
            className="flex-1 -mx-6 flex max-h-[calc(100vh-140px)]"
            type="always"
          >
            <div className="pb-6 px-6 flex gap-8 flex-col  flex-1">
              <input type="hidden" name="id" defaultValue={persona.id} />
              {formState && formState.status === "OK" ? null : (
                <>
                  {formState &&
                    formState.errors.map((error, index) => (
                      <div key={index} className="text-red-500">
                        {error.message}
                      </div>
                    ))}
                </>
              )}
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  type="text"
                  required
                  name="name"
                  defaultValue={persona.name}
                  placeholder="Name of your persona"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Short description</Label>
                <Input
                  type="text"
                  required
                  defaultValue={persona.description}
                  name="description"
                  placeholder="Short description"
                />
              </div>
              <div className="grid gap-2 flex-1 ">
                <Label htmlFor="personaMessage">Personality</Label>
                <Textarea
                  className="min-h-[300px]"
                  required
                  defaultValue={persona.personaMessage}
                  name="personaMessage"
                  placeholder="Personality of your persona"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="topP">Top P: {topP}</Label>
                <input
                  type="range"
                  required
                  min="0"
                  max="1"
                  step="0.01"
                  name="topP"
                  value={topP}
                  onChange={handleSliderChangeTopP}
                  className="block w-full" // Add your custom styles if necessary
                />
                {/* <div className="text-center">{topP}</div> */}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="temperature">temperature: {temperature}</Label>
                <input
                  type="range"
                  required
                  min="0"
                  max="1"
                  step="0.01"
                  name="temperature"
                  value={temperature}
                  onChange={handleSliderChangeTemperature}
                  className="block w-full" // Add your custom styles if necessary
                />
                {/* <div className="text-center">{temperature}</div> */}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">AI Model</Label>
                <select
                  required
                  name="model"
                  value={model}
                  onChange={handleModelChange}
                  className="block w-full border border-gray-300 rounded-md p-2 shadow-sm" // Add your custom styles if necessary
                >
                  <option value="gpt-3.5-turbo">GPT-3.5-Turbo</option>
                  <option value="gpt-4-turbo">GPT-4-Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                </select>
              </div>
            </div>
          </ScrollArea>
          <SheetFooter className="py-2 flex sm:justify-between flex-row">
            <PublicSwitch /> <Submit />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

function Submit() {
  const status = useFormStatus();
  return (
    <Button disabled={status.pending} className="gap-2">
      <LoadingIndicator isLoading={status.pending} />
      Save
    </Button>
  );
}
