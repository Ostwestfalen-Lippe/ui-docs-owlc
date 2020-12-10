/*global importScripts Supercluster */

importScripts('supercluster.min.js');

const now = Date.now();

let index;

function updateIndex (url)
{
    fetch(url)
    .then(res => res.json())
    .then((out) => {
        index = new Supercluster({
            log: false,
            radius: 60,
            extent: 256,
            maxZoom: 17
        }).load(out.features);
        // console.log(index);

        postMessage({ready: true});
    })
    .catch(err => { throw err });
}

self.onmessage = function (e) {
    if (e.data.getClusterExpansionZoom) {
        postMessage({
            expansionZoom: index.getClusterExpansionZoom(e.data.getClusterExpansionZoom),
            center: e.data.center
        });
    } else if (e.data.command === 'updateIndex')
    {
        updateIndex(e.data.url);
    } else if (e.data) {
        postMessage(index.getClusters(e.data.bbox, e.data.zoom));
    }
};

function getJSON(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300 && xhr.response) {
            callback(xhr.response);
        }
    };
    xhr.send();
}
