import * as utils from './util'
import {
  resource
} from './components/Resource'
import $ from 'jquery'

const AIService = {

  getFace(preview) {
    let params = {
      returnFaceId: 'true',
      returnFaceLandmarks: 'false',
      returnFaceAttributes: resource.FACE_ATTRIBUTES
    }
    let subscriptionKey = resource.FACE_KEY;
    let contentType = 'application/octet-stream'
    let api = 'face/v1.0/detect'
    let uriBase = resource.URI_BASE + api;

    return new Promise((resolve, reject) => {

      $.ajax({
          url: uriBase + '?' + $.param(params),
          processData: false,
          beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader('Content-Type', contentType)
            xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', encodeURIComponent(subscriptionKey))
          },
          type: 'POST',
          data: utils.makeblob(preview)
        })
        .then(json => resolve(json))
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log(('jqXHR error: ', jqXHR + textStatus + errorThrown))
        })
    })
  },

  getCaption(preview) {
    let params = {
      "visualFeatures": "Categories,Description,Color",
      "details": "",
      "language": "en",
    }
    let subscriptionKey = resource.VISION_KEY;
    let contentType = 'application/octet-stream'
    let api = 'vision/v1.0/analyze'
    let uriBase = resource.URI_BASE + api;

    return new Promise((resolve, reject) => {

      $.ajax({
          url: uriBase + '?' + $.param(params),
          processData: false,
          beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader('Content-Type', contentType)
            xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', encodeURIComponent(subscriptionKey))
          },
          type: 'POST',
          data: utils.makeblob(preview)
        })
        .then(json => resolve(json))
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log(('jqXHR error: ', jqXHR + textStatus + errorThrown))
        })
    })
  },


  getLandmark(preview) {
    var params = {
      "model": "landmarks", // Use "model": "celebrities" to use the Celebrities model.
  };
    let subscriptionKey = resource.VISION_KEY;
    let contentType = 'application/octet-stream'
    let api = 'vision/v1.0/models/landmarks/analyze'
    let uriBase = resource.URI_BASE + api;

    return new Promise((resolve, reject) => {

      $.ajax({
          url: uriBase + '?' + $.param(params),
          processData: false,
          beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader('Content-Type', contentType)
            xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', encodeURIComponent(subscriptionKey))
          },
          type: 'POST',
          data: utils.makeblob(preview)
        })
        .then(json => resolve(json))
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log(('jqXHR error: ', jqXHR + textStatus + errorThrown))
        })
    })
  },

  
  getOCR(preview) {
    var params = {
      "language": "unk",
      "detectOrientation ": "true",
  };
    let subscriptionKey = resource.VISION_KEY;
    let contentType = 'application/octet-stream'
    let api = 'vision/v1.0/ocr'
    let uriBase = resource.URI_BASE + api;

    return new Promise((resolve, reject) => {

      $.ajax({
          url: uriBase + '?' + $.param(params),
          processData: false,
          beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader('Content-Type', contentType)
            xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', encodeURIComponent(subscriptionKey))
          },
          type: 'POST',
          data: utils.makeblob(preview)
        })
        .then(json => resolve(json))
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log(('jqXHR error: ', jqXHR + textStatus + errorThrown))
        })
    })
  }
  
  
};

export default AIService;