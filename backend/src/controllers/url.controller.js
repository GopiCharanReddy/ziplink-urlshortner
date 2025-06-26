import { URL } from "../models/url.model.js";
import { nanoid } from "nanoid";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import {shortenUrlSchema} from '../validators/url.validators.js';

const generateShortUrl = asynchandler(async (req, res) => {
  const validatedShortUrl = shortenUrlSchema.parse(req.body)
  const { url } = validatedShortUrl;
  if (!url) {
    throw new ApiError(403, "Url is required.");
  }

  let shortId, message;
  const existingUrl = await URL.findOneAndUpdate({ redirectUrl: url });
  if (existingUrl) {
    shortId = existingUrl.shortId;
    message = "Short Url already exists for this long Url";
    return res.json({ id: shortId, message: "Url already exists." });
  } else {
    shortId = nanoid(8);
    message = "Short Url generated successfully.";
    await URL.create({
      shortId,
      redirectUrl: url,
      visitHistory: [],
    });
  }
  return res.status(200).json(new ApiResponse(200, { shortId }, message));
});

const redirectShortUrl = asynchandler(async (req, res) => {
  const { shortId } = req.params;
  const url = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamps: Date.now() } } },
    { new: true }
  );
  if (!url) {
    throw new ApiError(404, "Url not found.");
  }
  const redirectUrl = url.redirectUrl;

  if (!redirectUrl) {
    throw new ApiError(404, "Redirect Url not found.");
  }
  return res.status(301).redirect(redirectUrl);
});

const getAnalytics = asynchandler(async (req, res) => {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  if (!result) {
    throw new ApiError(404, "Analytics history not found.");
  }
  if (result.owner && result.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to view analytics for this URL."
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, {
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
      })
    );
});
export { generateShortUrl, redirectShortUrl, getAnalytics};
