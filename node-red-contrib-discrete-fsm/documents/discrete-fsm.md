# node-red-contrib-discrete-fsm
## What it is

This is a set of Node-RED nodes that implements Finite State Machines (FSM). Each Input, Output, Condition, and State of the FSM is modeled as a discrete node in a Node-RED flow. 

(graphic example of a state machine diagram and corresponding node-red flow) 

Inputs and Outputs correspond to the expected definition of FSM Inputs and Outputs. Output values are only dependent on the current state (i.e. a Moore machine). Inputs and Outputs may be boolean, number, or string data type. 

State nodes correspond to the circular bubbles seen on a state chart, and Transitions and Conditions correspond to the arcs and labels on the arcs, respectively, between states. 

The names of the individual nodes are used as symbolic names for the Inputs, Conditions, States, and Outputs of the state machine.

## How it works
### Input Nodes
Input nodes receive input values from the application, associate values with a data types, and transmit named value records to Condition nodes using a message topic of "input", to be evaluated in the Condition nodes. 

Input nodes are configured with initial values in order to start the state machine with a known set of Conditions. After flow initialization, the Input nodes transmit initial values to the Condition nodes, using a message with a topic of "init".

### Condition Nodes
Condition nodes receive named Input value records from Input nodes, retain most recent Input values, and evaluate Input values against a mathjs expression that yields a boolean result. 

The evaluation of input values can be either asynchronous, on every recieved value, or synchronous, when a message with a topic of "sync" is received.

When a Condition evaluates to logic true, a message is sent to the State nodes with a topic of "condition" and a payload containing the name of the condition.

### State Nodes
State nodes receive messages with Condition names, and the Condition is evaluated against the transition table for the currently active State. When a Condition occurs that is mapped to a transition from the current State, a message is sent using the topic "transition", and containing the name of the new State, in order to hand off the active state role to the new state.

The transition topic messages are looped back to the State node inputs, where the new State selects itself by matching the State name in the transition message with its own node name.

State nodes are configured with an Output value vector, from which the output values are set when the State is entered, and a transition table, which defines transitions from this state to other states based on Condition messages.

When a new State is entered, the Output vector is sent to the Output nodes in a message including the names of the Outputs and their respective values.

One State is designated as the initial state, and its Output vector sets the Outputs to their initial values on startup using the init topic.

### Output Nodes
Output nodes receive the Output vector from State nodes and transmit the value corresponding to their node name as a plain value in ghe payload, to the downstream node(s) in the application flow. 

Output nodes can optionally Report By Exception (RBE), that is to only send a message when the value changes.

## Topics
| Topic | Explanation |
|------------|----------------------------------------------------------------------------------------------------------|
| init | sent from Input nodes to Condition nodes to initialize Input values, and from State nodes to Output nodes |
| input | sent from Input nodes to Condition nodes when input values are received |
| sync | (optional) sent from a timing source to Condition nodes for synchronous evaluation |
| condition | sent from Condition nodes to Satte nodes when a Condition evaluates to logic true |
| transition | sent from State nodes to State nodes (loop back) to initiate state changes |
| output| sent from State nodes to Output nodes when state changes occur, to set output values |

## State Machine Topology
A state machine is constructed by connecting the Input, Condition, State, and Output nodes in a multicast chain, using Node-RED Junction nodes to connect Input nodes to Condition nodes, Condition nodes to State nodes, and State nodes to Output nodes. There is an additional loop-back connection from State node outputs to State node inputs, to transmit transition messages for  handoff from one state to another.

## Input Node
Recieves input data and sends to Condition nodes

### Inputs
- Payload - boolean, string, or number type

### Outputs
#### Topic 
- <code>init</code> initializes the downstream Condition nodes with the initial value
- <code>input</code> sends received input value to Condition nodes

### Payload
- object format with <code>node.name</code> as key and input value or initial value

### Details
### References

## Condition Node
Evaluates input data using a logic expression and notifies State nodes of satisfied Conditions

### Topic 
### Payload
### Details
### References

## State Node
Receives Condition data and sends transition messages to other State nodes

### Topic 
### Payload
### Details
### References

## Output Node
Recieves Output messages from State nodes and sends output values to downstream nodes

### Topic 
### Payload
### Details
### References
