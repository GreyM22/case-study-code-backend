const Department = require('../models/department');
const Position = require('../models/job-position');
const Employee = require('../models/employee');
const EmployeePosition = require('../models/employee-position');
const sequelize = require('../util/database');

exports.postEmployee = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  // get department id from request
  const departmentId = +req.body.departmentId;
  console.log(departmentId);
  Department
    .findByPk(departmentId)
    // if the department was found
    .then(department => {
      console.log(req.body);
      // get the data of the employee from the request
      const employeeName = req.body.name;
      const employeeSurname = req.body.surname;
      const employeeAddress = req.body.address;
      const employeeEmail = req.body.email;
      const employeePhone = req.body.phone;
      const employeeAge = req.body.age;
      const employeeBirthday = new Date(req.body.birthday);
      const employeeJobExperience = req.body.jobExperience;
      const employeePhoto = url + '/uploads/' + req.files[0].filename;
      const employeeCV = url + '/uploads/' + req.files[1].filename;
      const employeePersonalID = req.body.personalID;
      // get the id of the job position
      // the employee is assigned to
      const idJobPosition = req.body.jobPosition;
      // create the employee of the department
      department
        .createEmployee({
          name: employeeName,
          surname: employeeSurname,
          address: employeeAddress,
          email: employeeEmail,
          phone: employeePhone,
          age: employeeAge,
          birthday: employeeBirthday,
          jobExperience: employeeJobExperience,
          photo: employeePhoto,
          cv: employeeCV,
          personalID: employeePersonalID,
          fired: false
        })
        .then((data) => {
          // the employee created from the database
          const employee = data;
          // get the job position
          // the employee is assigned to
          Position
            .findByPk(idJobPosition)
            // if the job position was found
            .then(position => {
              EmployeePosition
                .create({
                  current: true,
                  positionId: position.id,
                  employeeId: employee.id
                })
                // employee
                //   .addPosition(position, { through: { current: true } })
                // send message of success to the front-end
                .then(result => {
                  console.log(result);
                  res.status(200).json({
                    message: "The employee was created successfully!"
                  })
                })
                // if the position couldn't be added
                .catch(err => {
                  res.status(500).json({
                    message: "The server couldn't add the job position to the employee"
                  })
                })
            })
            // in case the job position wasn't found
            .catch(err => {
              res.status(500).json({
                message: 'The job position assigned to the employee,' +
                  ' was not found in the database,  but the employee was created!'
              })
            })
        })
        // in case was an error in creating
        .catch(err => {
          console.log(err);
          res.status(500).json({
            message: 'Error form server in creating the new employee!'
          })
        })
    })
    // in case the department wasn't found
    .catch(err => {
      res.status(500).json({
        message: 'No department was found from the database!'
      });
    });
}

exports.getEmployees = (req, res, next) => {
  // get the offset and limit of the page
  const limit = +req.query.pageSize;
  const offset = (+req.query.pageNumber - 1) * limit;
  // take the id of the department
  const id = req.params.departmentId;
  // find information about the department
  // with the 'id'
  // if there is no data for pagination
  if (limit && req.query.pageNumber) {
    Department
      .findByPk(id)
      .then(department => {
        // get all the position this
        // department has
        department
          .getEmployees({
            where: { fired: false },
            limit: limit,
            offset: offset
          })
          .then(employees => {
            Employee.count({
              where: { departmentId: id, fired: 0 },
              distinct: true,
              col: 'Employee.id'
            })
              .then(function (count) {
                // count is an integer
                res.status(200).json({
                  message: 'Success in getting the job employees of the department',
                  employees: employees,
                  totalNumber: count
                });
              });
          })
          // in case of error from the database
          .catch(err => {
            res.status(500).json({
              message: 'Error in getting the employees of the department! '
            })
          })
      })
      //if the department wasn't found
      .catch(err => {
        res.status(500).json({
          message: "Couldn't get information about the department!"
        });
      });
  } else {
    Department
      .findByPk(id)
      .then(department => {
        // get all the position this
        // department has
        console.log(department);
        department
          .getEmployees({
            where: { fired: false }
          })
          .then(employees => {
            res.status(200).json({
              message: 'Success in getting the job employees of the department',
              employees: employees
            });
          })
          // in case of error from the database
          .catch(err => {
            res.status(500).json({
              message: 'Error in getting the employees of the department! '
            })
          })
      })
      //if the department wasn't found
      .catch(err => {
        res.status(500).json({
          message: "Couldn't get information about the department!"
        });
      });
  }
}

