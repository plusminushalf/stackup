import express from "express";
import { validate } from "../../middlewares";
import * as addressValidation from "../../validations/address.validation";
import * as addressController from "../../controller/address.controller";

const router = express.Router();

router
  .route("/:address")
  .post(validate(addressValidation.post), addressController.post);

router
  .route("/:address/activity")
  .get(validate(addressValidation.getActivity), addressController.getActivity);

router
  .route("/:address/guardians")
  .get(
    validate(addressValidation.getGuardians),
    addressController.getGuardians
  );

export default router;
