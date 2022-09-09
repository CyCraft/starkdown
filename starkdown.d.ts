declare module "starkdown" {
  interface Links {
    [index: string]: string;
  }
  export default function (urlStr: string, prevLinks?: Links): string;
}
