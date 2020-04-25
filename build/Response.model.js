"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResponseModel = /** @class */ (function () {
    function ResponseModel(params) {
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
    return ResponseModel;
}());
exports.ResponseModel = ResponseModel;
