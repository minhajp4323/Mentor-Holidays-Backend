import packagesSchema from "../model/packagesSchema.js";
import { joiPackageSchema } from "../model/validateSchema.js";

export const addPackage = async (req, res) => {
  try {
    const { value, error } = joiPackageSchema.validate(req.body);
    const { destination, duration, category, price, images, description } =
      value;

    if (error) {
      console.log(error);
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const addedPackage = await packagesSchema.create({
      destination,
      duration,
      category,
      price,
      images,
      description,
    });

    res.status(200).json({
      status: "success",
      message: "Package added successfully",
      data: addedPackage,
    });
    console.log(addedPackage);
  } catch (err) {
    console.error("Error adding package:", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while adding the package",
    });
  }
};

export const allPackages = async (req, res) => {
  try {
    const allPacks = await packagesSchema.find();
    if (!allPacks) {
      res.status(404).json({ status: "Error", message: "No packages found" });
    } else {
      res.status(200).json({
        status: "Success",
        message: "Fetched all Packages successfully",
        data: allPacks,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export const PackageById = async (req, res) => {
  try {
    const packId = req.params.id;
    const packById = await packagesSchema.findById(packId);
    if (!packById) {
      return res.status(404).json({
        status: "Not found",
        message: "Package not found in the database",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Successfully fetched package by ID",
      data: packById,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    // res.status(500).json({ error: "Minhaj" });
  }
};

export const updatePackageById = async (req, res) => {
    console.log('Request body:', req.body); // Log the incoming request body
  
    const packId = req.params.id;
    const { value, error } = joiPackageSchema.validate(req.body);
    const { destination, duration, category, price, images, description } = value;
  
    if (error) {
      return res
        .status(404)
        .json({ status: "Not found", message: error.details[0].message });
    }
  
    try {
      const updatedPackage = await packagesSchema.findByIdAndUpdate(
        packId,
        {
          $set: {
            destination,
            duration,
            category,
            price,
            images,
            description,
          },
        },
        { new: true, runValidators: true }
      );
      if (updatedPackage) {
        res.status(200).json({
          status: "Success",
          message: "Updated Successfully",
          data: updatedPackage,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "No package found",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while updating the package",
      });
    }
  };
  