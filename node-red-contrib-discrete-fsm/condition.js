module.exports = function(RED) {
    const mathjs = require('mathjs');
    const isVariable = function (node) {
        return node.isSymbolNode
    }
    function ConditionNode(config) {        
        RED.nodes.createNode(this,config);

        var node = this;
        
        node.name = config.name;
        node.expression = config.expression;
        node.oninputtopic = config.oninputtopic;
        node.onsynctopic = config.onsynctopic;

        node.on('input', function(msg) {
            if ( msg.topic == "input" || msg.topic == "init" ) {
                for ( var input in msg.payload ) {
                    node.context().set(input, msg.payload[input]);
                }
            }
            if (msg.topic == "input" && node.oninputtopic || msg.topic == "sync" && node.onsynctopic ) {
                var scope = {};
                const condition =  mathjs.parse(node.expression);
                condition.filter(isVariable).forEach(vnode => {
                    scope[vnode.name] = node.context().get(vnode.name);
                });
                if ( condition.evaluate(scope) ) {
                    msg.topic = "condition";
                    msg.payload = node.name;
                    node.send(msg);
                }
            }
        });
    }
    RED.nodes.registerType("condition",ConditionNode);
}
