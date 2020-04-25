// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import DomParser from 'react-native-html-parser';
import { fetch } from "cross-fetch";
import urlObj from "url";
import { CONSTANTS } from "./constants";
import { ResponseModel } from './Response.model';

interface ILinkPreviewOptions {
  headers?: Record<string, string>;
  imagesPropertyType?: string;
}

function getNodeValue(node?: any) {
  if (node) {
    return node.attributes[1].nodeValue;
  }
  return null;
}

function getTitle(doc: any) {
  return getNodeValue(doc.querySelect(`meta[property='og:title']`)[0]);
}

function getSiteName(doc: any) {
  return getNodeValue(doc.querySelect(`meta[property='og:site_name']`)[0]);
}

function getDescription(doc: any) {
  let description = getNodeValue(doc.querySelect(`meta[name=Description]`)[0]);

  if (description == null) {
    description = getNodeValue(doc.querySelect(`meta[property='og:description']`)[0]);
  }

  return description;
}

// TODO I don't know what this returns, the node definitely has no length?
function getMediaType(doc: any) {
  return getNodeValue(doc.querySelect(`meta[property='og:type']`)[0]);
  // const nodes = doc.querySelect(`meta[name=medium]`);

  // if (nodes.length) {
  //   console.warn(`MEDIA TYPE NODES: ${nodes.length}`, nodes[0]);
  //   const value = getNodeValue(nodes[0]);
  //   return value === `image` ? `photo` : value;
  // }

  // return getNodeValue(doc.querySelect(`meta[property='og:type']`)[0]);
}

function getImages(doc: any, rootUrl: string, imagesPropertyType?: string) {
  const images: string[] = [];

  let src;
  // let dic: Record<string, boolean> = {};

  const imagePropertyType = imagesPropertyType ?? `og`;
  const nodes = doc.querySelect(`meta[property='${imagePropertyType}:image']`);

  if (nodes.length) {
    nodes.forEach((node: any) => {
      src = getNodeValue(node);
      if (src) {
        images.push(src);
      }
    });
  }

  // if (images.length <= 0 && !imagesPropertyType) {
  //   src = doc(`link[rel=image_src]`).attr(`href`);
  //   if (src) {
  //     src = urlObj.resolve(rootUrl, src);
  //     images = [src];
  //   } else {
  //     nodes = doc(`img`);

  //     if (nodes.length) {
  //       dic = {};
  //       images = [];
  //       nodes.each((_: number, node: any) => {
  //         src = node.attribs.src;
  //         if (src && !dic[src]) {
  //           dic[src] = true;
  //           // width = node.attribs.width;
  //           // height = node.attribs.height;
  //           images.push(urlObj.resolve(rootUrl, src));
  //         }
  //       });
  //     }
  //   }
  // }

  return images;
}

function getVideos(doc: any) {
  const videos = [];
  let nodeTypes;
  let nodeSecureUrls;
  let nodeType;
  let nodeSecureUrl;
  let video;
  let videoType;
  let videoSecureUrl;
  let width;
  let height;
  let videoObj;
  let index;

  const nodes = doc.querySelect(`meta[property='og:video']`);

  const { length } = nodes;

  // console.warn(`ROPO VIDEO NODES`, nodes);

  if (length) {
    // nodeTypes = doc.querySelect(`meta[property='og:video:type']`);
    // nodeSecureUrls = doc.querySelect(`meta[property='og:video:secure_url']`);
    // width = doc.querySelect(`meta[property='og:video:width']`).attr(`content`);
    // height = doc.querySelect(`meta[property='og:video:height']`).attr(`content`);

    // for (index = 0; index < length; index += 1) {
    //   video = nodes[index].attribs.content;

    //   nodeType = nodeTypes[index];
    //   videoType = nodeType ? nodeType.attribs.content : null;

    //   nodeSecureUrl = nodeSecureUrls[index];
    //   videoSecureUrl = nodeSecureUrl ? nodeSecureUrl.attribs.content : null;

    //   videoObj = {
    //     url: video,
    //     secureUrl: videoSecureUrl,
    //     type: videoType,
    //     width,
    //     height,
    //   };
    //   if (videoType && videoType.indexOf(`video/`) === 0) {
    //     videos.splice(0, 0, videoObj);
    //   } else {
    //     videos.push(videoObj);
    //   }
    // }
  }

  return videos;
}

// returns default favicon (//hostname/favicon.ico) for a url
function getDefaultFavicon(rootUrl: string) {
  return urlObj.resolve(rootUrl, `/favicon.ico`);
}


