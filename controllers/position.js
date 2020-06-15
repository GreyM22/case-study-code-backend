const Department = require('../models/department');
const Position = require('../models/job-position');

exports.postPosition = (req, res, next) => {
  // the id of the department
  // where we will insert the new job postion
  const departmentId = req.body.departmentId;
  // the information for the new job position
  const newNameJobPosition = req.body.name;
  const newDescriptionJobPosition = req.body.description;
  // find the department in the database
  Department
    .findByPk(departmentId)
    .then(department => {
      // create the job position in the department
      department
        .createPosition({
          name: newNameJobPosition,
          description: newDescriptionJobPosition
        })
        // the new job position was added successfully
        .then(result => {
          res.status(200).json({
            message: "The job position was added to the department!"
          });
        })
        // error in inserting the new job position
        .catch(err => {
          res.status(500).json({
            message: "There was an error in inserting the new job position"
          });
        })
    })
    // if the department was deleted
    .catch(err => {
      res.status(500).json({
        message: "The department was not found, pick anther department for the job position"
      });
    });
}

exports.getPositions = (req, res, next) => {
  // take the offset and limit from the query
  // the req
  const limit = +req.query.pageSize;
  const offset = (+req.query.pageNumber - 1) * limit;
  console.log( limit, offset)
  // take the id of the department
  const id = req.params.departmentId;
  // find information about the department
  // with the 'id'

  // in case there is pagination
  if (limit && req.query.pageNumber) {
    Department
      .findByPk(id)
      .then(department => {
        // get all the position this
        // department has
        department
          .getPositions({
            limit: limit,
            offset: offset
          })
          .then(positions => {
            Position.count({
              where: { departmentId: id},
              distinct: true,
              col: 'Position.id'
            })
            .then(function(count) {
                // count is an integer
                res.status(200).json({
                  message: 'Success in getting the job positions of the department',
                  positions: positions,
                  totalNumber: count
                });
            });
          })
          // in case of error from the database
          .catch(err => {
            res.status(500).json({
              message: 'Error in getting the positions of the department! '
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
        department
          .getPositions()
          .then(positions => {
            Position.count({
              where: { departmentId: id},
              distinct: true,
              col: 'Position.id'
            })
            .then(function(count) {
                // count is an integer
                res.status(200).json({
                  message: 'Success in getting the job positions of the department',
                  positions: positions,
                  totalNumber: count
                });
            });
          })
          // in case of error from the database
          .catch(err => {
            res.status(500).json({
              message: 'Error in getting the positions of the department! '
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

exports.getPosition = (req, res, next) => {
  // get the id of the position from the request
  const positionId = req.params.positionId;
  // get the position from the database
  Position
    .findByPk(positionId)
    // send the position in the front-end
    .then(position => {
      res.status(200).json({
        message: 'Success in position GET request',
        position: position
      })
    })
    // in case no job position was found
    .catch(err => {
      res.status(500).json({
        message: "No position was found from the database!"
      })
    })
}

exports.updatePosition = (req, res, next) => {
  // get the id of the department
  // the position belongs to
  const departmentId = req.body.departmentId;
  Department
    .findByPk(departmentId)
    .then(department => {
      // the data that will be updated
      const positionId = req.body.id;
      const updatedPositionName = req.body.name;
      const updatePositionDescription = req.body.description;
      // find the job position in the department
      department
        .getPositions({ where: { id: positionId } })
        // update the information of the job position
        .then(position => {
          if (!position[0]) {
            return res.status(500).json({
              message: "The Job Position wasn't found in the department!"
            });
          }
          position[0].name = updatedPositionName;
          position[0].description = updatePositionDescription;
          position[0]
            // save the changes in the database
            .save()
            .then(result => {
              res.status(200).json({
                message: "The Job Position was updated!"
              });
            })
            // in case the changes couldn't be saved
            .catch(err => {
              res.status(500).json({
                message: "Error from server, the Job Position couldn't be saved!"
              })
            })
        })
        // in case the position wasn't found
        .catch(err => {
          res.status(500).json({
            message: "The Job Position wasn't found in the department!"
          });
        })
    })
    // in case the department wasn't found
    .catch(err => {
      res.status(500).json({
        message: "Couldn't find the department the job position belongs to!"
      })
    })
}

exports.deletePosition = (req, res, next) => {
  // get the id of the position
  const positionId = req.params.positionId;
  // get the position form the database
  Position
    .findByPk(positionId)
    .then(position => {
      position
        .destroy()
        // success in deleting the position
        .then(result => {
          res.status(200).json({
            message: "The job position was deleted!"
          });
        })
        // in case of err in deleting the job position
        .catch(err => {
          res.status(500).json({
            message: "Error in deleting the job position form the database"
          });
        });
    })
    // in case the position wasn't found
    .catch(err => {
      res.status(500).json({
        message: "No job position was found from the server!"
      });
    });
}
