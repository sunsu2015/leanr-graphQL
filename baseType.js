const express = require('express');
const {buildSchema} = require('graphql');
const graphqlHttp = require('express-graphql');

// salary(city: String): Int
const schema = buildSchema(`
    input AccountInput {
        name: String
        age: Int
        sex: String
        department: String
    }
    type Account {
        name: String
        age: Int
        sex: String
        department: String
        
    }
    type Query {
        getClassMates(classNo: Int!): [String]
        account(username: String): Account,
        accounts: [Account]
    }
    type Mutation {
        createAccount(input: AccountInput!): Account
        updateAccount(id: ID!, input: AccountInput!): Account
    }
`)

const fakeDb = {};
const root = {
    getClassMates({classNo}) {
        const obj = {
            31: ['张三'],
            41: ['李四'],
            51: ['王五']
        }
        return obj[classNo];
    },
    account({username}) {
        const name = username;
        const sex = 'man';
        const age = 18;
        const department = 'IT';
        const salary = ({city}) => {
            if (city === '北京' || city === '上海') {
                return 10000;
            } else {
                return 3000;
            }
        };
        return {
            name,
            sex,
            age,
            department
        }
    },
    accounts() {
        const arr = [];
        for (const key in fakeDb) {
            console.log(key);
            arr.push(fakeDb[key]);
        }
        return arr;
    },
    createAccount({input}) {
        fakeDb[input.name] = input;
        return input;
    },
    updateAccount({id, input}) {
        fakeDb[id] = Object.assign({}, fakeDb[id], input);
        return fakeDb[id];
    }
}

const app = express();

app.use('/graphql', graphqlHttp({
    schema,
    rootValue: root,
    graphiql: true
}));

app.use(express.static('public'));

app.listen(3000);