/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

function validateSize(size) {
    const parsedSize = parseInt(size);
    return isNaN(parsedSize) ? 10 : parsedSize;
}
function validatePageSet(pageSet) {
    const parsedPageSet = parseInt(pageSet);
    return isNaN(parsedPageSet) ? 0 : parsedPageSet;
}
const FilterButton = ({ size, pageSet, children }) => {
    return (
        <Link
            to={`?size=${validateSize(size)}&pageSet=${validatePageSet(
                pageSet
            )}`}
            className="text-sm font-light text-black bg-slate-100 py-2 px-4 mx-2 cursor-pointer rounded-3xl"
        >
            {children}
        </Link>
    );
};
const ChangePageButton = ({ size, pageSet, move, children }) => {
    const validatedPageSet = validatePageSet(pageSet);
    const validatedSize = validateSize(size);
    if (move === "forward") {
        pageSet = validatedPageSet + validatedSize;
    } else if (move === "backward") {
        // here we are blocking the page from going negative
        pageSet =
            validatedPageSet - validatedSize < 0
                ? 0
                : validatedPageSet - validatedSize;
    }
    return (
        <Link
            to={`?size=${validatedSize}&pageSet=${pageSet}`}
            className="text-sm font-light text-black bg-slate-100 py-2 px-4 mx-2 cursor-pointer rounded-3xl"
        >
            {children}
        </Link>
    );
};

export { FilterButton, ChangePageButton };