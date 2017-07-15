/**
 * Created by Jaime on 24/06/2017.
 */
const employeeDB = require('../database/employees');

//console.log(employeeDB);

exports.getEmployees = getEmployees;
exports.getEmployee = getEmployee;

function getEmployees(callback) {
    setTimeout(() => {
        callback(null, employeeDB);
    }, 500);
}

function getEmployee(employeeId, callback) {

    getEmployees((error, data) => {
        if (error) {
            return callback(error);
        }
        let result = data.find(item => {
            return item.userId === employeeId;
        });
        callback(null, result);
    });
}