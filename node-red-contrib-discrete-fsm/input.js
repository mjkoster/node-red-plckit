module.exports = function(RED) {

    function InputNode(config) {        
        RED.nodes.createNode(this,config);

        var node = this;
        
        node.name = config.name;

        if (node.initialvaluetype == 'number') {
            node.initialvalue = config.initialvalue + 0;
        }
        if (node.initialvaluetype == 'string') {
            node.initialvalue = config.initialvalue + "";
        }
        if (node.initialvaluetype == 'bool') {
            node.initialvalue = config.initialvalue && true;
        }

        setTimeout( function() {
          var msg = {}
          msg['topic'] = 'init';
          msg['payload'] = {};
          msg.payload[node.name] = node.initialvalue;
          node.send(msg);
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
