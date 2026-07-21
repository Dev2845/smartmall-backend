const Address = require("../models/Address");

exports.addAddress = async (req, res) => {

  try {

    const {
      fullName,
      mobile,
      alternateMobile,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      country,
      pincode,
      addressType,
      isDefault
    } = req.body;

    // જો નવું Address Default છે તો જૂના Default દૂર કરો
    if (isDefault) {

      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );

    }

    const address = await Address.create({

      user: req.user.id,

      fullName,

      mobile,

      alternateMobile,

      addressLine1,

      addressLine2,

      landmark,

      city,

      state,

      country,

      pincode,

      addressType,

      isDefault

    });

    res.status(201).json({

      success: true,

      message: "Address Added Successfully",

      address

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.getAllAddresses = async (req, res) => {
  try {

    const addresses = await Address.find({
      user: req.user.id
    }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      total: addresses.length,
      addresses
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getAddressById = async (req, res) => {

  try {

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    res.status(200).json({
      success: true,
      address
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.updateAddress = async (req, res) => {

  try {

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    if (req.body.isDefault) {

      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );

    }

    Object.assign(address, req.body);

    await address.save();

    res.status(200).json({
      success: true,
      message: "Address Updated Successfully",
      address
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.deleteAddress = async (req, res) => {

  try {

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    await address.deleteOne();

    res.status(200).json({
      success: true,
      message: "Address Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.setDefaultAddress = async (req, res) => {

  try {

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    await Address.updateMany(
      { user: req.user.id },
      { isDefault: false }
    );

    address.isDefault = true;

    await address.save();

    res.status(200).json({
      success: true,
      message: "Default Address Updated",
      address
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};