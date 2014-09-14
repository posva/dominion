//requirejs.config({
//baseUrl: 'js',
//nodeRequire: require,
//paths: {
//ready: '../node_modules/domready/ready.min',
//selfish: '../node_modules/selfish/selfish',
//},
//});
requirejs(["require-config"], function() {
    requirejs(["ready", "app"], function(dom, app) {
        app.start();
    });
});
