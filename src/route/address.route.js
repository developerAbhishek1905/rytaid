import { Router } from "express";
import { addCountry,getAllCountries,getStatesByCountryId,getCitiesByStateId,getPincodesByCityId } from "../controller/address.controller.js";

const router = Router();

// Add Country - Protected, Admin only
router.post("/country", addCountry);

// Get All Countries - Public
router.get("/countries", getAllCountries);
router.get("/states/by-country/:country_id", getStatesByCountryId);
router.get("/cities/state/:state_id", getCitiesByStateId);
router.get("/pincodes/city/:city_id", getPincodesByCityId);



export default router;