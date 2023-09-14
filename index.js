const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const packageDefinition = protoLoader.loadSync('./todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var todoService = protoDescriptor.TodoService;

const server = new grpc.Server();

const todos = [
    {
        id : '1', tittle : 'todo1', content : 'content of todo 1'
    },
    {
        id : '2', tittle : 'todo2', content : 'content of todo 2'
    }
]

server.addService(todoService.service, {
    listTodos: (call, callback) => {
        callback(null, todos)
    },

    createTodo : (call, callback) => {
        let incomingNewTodo = call.request;
        todos.push(incomingNewTodo);
        callback(null, incomingNewTodo)
    },

    getTodo : (call, callback) => {
        let incomingTodoRequest = call.request;
        let incominId = incomingTodoRequest.id;

        const response = todos.filter((ele) => ele.id == incominId);

        if(response.length > 0){
            callback(null, response)
        }
        else{
            callback({
                msg : 'no todo with given id found'
            }, null); 
        }
    }
})

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server Started');
    server.start();
});
