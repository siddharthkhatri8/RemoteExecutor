import { errorHandler } from "../utils/errorHandler.js";
import data from "../../db/problems.json" with { type: "json" };

export const QuestionsList = (req, res, next) => {
    try {
        // pageSet will have the previous request's last page's index
        const { size, pageSet } = req.query;
        // validation
        // there may be possible error in this condition for array indexing
        // bug fix >=
        if (Number.parseInt(pageSet) + Number.parseInt(size) >= data.length) {
            res.status(200).json({
                data: data.slice(
                    data.length - size,
                    Number.parseInt(data.length)
                ),
                end: true,
            });
        } else {
            // we are supposed to save the data in DB and but due to complexity in pagination we will call all data at once from DB in backas end as it starts.
            res.status(200).json({
                data: data.slice(
                    pageSet,
                    Number.parseInt(pageSet) + Number.parseInt(size)
                ),
                end: false,
            });
        }
    } catch (error) {
        errorHandler(res, error);
    }
};