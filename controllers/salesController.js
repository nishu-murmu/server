import Sales from "../models/salesModel.js";

// store the scan files data
export const createArray = async (req, res, next) => {
  try {
    const collectedArray = await Sales.insertMany(req.body);
    res.status(200).json(collectedArray);
  } catch (err) {
    next(err);
  }
};
// update the status
export const update = async (req, res, next) => {
  try {
    const allSales = await Sales.updateOne(
      { AWB: req.body.awb },
      {
        $set: {
          status: req.body.status,
          date: req.body.date,
        },
      }
    );
    res.status(200).json(allSales);
  } catch (err) {
    next(err);
  }
};
// show the current scanned product
export const awbfilter = async (req, res, next) => {
  try {
    const filterList = await Sales.find({
      AWB: req.body.awb,
      $set: {
        date: req.body.date,
      },
    });
    res.status(200).json(filterList);
  } catch (err) {
    next(err);
  }
};
// status filters
export const filter = async (req, res, next) => {
  try {
    const filterList = await Sales.find({
      $and: [
        {
          status: { $eq: req.body.filter },
        },
        {
          date: { $gte: req.body.sd, $lte: req.body.ed },
        },
      ],
    });
    res.status(200).json(filterList);
  } catch (err) {
    next(err);
  }
};
// filter Count
export const filterCount = async (req, res, next) => {
  try {
    const count = await Sales.find({
      $and: [
        {
          status: { $eq: req.body.filter },
        },
        {
          date: { $gte: req.body.sd, $lte: req.body.ed },
        },
      ],
    }).count();
    res.status(200).json(count);
  } catch (err) {
    next(err);
  }
};
export const dispatch = async (req, res, next) => {
  try {
    const getList = await Sales.find({
      status: "dispatch",
    });
    res.status(200).json(getList);
  } catch (err) {
    next(err);
  }
};
export const updatemapped = async (req, res, next) => {
  try {
    const updateMapped = await Sales.updateOne(
      { _id: req.body.id },
      {
        $set: {
          mastersku: req.body.mastersku,
        },
      }
    );
    res.status(200).json(updateMapped);
  } catch (err) {
    next(err);
  }
};
export const getAll = async (req, res, next) => {
  try {
    const getList = await Sales.find();
    res.status(200).json(getList);
  } catch (err) {
    next(err);
  }
};
export const grouped = async (req, res, next) => {
  try {
    var duplicatesID = [];
    const groupedData = await Sales.aggregate(
      [
        {
          $group: {
            _id: {
              "ORDER ID": "$ORDER ID",
            },
            dups: { $addToSet: "$_id" },
            total: { $sum: 1 },
          },
        },
        {
          $match: {
            total: {
              $gt: 1,
            },
          },
        },
      ],
      {
        allowDiskUse: true,
      }
    );
    groupedData.forEach((doc) => {
      doc.dups.shift();
      doc.dups.forEach((dupId) => {
        duplicatesID.push(dupId);
      });
    });
    const deleted = await Sales.deleteMany({
      _id: { $in: duplicatesID },
    });
    const finalArray = await Sales.find();
    res.status(200).json(finalArray);
  } catch (err) {
    next(err);
  }
};
