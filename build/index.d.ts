import { ResponseModel } from './Response.model';
interface ILinkPreviewOptions {
    headers?: Record<string, string>;
    imagesPropertyType?: string;
}
export declare function getLinkPreview(text: string, options?: ILinkPreviewOptions): Promise<ResponseModel>;
export {};
