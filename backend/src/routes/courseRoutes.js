import { Router } from "express";
import {
    allCourses,
    individualCourse,
} from "../controllers/course.controller.js";

const router = Router();

// for home page we need all courses selected details
router.route("/home").get(allCourses);

// for course page we need perticular course all details
router.route("/:id").get(individualCourse);

export default router;