import { proxy, useSnapshot } from "valtio";
import { RevalidateCache } from "../common/navigation-helpers";
import { ModelOptions, DEFAULT_MODEL, DEFAULT_TOP_P, DEFAULT_TEMPERATURE, PERSONA_ATTRIBUTE, PersonaModel } from "./persona-services/models";
import {
  CreatePersona,
  UpsertPersona,
} from "./persona-services/persona-service";

class PersonaState {
  private defaultModel: PersonaModel = {
    id: "",
    name: "",
    description: "",
    personaMessage: "",
    createdAt: new Date(),
    isPublished: false,
    type: "PERSONA",
    userId: "",
    topP: DEFAULT_TOP_P,
    temperature: DEFAULT_TEMPERATURE,
    model: DEFAULT_MODEL,
  };

  public isOpened: boolean = false;
  public errors: string[] = [];
  public persona: PersonaModel = { ...this.defaultModel };

  public updateOpened(value: boolean) {
    this.isOpened = value;
  }

  public updatePersona(persona: PersonaModel) {
    this.persona = {
      ...persona,
    };
    this.isOpened = true;
  }

  public newPersona() {
    this.persona = {
      ...this.defaultModel,
    };
    this.isOpened = true;
  }

  public newPersonaAndOpen(persona: {
    name: string;
    description: string;
    personaMessage: string;
  }) {
    this.persona = {
      ...this.defaultModel,
      name: persona.name,
      description: persona.description,
      personaMessage: persona.personaMessage,
    };
    this.isOpened = true;
  }

  public updateErrors(errors: string[]) {
    this.errors = errors;
  }
}

export const personaStore = proxy(new PersonaState());

export const usePersonaState = () => {
  return useSnapshot(personaStore);
};

export const addOrUpdatePersona = async (previous: any, formData: FormData) => {
  personaStore.updateErrors([]);

  const model = FormDataToPersonaModel(formData);
  const response =
    model.id && model.id !== ""
      ? await UpsertPersona(model)
      : await CreatePersona(model);

  if (response.status === "OK") {
    personaStore.updateOpened(false);
    RevalidateCache({
      page: "persona",
    });
  } else {
    personaStore.updateErrors(response.errors.map((e) => e.message));
  }
  return response;
};

export const FormDataToPersonaModel = (formData: FormData): PersonaModel => {

  // catch errors regarding temperature, topP and model
  const temperatureStr = formData.get("temperature");
  let temperature = temperatureStr === null ? null : Number(temperatureStr);
  if (temperature === null || isNaN(temperature)) {
    // Handle the case where temperature is not a number
    temperature = 1;
  }

  const topPStr = formData.get("topP");
  let topP = topPStr === null ? null : Number(topPStr);
  if (topP === null || isNaN(topP)) {
    // Handle the case where temperature is not a number
    topP = 1;
  }

  const modelValue = formData.get("model");
  let model: typeof ModelOptions._type | undefined = 'gpt-4-turbo'; // Set default value

  if (modelValue && typeof modelValue === "string") {
    try {
      // Validate model value
      model = ModelOptions.parse(modelValue);
    } catch (e) {
      // If the provided model value is invalid, fall back to the default
      console.error(e); // Log the error
    }
  }


  return {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    personaMessage: formData.get("personaMessage") as string,
    isPublished: formData.get("isPublished") === "on" ? true : false,
    userId: "", // the user id is set on the server once the user is authenticated
    createdAt: new Date(),
    type: PERSONA_ATTRIBUTE,
    topP: topP,
    temperature: temperature,
    model: model,
  };
};
