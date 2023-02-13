module.exports = function(RED) {
    const mathjs = require('mathjs');
    function ConditionNode(config) {        
        RED.nodes.createNode(this,config);

        this.name = config.name;
        this.expression = config.expression;
        this.oninputtopic = config.oninputtopic;
        this.onsynctopic = config.onsynctopic;

        var node = this;
        node.on('input', function(msg) {
            if ( msg.topic == "input" || msg.topic == "init" ) {
                for ( var input in msg.payload ) {
                    node[input] = payload[input]
                }
            }
            if (msg.topic == "input" && node.oninputtopic || msg.topic == "sync" && node.onsynctopic ) {
                if ( mathjs.parse(node.expression).evaluate(node) ) {
                    msg.topic = "condition"
                    msg.payload = node.name;
                    node.send(msg);
                }
            }
        });
    }
    RED.nodes.registerType("condition",ConditionNode);
}
