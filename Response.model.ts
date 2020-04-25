interface IVideo {
  url: string;
  secureUrl?: string;
  type: string;
  width: any;
  height: any;
}

export class ResponseModel {
  public url: string;

  public title?: string;

  public siteName?: string;

  public description?: string;

  public images?: string[];

  public mediaType: string;

  public contentType: string;

  public videos?: IVideo[];

  public favicons: string[];

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
  }) {
    this.url = params.url;
    this.title = params.title;
    this.siteName = params.siteName;
    this.description = params.description;
    this.images = params.images;
    this.mediaType = params.mediaType;
    this.contentType = params.contentType;
    this.videos = params.videos;
    this.favicons = params.favicons;
  }
}
