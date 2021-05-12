import { parse, URL } from 'url';

export class Utils {
    public static getUrlBasePath(url: string | undefined): string {
        if (url) {
            return url.split('/')[1];
        }
        return "";
    }
}