exports.getEmployeeJobPosition = (req, res, next) => {
  // get the employees position
  const id = req.params.employeeID;
  // find the employee in the database
  EmployeePosition
    .findAll({ where: { employeeId: id, current: true } })
    .then(employeePositions => {
      if (!employeePositions[0]) {
        throw 'No job position was found for the employee!'
      }
      const employeeCurrentJobPosition = employeePositions[0].positionId;
      Position
        .findByPk(employeeCurrentJobPosition)
        .then(position => {
          res.status(200).json({
            message: "The employee position was found!",
            position: position
          })
        })
        .catch(err => {
          res.status(500).json({
            message: "Couldn't get the job positions of the employee!"
          })
        })
    })
    .catch(err => {
      res.status(500).json({
        message: "Couldn't find the employee in the database!"
      })
    })
}

exports.getEmployee = (req, res, next) => {
  // get the id of the employee from the request
  const employeeId = req.params.employeeID;
  console.log(employeeId);
  // get the employee from the database
  Employee
    .findByPk(employeeId)
    // send the employee in the front-end
    .then(employee => {
      if (employee === null) {
        throw err;
      }
      res.status(200).json({
        message: 'Success in employee GET request',
        employee: employee
      })
    })
    // in case no job position was found
    .catch(err => {
      res.status(500).json({
        message: "No employee was found from the database!"
      })
    })
}

exports.postEditEmployee = async (req, res, next) => {
  try {
    // retrieve the data of the employee from
    // the request
    const id = +req.body.employeeID;
    const updatedName = req.body.employeeName;
    const updatedSurname = req.body.employeeSurname;
    const updatedAddress = req.body.employeeAddress;
    const updatedEmail = req.body.employeeEmail;
    const updatedPhone = req.body.employeePhone;
    const updatedAge = +req.body.employeeAge;
    const updatedBirthday = new Date(req.body.employeeBirthday);
    const updatedJobExperience = req.body.employeeJobExperience;
    const updatedPersonalID = req.body.personalID;
    const updatedDepartment = +req.body.departmentId;
    const updatedJobPosition = +req.body.jobPosition;
    const url = req.protocol + "://" + req.get("host");
    // check if we have a file or a string for the photo
    let updatedPhoto = req.body.photo;
    let updatedCV = req.body.cv;
    if (req.files.length) {
      req.files.forEach(file => {
        if (file.mimetype === 'application/pdf') {
          updatedCV = url + "/uploads/" + file.filename;
        } else {
          updatedPhoto = url + "/uploads/" + file.filename;
        }
      })
    }
    // search the employee by his/her id
    const employee = await Employee.findByPk(id)
    if (employee.fired) {
      throw 'This employee was fired!'
    }
    // save all the data of the employee
    employee.name = updatedName;
    employee.surname = updatedSurname;
    employee.address = updatedAddress;
    employee.email = updatedEmail;
    employee.phone = updatedPhone;
    employee.age = +updatedAge;
    employee.birthday = updatedBirthday;
    employee.jobExperience = updatedJobExperience;
    employee.photo = updatedPhoto;
    employee.cv = updatedCV;
    employee.personalID = updatedPersonalID;

    const positions = await EmployeePosition.findAll({ where: { current: true, employeeId: id } });
    if (!positions[0]) {
      throw 'No current position was found for the employee!';
    }
    if (positions[0].positionId === +updatedJobPosition) {
      await employee.save();
      return res.status(200).json({
        message: "The employee was updated successfully"
      })

    }
    employee.departmentId = +updatedDepartment;
    const savedEmployee = await employee.save()
    // change the current status to false
    positions[0].current = false;
    const result = await positions[0].save();
    if (!result) {
      throw "Error in saving the new job position for the employee!";
    }
    // create new position for employee
    const employeePosition = await EmployeePosition.create({
      current: true,
      positionId: +updatedJobPosition,
      employeeId: +id
    });
    res.status(200).json({
      message: "The employee was updated successfully"
    })
  } catch (err) {
    res.status(500).json({
      message: err
    })
  }
}

