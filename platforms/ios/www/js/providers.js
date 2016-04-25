angular.module('starter.providers', [])
    .provider('config', function () {
        var conf = {
            version: '1.0.0',
            backend: 'http://api.spas.ru'
        };

        conf.$get = function () {
            delete conf.$get;
            return conf;
        };

        return conf;
    })
    .provider('imageTools', function () {
        var tools = {

        };

        tools.resizeImage = function(dataUrl, targetWidth, targetHeight, callback) {
            var sourceImage = new Image();

            sourceImage.onload = function() {
                // Create a canvas with the desired dimensions
                var canvas = document.createElement("canvas");
                canvas.width = targetWidth;
                canvas.height = targetHeight;

                // Scale and draw the source image to the canvas
                canvas.getContext("2d").drawImage(sourceImage, 0, 0, targetWidth, targetHeight);

                // Convert the canvas to a data URL in PNG format
                callback(canvas.toDataURL());
            };

            sourceImage.src = dataUrl;
        };

        tools.$get = function () {
            delete tools.$get;
            return tools;
        };

        return tools;
    });