// returns an array of URL's to favicon images
function getFavicons(doc: any, rootUrl: string) {
  let images: string[] = [];
  const nodes = [];
  let src;

  const relSelectors = [
    `rel=icon`,
    // `rel="shortcut icon"`,
    // `rel=apple-touch-icon`,
  ];

  relSelectors.forEach((relSelector) => {
    // look for all icon tags
    const favicons = doc.querySelect(`link[${relSelector}]`).map((node: any) => {
      // console.warn(`Favicons map iteration`, urlObj.resolve(rootUrl, value));
      console.warn(`Favicons map iteration`, node);
      const value = getNodeValue(node);
      return urlObj.resolve(rootUrl, value);
    });

    images = images.concat(favicons);
  });

  // if no icon images, use default favicon location
  if (images.length <= 0) {
    images.push(getDefaultFavicon(rootUrl));
  }

  return images;
}

function parseImageResponse(url: string, contentType: string) {
  return new ResponseModel({
    url,
    mediaType: `image`,
    contentType,
    favicons: [getDefaultFavicon(url)],
  });
}

function parseAudioResponse(url: string, contentType: string) {
  return new ResponseModel({
    url,
    mediaType: `audio`,
    contentType,
    favicons: [getDefaultFavicon(url)],
  });
}

function parseVideoResponse(url: string, contentType: string) {
  return new ResponseModel({
    url,
    mediaType: `video`,
    contentType,
    favicons: [getDefaultFavicon(url)],
  });
}

function parseApplicationResponse(url: string, contentType: string) {
  return new ResponseModel({
    url,
    mediaType: `application`,
    contentType,
    favicons: [getDefaultFavicon(url)],
  });
}

function parseTextResponse(
  body: string,
  url: string,
  options: ILinkPreviewOptions = {},
  contentType: string,
) {
  const doc = new DomParser.DOMParser().parseFromString(body, `text/html`);

  return new ResponseModel({
    url,
    title: getTitle(doc),
    siteName: getSiteName(doc),
    description: getDescription(doc),
    mediaType: getMediaType(doc) || `website`,
    contentType,
    images: getImages(doc, url, options.imagesPropertyType),
    videos: getVideos(doc),
    favicons: getFavicons(doc, url),
  });
}


export async function getLinkPreview(
  text: string,
  options?: ILinkPreviewOptions,
): Promise<ResponseModel> {
  if (!text || typeof text !== `string`) {
    throw new Error(`link-preview-js did not receive a valid url or text`);
  }

  const detectedUrl = text
    .replace(/\n/g, ` `)
    .split(` `)
    .find((token) => CONSTANTS.REGEX_VALID_URL.test(token));

  if (!detectedUrl) {
    throw new Error(`link-preview-js did not receive a valid a url or text`);
  }

  const fetchOptions = { headers: options?.headers ?? {} };

  try {
    const response = await fetch(detectedUrl, fetchOptions);

    // get final URL (after any redirects)
    const finalUrl = response.url;

    // get content type of response
    let contentType = response.headers.get(`content-type`);

    if (!contentType) {
      throw new Error(
        `link-preview-js could not determine content-type for link`,
      );
    }

    if ((contentType as any) instanceof Array) {
      // eslint-disable-next-line prefer-destructuring
      contentType = contentType[0];
    }

    // parse response depending on content type
    if (CONSTANTS.REGEX_CONTENT_TYPE_IMAGE.test(contentType)) {
      return parseImageResponse(finalUrl, contentType);
    }
    if (CONSTANTS.REGEX_CONTENT_TYPE_AUDIO.test(contentType)) {
      return parseAudioResponse(finalUrl, contentType);
    }
    if (CONSTANTS.REGEX_CONTENT_TYPE_VIDEO.test(contentType)) {
      return parseVideoResponse(finalUrl, contentType);
    }
    if (CONSTANTS.REGEX_CONTENT_TYPE_TEXT.test(contentType)) {
      const htmlString = await response.text();
      return parseTextResponse(htmlString, finalUrl, options, contentType);
    }
    if (CONSTANTS.REGEX_CONTENT_TYPE_APPLICATION.test(contentType)) {
      return parseApplicationResponse(finalUrl, contentType);
    }
    throw new Error(`Unknown content type for URL.`);
  } catch (e) {
    throw new Error(
      `link-preview-js could not fetch link information ${e.toString()}`,
    );
  }
}
