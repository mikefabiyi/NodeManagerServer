import { IncomingMessage } from 'http';
import { parse, URL, UrlWithParsedQuery, UrlWithStringQuery } from 'url';

export class Utils {
    public static getUrlBasePath(url: string | undefined): string | undefined {
        if (url) {
            const parsedUrl = parse(url);
            return parsedUrl?.pathname?.split('/')[1];
        }
        return "";
    }

    public static getUrlParameters(url: string | undefined): UrlWithParsedQuery | undefined{
        if(url)
        {
            const parsedUrl = parse(url, true);
            return parsedUrl;
        }
        else
            return undefined;
    }
}