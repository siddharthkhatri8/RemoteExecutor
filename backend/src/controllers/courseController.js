import { errorHandler, createError } from "../utils/errorHandler.js";
import data from "../../db/course.json" with { type: "json" };

export const allCourses = async (req, res, next) => {
    try {
        const courseList = data.map((course, i) => {
            return { courseName: course.courseName, chapters: course.chapters };
        });
        res.json({ courseList });
    } catch (error) {
        errorHandler(res, error);
    }
};

export const individualCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        for (const course of data) {
            if (course.courseName === id) {
                return res.status(200).json(course);
            }
        }
        throw createError("Course Not found, Invalid name", 404);
    } catch (error) {
        errorHandler(res, error);
    }
};