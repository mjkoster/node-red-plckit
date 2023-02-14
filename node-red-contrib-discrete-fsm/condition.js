module.exports = function(RED) {
    const mathjs = require('mathjs');
    const isVariable = function (node) {
        return node.isSymbolNode
    }
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
                    node.context().set(input, msg.payload[input]);
                }
            }
            if (msg.topic == "input" && node.oninputtopic || msg.topic == "sync" && node.onsynctopic ) {
                const condition =  mathjs.parse(node.expression);
                const vnodes = condition.filter(isVariable);
                var scope = {};
                vnodes.forEach(vnode => {
                    scope[vnode.name] = node.context().get(vnode.name);
                });

                var context = {};
                node.context().keys().forEach(property => {
                    context[property] = node.context().get(property);
                });       

                msg.topic = "scope";
                msg.payload = scope;
                node.send(msg);

                if ( condition.evaluate(scope) ) {
                    msg.topic = "condition"
                    msg.payload = node.name;
                    node.send(msg);
                }
            }
        });
    }
    RED.nodes.registerType("condition",ConditionNode);
}