exports.getEmployeeJobHistory = (req, res, next) => {
  // get the employees from the url
  const employeeID = req.params.employeeID;
  // get all the job positions the
  // employee has been in
  const query = "SELECT employeepositions.id," +
    " employeepositions.positionId," +
    " employeepositions.createdAt," +
    " positions.name," +
    " employeepositions.current" +
    " FROM `case-study`.employeepositions" +
    " inner join `case-study`.positions" +
    " on employeepositions.positionId=positions.id" +
    " where employeepositions.employeeId=" + employeeID
  sequelize.query(query)
    .then(([results, metadata]) => {
      res.status(200).json({
        message: "The employee's job history was retrieve successfully!",
        jobHistory: results
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err
      })
    })
}

exports.fireEmployee = (req, res, next) => {
  // get the offset and limit of the page
  const limit = +req.query.pageSize;
  const offset = (+req.query.pageNumber - 1) * limit;
  // get the employee id from the url
  const id = req.params.employeeID;
  let departmentID;
  Employee
    .findByPk(id)
    .then(employee => {
      employee.fired = true;
      departmentID = employee.departmentId;
      return employee.save()
    })
    .then(result => {
      // remove the employee from the job position
      // he/she had
      return EmployeePosition.findAll({ where: { current: true, employeeId: id } })
    })
    .then(jobPositions => {
      if (!jobPositions[0]) {
        throw "The employee was fired and wasn't assing to any job position!"
      }
      jobPositions[0].current = false;
      return jobPositions[0].save()
    })
    // check the employees department
    // in case he was a administrator
    .then(result => {
      return Department.findByPk(departmentID);
    })
    // in case the employee was the admin
    // of the department
    // remove it
    .then(department => {
      if (department.employeeId === +id) {
        department.employeeId = null;
        return department.save();
      } else {
        return department;
      }
    })
    // in case everything went well
    .then(result => {
      res.status(200).json({
        message: "The employee has been fired!"
      });
    })
    // in case of error from the server
    .catch(err => {
      if (err) {
        res.status(500).json({
          message: err
        });
      } else {
        res.status(500).json({
          message: 'Error from server!'
        })
      }
    })
}

exports.searchEmployee = (req, res, next) => {
  // get the offset and limit of the page
  const limit = +req.query.pageSize;
  const offset = (+req.query.pageNumber - 1) * limit;
  // get the search term
  const parameter = req.params.searchTerm;
  let parameters = parameter.split(' ');
  // search in employee
  let query = "SELECT positions.name as 'positionName' , employees.photo, " +
    " employees.name, employees.surname, employees.id \n" +
    " FROM `case-study`.positions \n" +
    " inner join `case-study`.employeepositions \n" +
    " on positions.id=employeepositions.positionId and employeepositions.current=true \n" +
    " inner join `case-study`.employees \n" +
    " on employeepositions.employeeId=employees.id \n" +
    " where ";
  let countQuery = 'select count(*) as result from employees where employees.id in (' +
    "SELECT employees.id" +
    " FROM `case-study`.positions \n" +
    " inner join `case-study`.employeepositions \n" +
    " on positions.id=employeepositions.positionId \n" +
    " inner join `case-study`.employees \n" +
    " on employeepositions.employeeId=employees.id \n" +
    " where ";
  parameters = parameters.filter(parameter => parameter !== '')
  parameters.forEach((parameter, index, data) => {
    // check if there is a white space
    console.log(query);
    query = query + " positions.name like '%" + parameter + "%' or employees.name like'%" + parameter +
      "%' or employees.surname like '%" + parameter + "%' ";
    countQuery = countQuery + " positions.name like '%" + parameter +
      "%' or employees.name like'%" + parameter +
      "%' or employees.surname like '%" + parameter + "%' ";

    if (index === (data.length - 1)) {
      if (limit && req.query.pageNumber) {
        query += ' limit ' + offset + ',' + limit + ';';
      } else {
        query += ';';
      }
      countQuery += ');';
    } else {
      query += ' or ';
      countQuery += ' or '
    }
  })
  sequelize.query(query)
    .then(([results, metadata]) => {
      sequelize.query(countQuery)
        .then(([count, metadata]) => {
          res.status(200).json({
            message: "The query was executed successfully!",
            searchResult: results,
            totalNumber: count[0].result
          });
        })
    })
    // error in executing the query
    .catch(err => {
      res.status(500).json({
        message: "Error in executing the query from the server!"
      })
    })
}

