interface IVideo {
    url: string;
    secureUrl?: string;
    type: string;
    width: any;
    height: any;
}
export declare class ResponseModel {
    url: string;
    title?: string;
    siteName?: string;
    description?: string;
    images?: string[];
    mediaType: string;
    contentType: string;
    videos?: IVideo[];
    favicons: string[];
    constructor(params: {
        url: string;
        title?: string;
        siteName?: string;
        description?: string;
        images?: string[];
        mediaType: string;
        contentType: string;
        videos?: IVideo[];
        favicons: string[];
    });
}
export {};
