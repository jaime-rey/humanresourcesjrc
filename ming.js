/**
 * Created by Jaime on 25/06/2017.
 */
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const db = mongoose.connection;
const dbUrl = 'mongodb://jaimerey:jaimerey123@ds147052.mlab.com:47052/humanresources';
<!-- pg 129 -->
<!-- an co -->

let TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

let EmployeeSchema = new Schema({
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    image: {
        type: String,
        default: 'images/user.png'
    },
    address: {
        lines: {
            type: [String]
        },
        postal: {
            type: String
        }
    }
});

let Employee = mongoose.model('Employee', EmployeeSchema);

let Team = mongoose.model('Team', TeamSchema);

db.on('error', () => {
    console.log('there was an error communicaring with the database');
});

// mongoose.connect(dbUrl, {
//     useMongoClient: true
// }, (err) => {
//
//     if (err) {
//         return console.log('there was a problem connecting to the database ' + err);
//     }
//
//     console.log('connected');
// let team = new Team({
//     name: 'Product Development'
// });

// Team.create([{
//     name: 'Product Development3'
// }, {
//     name: 'Dev Ops'
// }, {
//     name: 'Accounting'
// }], (error, pd, devops, acct) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.dir(pd);
//         console.dir(devops);
//         console.dir(acct);
//
//         db.close();
//         process.exit(0);
//     }
// });

// team.save((error, data) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.dir(data);
//     }
//
//     db.close();
//     process.exit();
// });
//
// });

function insertTeams(callback) {
    Team.create([{
        name: 'Product Development'
    }, {
        name: 'Dev Ops'
    }, {
        name: 'Accounting'
    }], (error, pd, devops, acct) => {
        if (error) {
            return callback(error);
        } else {
            console.dir(pd);
            console.dir(devops);
            console.dir(acct);
            console.info('team succesfully added');
            callback(null, pd, devops, acct);
        }
    });
}

function insertEmployees(pd, devops, acct, callback) {
    Employee.create(
        [
            {
                name: {
                    first: 'John',
                    last: 'Adams'
                },
                team: pd._id,
                address: {
                    lines: ['2 Lincoln MemorialCir NW'],
                    zip: 20037
                }
            }
            ,
            {
            name: {
                first: 'Thomas',
                last: 'Jefferson'
            },
            team: devops._id,
            address: {
                lines: ['another address'],
                zip: 12345
            }
            },
            {
            name: {
                first: 'James',
                last: 'Madison'
            },
            team: acct._id,
            address: {
                lines: ['another address'],
                zip: 12345
            }
        }
        ], (error, johnadams) => {
            if (error) {
                return callback(error);
            } else {
                console.info('employees successfully added');
                callback(null, {
                    team: pd,
                    employee: johnadams
                });
            }
        }
    )
}

mongoose.connect(dbUrl, (err) => {
    if (err) {
        return console.log(('there was a problem connecting to db ' + err));
    }

    console.log('connected!');
    insertTeams((err, pd, devops, acct) => {
        if (err) {
            return console.log(err);
        }
        insertEmployees(pd, devops, acct, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.info('db activity complete');
            }


        });
        db.close();
    });
});