exports.searchFiredEmployees = (req, res, next) => {
  // get the offset and limit of the page
  const limit = +req.query.pageSize;
  const offset = (+req.query.pageNumber - 1) * limit;
  // get the search term
  const parameter = req.params.searchTerm;
  let parameters;
  if (parameter) {
    parameters = parameter.split(' ');
  }
  // search in employee
  let query = "SELECT max(employeepositions.createdAt) as 'startedDate'," +
    " positions.name as 'positionName' , employees.photo, " +
    " employees.name, employees.surname, employees.id, " +
    "departments.id as 'departmentId', departments.name as 'departmentName'" +
    " FROM `case-study`.positions \n" +
    " inner join `case-study`.employeepositions \n" +
    " on positions.id=employeepositions.positionId \n" +
    " inner join `case-study`.employees \n" +
    " on employeepositions.employeeId=employees.id \n" +
    " inner join `case-study`.departments \n" +
    " on departments.id=employees.departmentId \n" +
    " where (";
  let countQuery = 'select count(*) as result from employees where employees.id in (' +
    "SELECT employees.id" +
    " FROM `case-study`.positions \n" +
    " inner join `case-study`.employeepositions \n" +
    " on positions.id=employeepositions.positionId \n" +
    " inner join `case-study`.employees \n" +
    " on employeepositions.employeeId=employees.id \n" +
    " inner join `case-study`.departments \n" +
    " on departments.id=employees.departmentId \n" +
    " where (";
  if (parameter) {
    parameters = parameters.filter( thisParameter => thisParameter !== '')
    parameters.forEach((parameter, index, data) => {
      query = query + " positions.name like '%" + parameter +
        "%' or employees.name like'%" + parameter +
        "%' or departments.name like'%" + parameter +
        "%' or employees.surname like '%" + parameter + "%' ";
      countQuery = countQuery + " positions.name like '%" + parameter +
        "%' or employees.name like'%" + parameter +
        "%' or departments.name like'%" + parameter +
        "%' or employees.surname like '%" + parameter + "%' ";

      if (index === (data.length - 1)) {
        // in case there is pagination
        if (limit && req.query.pageNumber) {
          query += ') and employees.fired=true group by employees.id' +
            ' limit ' + offset + ',' + limit + ';';

        } else {
          query += ') and employees.fired=true group by employees.id';
        }
        countQuery += ') and employees.fired=true group by employees.id);';
      } else {
        query += ' or ';
        countQuery += ' or ';
      }
    });
  } else {
    query += ' employees.fired=true group by employees.id;';
    countQuery += ' employees.fired=true group by employees.id);';

  }

  sequelize.query(query)
    .then(([results, metadata]) => {
      sequelize.query(countQuery)
        .then(([count, metadata]) => {
          res.status(200).json({
            message: "The query was executed successfully!",
            searchResult: results,
            totalNumber: count[0].result
          });
        })
        .catch(err => { throw err });
    })
    // error in executing the query
    .catch(err => {
      res.status(500).json({
        message: "Error in executing the query from the server!"
      })
    });
}
