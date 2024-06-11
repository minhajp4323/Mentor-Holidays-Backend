import jwt from "jsonwebtoken";
import users from "../model/userSchema.js";
import { joiPropertySchema } from "../model/validateSchema.js";
import properties from "../model/productSchema.js";

//login
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { username: username },
      process.env.ADMIN_ACCESS_TOKEN
    );
    return res.status(200).json({
      status: "Success",
      message: "Succesfully logged in",
      data: token,
    });
  } else {
    res.status(400).json({ status: "Error", message: "incorrect admin ID" });
  }
};

//all user

export const AllUser = async (req, res) => {
  try {
    const allUser = await users.find();
    if (!allUser) {
      res.status(404).json({
        status: "Not found",
        message: "No users found",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Fetched all users",
      data: allUser,
    });
  } catch (err) {
    console.log(err);
  }
};

//user by id

export const userById = async (req, res) => {
  try {
    const userId = req.params.id;
    const userById = await users.findById(userId);
    if (!userById) {
      res
        .status(404)
        .json({ status: "Not found", message: "User not foud by id" });
    }
    res.status(200).json({
      status: "Success",
      message: "Succesfully fetched user by id",
      data: userById,
    });
  } catch (err) {
    console.error(err);
  }
};
// add propeprties

export const addProperties = async (req, res) => {
  try {
    const { value, error } = joiPropertySchema.validate(req.body);
    const {
      title,
      price,
      location,
      bedroom,
      bathroom,
      images,
      description,
      category,
    } = value;
    console.log(value);

    if (error) {
      res
        .status(400)
        .json({ status: "Error", message: error.details[0].message });
    } else {
      const addedProperty = await properties.create({
        title,
        price,
        location,
        bedroom,
        bathroom,
        images,
        description,
        category,
      });
      res.status(200).json({
        status: "Success",
        message: "Added properties Successfully",
        data: addedProperty,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Display all properties

export const allProperties = async (req, res) => {
  try {
    const allProps = await properties.find();
    console.log(allProps);
    if (!allProps) {
      res.status(404).json({ status: "Error", message: "No properties found" });
    } else {
      res.status(200).json({
        status: "Success",
        message: "Fetched all users successfully",
        data: allProps,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// displaying single Property by id

export const propertById = async (req, res) => {
  try {
    const propId = req.params.id;
    const propById = await properties.findById(propId);

    if (!propById) {
      res
        .status(404)
        .json({ status: "Not found", message: "Property not found" });
    } else {
      res.status(200).json({
        status: "Success",
        message: "Successfully fetched property by id",
        data: propById,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

//edit by id

export const updatePropById = async (req, res) => {
  const propId = req.params.id;
  const { value, error } = joiPropertySchema.validate(req.body);

  if (error) {
    res
      .status(404)
      .json({ status: "Not found", message: error.details[0].message });
  }

  const {
    title,
    price,
    location,
    bedroom,
    bathroom,
    images,
    description,
    category,
  } = value;

  try {
    const updatedProduct = await properties.findByIdAndUpdate(
      propId,
      {
        $set: {
          title,
          price,
          location,
          bedroom,
          bathroom,
          images,
          description,
          category,
        },
      },
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.status(200).json({
        status: "Success",
        message: "Updated Successfully",
        data: updatedProduct,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "no property found",
      });
    }
  } catch (error) {
    console.error(error);
  }
};
//delete porperty

export const deleteProperty = async (req, res) => {
  const propId = req.params.id;
  if (!propId) {
    res.status(404).json({ status: "Not found", message: "Product not found" });
  }
  const deletedProperty = await properties.findByIdAndDelete(propId);

  if (!deletedProperty) {
    res
      .status(404)
      .json({ status: "Error", message: "Error while deleting property" });
  } else {
    res.status(404).json({
      status: "Success",
      message: "Successfully deleted the property",
    });
  }
};
