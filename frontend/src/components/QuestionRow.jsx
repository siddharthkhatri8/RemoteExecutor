import { Link } from "react-router-dom";

const Questions = ({ data, diffculity }) => {
    return (
        <tr className={data.index % 2 === 0 ? "bg-white" : "bg-slate-100"}>
            <td className="p-3 w-52">{data.index}.</td>
            <td className="p-3 w-3/4">
                <Link
                    // here we doing data.index reduced by 1 because in the database(Practise.json) we have an array and in each of its element the actual array index is (x) and the user defined index as a property names "index" is (x+1). So we reducing 1
                    to={`/problem/${data.index - 1}`}
                    className="hover:text-blue-600"
                >
                    {data.title}
                </Link>
            </td>
            <td className={diffculity.color + " p-3 w-52"}>
                {diffculity.text}
            </td>
        </tr>
    );
};

export default Questions;