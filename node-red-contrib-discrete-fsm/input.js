module.exports = function(RED) {

    function InputNode(config) {        
        RED.nodes.createNode(this,config);

        var node = this;
        
        node.name = config.name;
        node.initialvalue = config.initialvalue;

        setTimeout( function() {
          node.emit("input",{});
        }, 100 );

        node.on('input', function(msg) {
            const value = msg.payload;
            msg.payload = {};
            msg.topic = "input";
            msg.payload[node.name] = value;
            node.send(msg);
        });
    }
    RED.nodes.registerType("input",InputNode);
}
