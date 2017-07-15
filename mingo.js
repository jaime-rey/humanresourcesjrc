/**
 * Created by Jaime on 15/07/2017.
 */
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const db = mongoose.connection;
const dbUrl = 'mongodb://jaimerey:jaimerey123@ds147052.mlab.com:47052/humanresources';
<!-- pg 132 -->
<!-- an company -->

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

function insertTeams(callback) {
    Team.create(
        [
            {
                name: 'Product Development'
            },
            {
                name: 'Dev Ops'
            },
            {
                name: 'Accounting'
            }
        ], (error, result) => {
            if (error) {
                console.log(error);
            } else {
                console.dir(result);
                console.log("----------------------------------------------------");
                console.dir(result[0]);
                console.dir("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                console.dir(result[0]._id);
                console.dir(result[1]._id);
                console.dir(result[2]._id);

                let pd = result[0];
                let devops = result[1];
                let acct = result[2];
                callback(null, pd, devops, acct);
            }
        }
    )
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
        ], (error, result) => {
            if (error) {
                return callback(error);
            } else {
                console.info('employees successfully added');
                callback(null, result);
            }
        }
    )
}

mongoose.connect(dbUrl, {
    useMongoClient: true,
    /* other options */
}, (err) => {
    if (err) {
        return console.log('problem ' + err);
    }
    console.log('connected!');

    insertTeams((err, pd, devops, acct) => {
        if (err) {
            return console.log(err);
        }

        insertEmployees(pd, devops, acct, (err, result) => {
            if (err) {
                console.error(err)
            } else {
                console.info('db activity complete')
            }
            db.close();
        })
    })

});