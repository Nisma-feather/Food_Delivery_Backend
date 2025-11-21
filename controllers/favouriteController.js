const Favourite = require("../models/Favourite");

const toggleFavourite = async (req, res) => {
  try {
    const { userId, foodId } = req.body;
     console.log("favourite toggle", userId,foodId)
    if (!userId || !foodId) {
      return res.status(400).json({ message: "Missing details" });
    }

    // Step 1: Find doc
    let fav = await Favourite.findOne({ userId });

    if (!fav) {
      // Create new favourite document
      fav = await Favourite.create({
        userId,
        favouriteItems: [foodId],
      });

      return res.status(200).json({
        success: true,
        message: "Added to favourites",
        favouriteItems: fav.favouriteItems,
      });
    }

    // Step 2: Check if already favourite
    const alreadyFav = fav.favouriteItems.some(
      (id) => id.toString() === foodId
    );

    let updatedFav;

    if (alreadyFav) {
      // Remove from favourites
      updatedFav = await Favourite.findOneAndUpdate(
        { userId },
        { $pull: { favouriteItems: foodId } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Removed from favourites",
        favouriteItems: updatedFav.favouriteItems,
      });
    } else {
      // Add to favourites
      updatedFav = await Favourite.findOneAndUpdate(
        { userId },
        { $addToSet: { favouriteItems: foodId } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Added to favourites",
        favouriteItems: updatedFav.favouriteItems,
      });
    }
  } catch (error) {
    console.error("Favourite toggle error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getUserFavourites = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "UserId missing" });
    }

    const favouriteDoc = await Favourite.findOne({ userId }).populate(
      "favouriteItems", "name image price description"
    ); // optional: populate food details

    console.log(favouriteDoc)
   
    return res.status(200).json({
      favouriteItems: favouriteDoc ? favouriteDoc.favouriteItems : [],
    });
  } catch (error) {
    console.error("Favourites fetch error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { toggleFavourite,getUserFavourites};
