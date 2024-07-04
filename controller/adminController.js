import jwt from "jsonwebtoken";
import users from "../model/userSchema.js";
import { joiPropertySchema } from "../model/validateSchema.js";
import properties from "../model/productSchema.js";
import Booking from "../model/BookingSchema.js";
import User from "../model/userSchema.js";


export const login = async (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { username: username },
      process.env.ADMIN_ACCESS_TOKEN,
      { expiresIn: '1h' } 
    );
    return res.status(200).json({
      status: "Success",
      message: "Successfully logged in",
      token: token,
      data: {
        username: username,
      }
    });
  } else {
    res.status(400).json({ status: "Error", message: "Incorrect admin ID" });
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
      maxGuest,
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
        maxGuest,
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
    maxGuest,
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
          maxGuest,
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
    res
      .status(404)
      .json({ status: "Not found", message: "Product not found in db" });
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

//get booking

export const getAllBooking = async (req, res) => {
  try {
    const bookingCount = await Booking.countDocuments();
    const usersWithBookings = await User.find().populate({
      path: "bookings",
      populate: { path: "property" },
    });

    const bookingsData = usersWithBookings.map((user) => ({
      userId: user._id,
      username: user.username,
      email: user.email,
      bookings: user.bookings.map((booking) => ({
        title: booking.title,
        bookingId: booking.bookingId,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        numberOfGuests: booking.numberOfGuests,
        amount: booking.amount,
        currency: booking.currency,
        paymentDate: booking.paymentDate,
        receipt: booking.receipt,
        
      })),
    }));
    console.log(bookingsData);

    res.status(200).json({
      status: "Success",
      message: "Fetched all bookings",
      data: bookingsData,
      dataCount: bookingCount,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//total revenue

export const totalRevenue = async (req, res) => {
  try {
    const totalRevenue = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    if (totalRevenue.length === 0) {
      totalRevenue.push({ total: 0 });
    }
    res.status(200).json({
      status: "Success",
      message: "Fetched the total revenue successfully",
      data: totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ error: "Error calculating revenue" });
  }
};

//


export const getPropertyRevenue = async (req, res) => {
  try {
    const propertiesWithRevenue = await properties.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "property",
          as: "bookings",
        },
      },
      {
        $unwind: "$bookings"
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$title" },
          totalRevenue: { $sum: "$bookings.amount" },
          bookings: {
            $push: {
              _id: "$bookings._id",
              checkInDate: "$bookings.checkInDate",
              checkOutDate: "$bookings.checkOutDate"
            }
          }
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalRevenue: 1,
          bookings: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "Success",
      message: "Fetched properties and their total revenue successfully",
      data: propertiesWithRevenue,
    });
  } catch (error) {
    console.error("Error fetching properties and revenue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};