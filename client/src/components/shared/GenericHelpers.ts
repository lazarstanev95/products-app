export default class GenericHelpers {
    static copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }
}