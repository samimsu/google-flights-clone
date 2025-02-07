import { mockAdapter } from "../../utils/axios";
import getLocaleJson from "../jsons/getLocale.json";

mockAdapter.onGet("/api/v1/getLocale").reply(200, getLocaleJson);
