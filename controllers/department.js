const Department = require('../models/department');

exports.postDepartment = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  Department.create({
    name: name,
    description: description,
    employeeId: null
  })
    .then(result => {
      res.status(201).json({
        message: 'The Department was created'
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Creating a department failed!'
      });
    });
}

exports.getDepartments = (req, res, next) => {
  // take the offset and limit for pagination
  const limit = +req.query.pageSize;
  const offset = (+req.query.pageNumber - 1) * limit;
  console.log(limit, offset)
  if (limit && req.query.pageNumber) {
    Department
      .findAndCountAll({
        limit,
        offset,
      })
      .then(departments => {
        if (departments.count < offset) {
          throw err;
        }
        res.status(201).json({
          message: 'GET request succeeded!',
          departments: departments.rows,
          totalNumber: departments.count
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error in getting the departments from server!'
        });
      });
  } else {
    Department
      .findAndCountAll()
      .then(departments => {
        if (departments.count < offset) {
          throw err;
        }
        res.status(201).json({
          message: 'GET request succeeded!',
          departments: departments.rows,
          totalNumber: departments.count
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error in getting the departments from server!'
        });
      });
  }
}

exports.getDepartment = (req, res, next) => {
  const departmentId = +req.params.id;
  Department
    .findByPk(departmentId)
    .then(department => {
      res.status(200).json({
        message: "Department found!",
        department: department
      })
    })
    .catch(err => {
      res.status(500).json({
        message: "No department was found!"
      })
    });
}

exports.updateDepartment = (req, res, next) => {
  const id = req.body.id;
  // the updated values
  const updatedName = req.body.name;
  const updatedDescription = req.body.description;
  const adminId = req.body.employeeId;
  // find the department that we want to update
  Department
    .findByPk(id)
    .then(department => {
      console.log(department);
      department.name = updatedName;
      department.description = updatedDescription;
      // save the update department in the database
      department
        .save()
        // if succeeded send message to user
        .then(result => {
          res.status(200).json({
            message: "The Department was updated!"
          });
        })
        // if failed send err to user
        .catch(err => {
          res.status(500).json({
            message: "Error in saving the updated Department!"
          });
        });
    })
    // if the department to update wasn't found, send err to user
    .catch(err => {
      res.status(500).json({
        message: "No department was found to update!"
      });
    });
}

exports.deleteDepartment = (req, res, next) => {
  // get the department id
  const id = req.params.id;
  Department
    // find the department with the 'id'
    .findByPk(id)
    .then(department => {
      department
        // delete the department form the database
        .destroy()
        //send message to the frontend
        .then(result => {
          res.status(200).json({
            message: "The department was deleted"
          });
        })
        // if the department couldn't be destroyed
        .catch(err => {
          res.status(500).json({
            message: 'Error in deleting the department!'
          })
        })
    })
    // if the department wasn't found
    .catch(err => {
      res.status(500).json({
        message: 'Error in finding the department to delete!'
      })
    })
}

