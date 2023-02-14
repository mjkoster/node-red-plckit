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
                    node.context().set(input, msg.payload[input]);
                    node[input] = msg.payload[input];
                }
            }
            msg.topic = "debug";
            msg.payload = node.context();
            node.send(msg);

            if (msg.topic == "input" && node.oninputtopic || msg.topic == "sync" && node.onsynctopic ) {
                const condition =  mathjs.parse(expression);
                const vnodes = condition.filter(isVariable);
                var scope = {};
                vnodes.forEach(vnode => {
                    scope[vnode.name] = node.context().get(vnode.name);
                });
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
