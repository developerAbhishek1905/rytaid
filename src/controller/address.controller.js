import  Country  from "../model/country.model.js";
import  State  from "../model/state.model.js";
import City  from "../model/city.model.js";
import  Pincode  from "../model/pincode.model.js";


//  Add Country
export const addCountry = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Country name and code are required",
      });
    }

    const existingCountry = await Country.findOne({ $or: [{ name }, { code }] });

    if (existingCountry) {
      return res.status(400).json({
        success: false,
        message: "Country with this name or code already exists",
      });
    }

    const country = await Country.create({ name, code,countryId:await Country.countDocuments()+1 });

    res.status(201).json({
      success: true,
      message: "Country added successfully",
      country,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: 1 }); // Sort by name ascending

    res.status(200).json({
      success: true,
      countries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export const getCountryById = async (req, res) => {
  try {
    const { countryId } = req.params;

    const country = await Country.findOne({ countryId: countryId });

    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    res.status(200).json({
      success: true,
      country,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStatesByCountryId = async (req, res) => {
  try {
    const country_id = Number(req.params.country_id);
    console.log("country_id:", country_id);

    const states = await State.find({ country_id });

    if (!states.length) {
      return res.status(404).json({
        success: false,
        message: "No states found for this country"
      });
    }

    res.status(200).json({
      success: true,
      states
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCitiesByStateId = async (req, res) => {
  try {
    const state_id = Number(req.params.state_id);
    console.log(state_id)

    if (isNaN(state_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid state_id"
      });
    }

    const cities = await City.find({ state_id }).sort({ city_name: 1 });

    res.status(200).json({
      success: true,
      count: cities.length,
      cities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPincodesByCityId = async (req, res) => {
  try {
    const city_id = Number(req.params.city_id);

    if (isNaN(city_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid city_id"
      });
    }

    const pincodes = await Pincode.find({ city_id }).sort({ pincode: 1 });

    res.status(200).json({
      success: true,
      count: pincodes.length,
      pincodes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};