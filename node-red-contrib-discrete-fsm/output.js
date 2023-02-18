module.exports = function(RED) {

    function OutputNode(config) {        
        RED.nodes.createNode(this,config);

        var node = this;
        
        node.name = config.name;
        node.rbe = config.rbe;
        node.context().set('value', null);

        node.on('input', function(msg) {
            if(msg.topic == 'init' && node.name in msg.payload) {
                node.context().set('value', msg.payload[node.name])
            }
            if(msg.topic == 'output' && node.name in msg.payload) {
                if(!node.rbe || (node.rbe && ( msg.payload[node.name] != node.context().get('value')))) {
                    node.context().set('value', msg.payload[node.name])
                    msg.payload = node.context().get('value');
                    node.send(msg);
                }
            }
        });
    }
    RED.nodes.registerType("output",OutputNode);
}
