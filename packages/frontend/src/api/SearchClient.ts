import axios from "axios";
import {MidasBackendClient} from "./MidasBackendClient.ts";
import {SearchResult} from "../../../backend/src/shared-types/financial-modeling-prep";

export class SearchClient extends MidasBackendClient{

    static async search(query: string): Promise<SearchResult[]> {
        const {data} =  await axios.get<SearchResult[]>(
            `${this.getSearchUrl()}?query=${query}`
        )

        return data
    }

    private static getSearchUrl() {
        return `${this.getBaseUrl()}/search`;
    }
}